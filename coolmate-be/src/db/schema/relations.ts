import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { categories } from './categories.schema';
import { products, productImages, productOptions } from './products.schema';
import { cartItems } from './carts.schema';
import { orders, orderItems } from './orders.schema';

// Users relations
export const usersRelations = relations(users, ({ many }) => ({
  cartItems: many(cartItems),
  orders: many(orders),
}));

// Categories relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// Products relations
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  options: many(productOptions),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productOptionsRelations = relations(
  productOptions,
  ({ one }) => ({
    product: one(products, {
      fields: [productOptions.productId],
      references: [products.id],
    }),
  }),
);

// Cart relations
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  productOption: one(productOptions, {
    fields: [cartItems.productOptionId],
    references: [productOptions.id],
  }),
}));

// Orders relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  productOption: one(productOptions, {
    fields: [orderItems.productOptionId],
    references: [productOptions.id],
  }),
}));
