import { index, integer, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { orderStatusEnum, paymentMethodEnum, paymentStatusEnum } from './enums';
import { productOptions, products } from './products.schema';
import { users } from './users.schema';

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    code: varchar('code', { length: 50 }).notNull(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    shippingName: varchar('shipping_name', { length: 255 }).notNull(),
    shippingPhone: varchar('shipping_phone', { length: 20 }).notNull(),
    shippingAddress: text('shipping_address').notNull(),
    shippingCity: varchar('shipping_city', { length: 255 }).notNull(),
    shippingDistrict: varchar('shipping_district', { length: 255 }).notNull(),
    shippingWard: varchar('shipping_ward', { length: 255 }).notNull(),
    shippingNote: text('shipping_note'),
    paymentMethod: paymentMethodEnum('payment_method').notNull(),
    paymentStatus: paymentStatusEnum('payment_status').notNull().default('PENDING'),
    orderStatus: orderStatusEnum('order_status').notNull().default('PENDING'),
    subtotal: integer('subtotal').notNull(),
    shippingFee: integer('shipping_fee').notNull().default(0),
    discount: integer('discount').notNull().default(0),
    totalAmount: integer('total_amount').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('orders_code_unique').on(table.code),
    index('orders_user_id_idx').on(table.userId),
    index('orders_code_idx').on(table.code),
    index('orders_order_status_idx').on(table.orderStatus),
  ],
);

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    productOptionId: uuid('product_option_id').references(() => productOptions.id).notNull(),
    productName: varchar('product_name', { length: 255 }).notNull(),
    productImage: text('product_image').notNull(),
    size: varchar('size', { length: 50 }).notNull(),
    colorName: varchar('color_name', { length: 100 }).notNull(),
    colorValue: varchar('color_value', { length: 50 }).notNull(),
    price: integer('price').notNull(),
    quantity: integer('quantity').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [index('order_items_order_id_idx').on(table.orderId), index('order_items_product_id_idx').on(table.productId)],
);
