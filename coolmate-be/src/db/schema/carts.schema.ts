import {
  pgTable,
  uuid,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { products, productOptions } from './products.schema';

export const cartItems = pgTable(
  'cart_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    productId: uuid('product_id')
      .references(() => products.id)
      .notNull(),
    productOptionId: uuid('product_option_id')
      .references(() => productOptions.id)
      .notNull(),
    quantity: integer('quantity').notNull().default(1),
    priceAtTime: integer('price_at_time').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('cart_items_unique').on(
      table.userId,
      table.productId,
      table.productOptionId,
    ),
  ],
);
