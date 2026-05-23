import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { AuthUser } from '../common/types/auth-user.type';
import { db } from '../db';
import { cartItems, productOptions, products } from '../db/schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  async getCart(user: AuthUser) {
    const rows = await db.query.cartItems.findMany({ where: eq(cartItems.userId, user.id), with: { product: true, productOption: true } });
    const items = rows.map((item) => ({ id: item.id, productId: item.productId, productOptionId: item.productOptionId, slug: item.product.slug, name: item.product.name, imageUrl: item.product.imageUrl, price: item.priceAtTime, originalPrice: item.product.originalPrice, size: item.productOption.size, color: { name: item.productOption.colorName, value: item.productOption.colorValue }, quantity: item.quantity, stock: item.productOption.stock }));
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { success: true, message: 'Cart fetched successfully', data: { items, subtotal, shippingFee: 0, discount: 0, total: subtotal } };
  }

  async addItem(user: AuthUser, dto: AddToCartDto) {
    const [product] = await db.select().from(products).where(eq(products.id, dto.productId)).limit(1);
    if (!product || !product.isActive) throw new NotFoundException('Product not found');
    const [option] = await db.select().from(productOptions).where(and(eq(productOptions.id, dto.productOptionId), eq(productOptions.productId, dto.productId))).limit(1);
    if (!option) throw new NotFoundException('Product option not found');
    const [existing] = await db.select().from(cartItems).where(and(eq(cartItems.userId, user.id), eq(cartItems.productId, dto.productId), eq(cartItems.productOptionId, dto.productOptionId))).limit(1);
    const nextQuantity = (existing?.quantity ?? 0) + dto.quantity;
    if (nextQuantity > option.stock) throw new BadRequestException('Requested quantity exceeds stock');
    if (existing) await db.update(cartItems).set({ quantity: nextQuantity, updatedAt: new Date() }).where(eq(cartItems.id, existing.id));
    else await db.insert(cartItems).values({ userId: user.id, productId: dto.productId, productOptionId: dto.productOptionId, quantity: dto.quantity, priceAtTime: product.price });
    return this.getCart(user);
  }

  async updateItem(user: AuthUser, itemId: string, dto: UpdateCartItemDto) {
    const item = await db.query.cartItems.findFirst({ where: eq(cartItems.id, itemId), with: { productOption: true } });
    if (!item) throw new NotFoundException('Cart item not found');
    if (item.userId !== user.id) throw new ForbiddenException('Forbidden');
    if (dto.quantity > item.productOption.stock) throw new BadRequestException('Requested quantity exceeds stock');
    await db.update(cartItems).set({ quantity: dto.quantity, updatedAt: new Date() }).where(eq(cartItems.id, itemId));
    return this.getCart(user);
  }

  async removeItem(user: AuthUser, itemId: string) {
    const [item] = await db.select().from(cartItems).where(eq(cartItems.id, itemId)).limit(1);
    if (!item) throw new NotFoundException('Cart item not found');
    if (item.userId !== user.id) throw new ForbiddenException('Forbidden');
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
    return this.getCart(user);
  }

  async clear(user: AuthUser) {
    await db.delete(cartItems).where(eq(cartItems.userId, user.id));
    return this.getCart(user);
  }
}
