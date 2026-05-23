# Supabase PostgreSQL + Drizzle Database Reference

## Database Provider Rules

Use Supabase as PostgreSQL hosting only. Do not use Supabase Auth for the MVP. Do not expose Supabase database credentials to the frontend. All data access should go through the NestJS backend.

Use Drizzle ORM as the source of truth for schema definitions, migrations, and query typing. Do not use Prisma in this project once Drizzle has been selected.

## Required Enums

```ts
import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["USER", "ADMIN"]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "COD",
  "VNPAY_MOCK",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "PAID",
  "FAILED",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
]);
```

## Required Tables

Use snake_case names:
- `users`
- `categories`
- `products`
- `product_images`
- `product_options`
- `cart_items`
- `orders`
- `order_items`

## Table Design

### users

Purpose: store app-authenticated users for JWT login.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `name varchar not null`
- `email varchar not null unique`
- `password_hash text not null`
- `role user_role not null default 'USER'`
- `created_at timestamp not null default now()`
- `updated_at timestamp not null default now()`

Rules:
- Never return `password_hash` in API responses.
- Seed one admin user for development.

### categories

Columns:
- `id uuid primary key`
- `name varchar not null`
- `slug varchar not null unique`
- `description text null`
- `is_active boolean not null default true`
- `created_at timestamp not null default now()`
- `updated_at timestamp not null default now()`

Seed slugs:
- `ao-thun`
- `ao-polo`
- `quan-short`
- `do-mac-nha`
- `phu-kien`

### products

Columns:
- `id uuid primary key`
- `category_id uuid references categories(id)`
- `name varchar not null`
- `slug varchar not null unique`
- `description text not null`
- `price integer not null`
- `original_price integer null`
- `image_url text not null`
- `stock integer not null default 0`
- `is_active boolean not null default true`
- `created_at timestamp not null default now()`
- `updated_at timestamp not null default now()`

Rules:
- Store price as integer VND.
- Use `is_active=false` for soft delete.
- Do not use Coolmate real data or image assets.

### product_images

Columns:
- `id uuid primary key`
- `product_id uuid references products(id) on delete cascade`
- `url text not null`
- `alt varchar null`
- `sort_order integer not null default 0`
- `created_at timestamp not null default now()`

### product_options

Represents size/color variants.

Columns:
- `id uuid primary key`
- `product_id uuid references products(id) on delete cascade`
- `size varchar not null`
- `color_name varchar not null`
- `color_value varchar not null`
- `stock integer not null default 0`
- `created_at timestamp not null default now()`
- `updated_at timestamp not null default now()`

Constraint:
- unique `(product_id, size, color_value)`

### cart_items

Columns:
- `id uuid primary key`
- `user_id uuid references users(id) on delete cascade`
- `product_id uuid references products(id)`
- `product_option_id uuid references product_options(id)`
- `quantity integer not null default 1`
- `price_at_time integer not null`
- `created_at timestamp not null default now()`
- `updated_at timestamp not null default now()`

Constraint:
- unique `(user_id, product_id, product_option_id)`

Rules:
- User must login to use cart.
- Do not implement guest cart unless requested.
- Service layer validates stock and quantity.

### orders

Columns:
- `id uuid primary key`
- `code varchar not null unique`
- `user_id uuid references users(id)`
- `shipping_name varchar not null`
- `shipping_phone varchar not null`
- `shipping_address text not null`
- `shipping_city varchar not null`
- `shipping_district varchar not null`
- `shipping_ward varchar not null`
- `shipping_note text null`
- `payment_method payment_method not null`
- `payment_status payment_status not null default 'PENDING'`
- `order_status order_status not null default 'PENDING'`
- `subtotal integer not null`
- `shipping_fee integer not null default 0`
- `discount integer not null default 0`
- `total_amount integer not null`
- `created_at timestamp not null default now()`
- `updated_at timestamp not null default now()`

Rules:
- Generate human-readable unique order codes, e.g. `NW202605230001`.
- Do not store payment card data.

### order_items

Columns:
- `id uuid primary key`
- `order_id uuid references orders(id) on delete cascade`
- `product_id uuid references products(id)`
- `product_option_id uuid references product_options(id)`
- `product_name varchar not null`
- `product_image text not null`
- `size varchar not null`
- `color_name varchar not null`
- `color_value varchar not null`
- `price integer not null`
- `quantity integer not null`
- `created_at timestamp not null default now()`

Rules:
- Store snapshots from product/product_options at checkout time.
- Order history must remain correct even if product data changes later.

## Relationships

- users 1-n cart_items
- users 1-n orders
- categories 1-n products
- products 1-n product_images
- products 1-n product_options
- products 1-n cart_items
- products 1-n order_items
- product_options 1-n cart_items
- product_options 1-n order_items
- orders 1-n order_items

## Indexes and Constraints

Indexes:
- `users.email`
- `categories.slug`
- `products.slug`
- `products.category_id`
- `products.is_active`
- `cart_items.user_id`
- `orders.user_id`
- `orders.code`
- `orders.order_status`
- `order_items.order_id`

Unique constraints:
- `users.email`
- `categories.slug`
- `products.slug`
- `orders.code`
- `cart_items(user_id, product_id, product_option_id)`
- `product_options(product_id, size, color_value)`

Service-level validations:
- `price >= 0`
- `stock >= 0`
- `quantity > 0`
- `total_amount >= 0`
- `discount >= 0`
- `shipping_fee >= 0`

## Drizzle Folder Structure

```txt
backend/
  src/
    db/
      index.ts
      schema/
        enums.ts
        users.schema.ts
        categories.schema.ts
        products.schema.ts
        carts.schema.ts
        orders.schema.ts
        relations.ts
      seed.ts
  drizzle/
  drizzle.config.ts
  .env
  .env.example
```

## Drizzle Commands

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit tsx
npx drizzle-kit generate
npx drizzle-kit migrate
npx drizzle-kit studio
```

Suggested scripts:

```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio",
  "db:seed": "tsx src/db/seed.ts"
}
```

## Environment Variables

```env
DATABASE_URL=""
JWT_SECRET=""
JWT_EXPIRES_IN="7d"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```
