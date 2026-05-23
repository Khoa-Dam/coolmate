import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, count, eq, gte, ilike, lte, SQL } from 'drizzle-orm';
import { db } from '../db';
import { categories, productImages, productOptions, products } from '../db/schema';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';

type ProductWithRelations = typeof products.$inferSelect & {
  category: typeof categories.$inferSelect;
  images: (typeof productImages.$inferSelect)[];
  options: (typeof productOptions.$inferSelect)[];
};

@Injectable()
export class ProductsService {
  async findAll(query: ProductQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const filters: SQL[] = [eq(products.isActive, true)];
    if (query.search) filters.push(ilike(products.name, `%${query.search}%`));
    if (query.minPrice !== undefined) filters.push(gte(products.price, query.minPrice));
    if (query.maxPrice !== undefined) filters.push(lte(products.price, query.maxPrice));
    if (query.category) {
      const [category] = await db.select().from(categories).where(eq(categories.slug, query.category)).limit(1);
      if (!category) return { success: true, message: 'Products fetched successfully', data: { items: [], meta: { page, limit, total: 0, totalPages: 0 } } };
      filters.push(eq(products.categoryId, category.id));
    }
    const where = and(...filters);
    const items = await db.query.products.findMany({ where, with: { category: true, images: true, options: true }, limit, offset: (page - 1) * limit });
    const [{ value: total }] = await db.select({ value: count() }).from(products).where(where);
    return { success: true, message: 'Products fetched successfully', data: { items: items.map((item) => this.mapProduct(item)), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } } };
  }

  async findById(id: string, includeInactive = false) {
    const product = await db.query.products.findFirst({ where: includeInactive ? eq(products.id, id) : and(eq(products.id, id), eq(products.isActive, true)), with: { category: true, images: true, options: true } });
    if (!product) throw new NotFoundException('Product not found');
    return { success: true, message: 'Product fetched successfully', data: this.mapProduct(product) };
  }

  async findBySlug(slug: string) {
    const product = await db.query.products.findFirst({ where: and(eq(products.slug, slug), eq(products.isActive, true)), with: { category: true, images: true, options: true } });
    if (!product) throw new NotFoundException('Product not found');
    return { success: true, message: 'Product fetched successfully', data: this.mapProduct(product) };
  }

  async create(dto: CreateProductDto) {
    const [existing] = await db.select().from(products).where(eq(products.slug, dto.slug)).limit(1);
    if (existing) throw new ConflictException('Product slug already exists');
    const categoryId = await this.resolveCategoryId(dto.categoryId, dto.category);
    const [created] = await db.insert(products).values({ categoryId, name: dto.name, slug: dto.slug, description: dto.description, price: dto.price, originalPrice: dto.originalPrice, imageUrl: dto.imageUrl, stock: dto.stock, isActive: dto.isActive ?? true }).returning();
    if (dto.images?.length) await db.insert(productImages).values(dto.images.map((image, index) => ({ productId: created.id, url: image.url, alt: image.alt, sortOrder: image.sortOrder ?? index })));
    await db.insert(productOptions).values(dto.options.map((option) => ({ productId: created.id, size: option.size, colorName: option.colorName, colorValue: option.colorValue, stock: option.stock })));
    return this.findById(created.id, true);
  }

  async update(id: string, dto: UpdateProductDto) {
    const values: Partial<typeof products.$inferInsert> = { updatedAt: new Date() };
    if (dto.categoryId || dto.category) values.categoryId = await this.resolveCategoryId(dto.categoryId, dto.category);
    if (dto.name) values.name = dto.name;
    if (dto.slug) values.slug = dto.slug;
    if (dto.description) values.description = dto.description;
    if (dto.price !== undefined) values.price = dto.price;
    if (dto.originalPrice !== undefined) values.originalPrice = dto.originalPrice;
    if (dto.imageUrl) values.imageUrl = dto.imageUrl;
    if (dto.stock !== undefined) values.stock = dto.stock;
    if (dto.isActive !== undefined) values.isActive = dto.isActive;
    const [updated] = await db.update(products).set(values).where(eq(products.id, id)).returning();
    if (!updated) throw new NotFoundException('Product not found');
    if (dto.images) {
      await db.delete(productImages).where(eq(productImages.productId, id));
      if (dto.images.length) await db.insert(productImages).values(dto.images.map((image, index) => ({ productId: id, url: image.url, alt: image.alt, sortOrder: image.sortOrder ?? index })));
    }
    if (dto.options) {
      await db.delete(productOptions).where(eq(productOptions.productId, id));
      if (dto.options.length) await db.insert(productOptions).values(dto.options.map((option) => ({ productId: id, size: option.size, colorName: option.colorName, colorValue: option.colorValue, stock: option.stock })));
    }
    return this.findById(id, true);
  }

  async remove(id: string) {
    const [updated] = await db.update(products).set({ isActive: false, updatedAt: new Date() }).where(eq(products.id, id)).returning();
    if (!updated) throw new NotFoundException('Product not found');
    const product = await db.query.products.findFirst({ where: eq(products.id, id), with: { category: true, images: true, options: true } });
    if (!product) throw new NotFoundException('Product not found');
    return { success: true, message: 'Product deleted successfully', data: this.mapProduct(product) };
  }

  private mapProduct(product: ProductWithRelations) {
    const colors = Array.from(new Map(product.options.map((option) => [option.colorValue, { name: option.colorName, value: option.colorValue }])).values());
    return { id: product.id, name: product.name, slug: product.slug, description: product.description, price: product.price, originalPrice: product.originalPrice, imageUrl: product.imageUrl, images: product.images.map((image) => image.url), category: product.category.slug, sizes: [...new Set(product.options.map((option) => option.size))], colors: colors.map((color) => color.name), options: product.options.map((option) => ({ id: option.id, size: option.size, color: { name: option.colorName, value: option.colorValue }, stock: option.stock })), stock: product.stock, isActive: product.isActive, createdAt: product.createdAt, updatedAt: product.updatedAt };
  }

  private async resolveCategoryId(categoryId?: string, categorySlug?: string) {
    if (categoryId) return categoryId;
    if (!categorySlug) throw new NotFoundException('Category not found');
    const [category] = await db.select().from(categories).where(eq(categories.slug, categorySlug)).limit(1);
    if (!category) throw new NotFoundException('Category not found');
    return category.id;
  }
}
