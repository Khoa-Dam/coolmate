import { index, integer, pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { productOptions, products } from './products.schema';
import { users } from './users.schema';

export const cartItems = pgTable(
  'cart_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    productOptionId: uuid('product_option_id').references(() => productOptions.id).notNull(),
    quantity: integer('quantity').notNull().default(1),
    priceAtTime: integer('price_at_time').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    index('cart_items_user_id_idx').on(table.userId),
    uniqueIndex('cart_items_user_product_option_unique').on(table.userId, table.productId, table.productOptionId),
  ],
);
