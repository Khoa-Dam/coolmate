import { boolean, index, integer, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { categories } from './categories.schema';

export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    categoryId: uuid('category_id').references(() => categories.id).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description').notNull(),
    price: integer('price').notNull(),
    originalPrice: integer('original_price'),
    imageUrl: text('image_url').notNull(),
    stock: integer('stock').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('products_slug_unique').on(table.slug),
    index('products_slug_idx').on(table.slug),
    index('products_category_id_idx').on(table.categoryId),
    index('products_is_active_idx').on(table.isActive),
  ],
);

export const productImages = pgTable(
  'product_images',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
    url: text('url').notNull(),
    alt: varchar('alt', { length: 255 }),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [index('product_images_product_id_idx').on(table.productId)],
);

export const productOptions = pgTable(
  'product_options',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
    size: varchar('size', { length: 50 }).notNull(),
    colorName: varchar('color_name', { length: 100 }).notNull(),
    colorValue: varchar('color_value', { length: 50 }).notNull(),
    stock: integer('stock').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    index('product_options_product_id_idx').on(table.productId),
    uniqueIndex('product_options_product_size_color_unique').on(table.productId, table.size, table.colorValue),
  ],
);
