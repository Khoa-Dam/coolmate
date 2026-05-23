---
name: novawear-backend-architect
description: backend architecture and database design guidance for the novawear ecommerce project. use when designing, reviewing, or implementing nestjs backend modules, supabase postgresql schemas, drizzle orm migrations, jwt authentication, product/cart/order APIs, seed data, and frontend-backend contract compatibility for the novawear/coolmate-inspired fashion store.
---

# Novawear Backend Architect

## Purpose

Use this skill to produce practical backend plans, schemas, API contracts, and implementation guidance for NovaWear: a Vietnamese D2C fashion ecommerce MVP inspired by common Coolmate-style shopping flows without copying Coolmate assets, data, text, logo, or pixel-perfect UI.

The default backend target is:
- NestJS + TypeScript
- REST API
- Supabase PostgreSQL as the hosted database provider
- Drizzle ORM + drizzle-kit for schema, migrations, and queries
- JWT authentication with USER and ADMIN roles
- bcrypt password hashing
- DTO validation with class-validator/class-transformer

## Default Scope

Keep the backend focused on these MVP domains:

1. Authentication + User
2. Product + Cart
3. Checkout + Order

Do not add wishlist, reviews, coupon systems, real payment integrations, shipping providers, inventory warehouses, social login, forgot password, or analytics dashboards unless the user explicitly asks.

## Workflow

1. Identify the task type:
   - database/schema design
   - NestJS module/API design
   - Drizzle implementation
   - frontend-backend contract mapping
   - backend review/debugging
2. Apply the scope and rules in this file.
3. Load the relevant reference only when needed:
   - `references/database-drizzle.md` for Supabase PostgreSQL + Drizzle schema design.
   - `references/nestjs-backend.md` for NestJS modules, guards, DTOs, and services.
   - `references/api-contract.md` for API response shapes and frontend compatibility.
4. Produce code or plans that are minimal, consistent, and implementation-ready.
5. Call out assumptions and avoid inventing features outside the MVP.

## Hard Rules

- Use Supabase only as PostgreSQL hosting.
- Do not use Supabase Auth for this project unless explicitly requested.
- Do not query Supabase directly from the frontend.
- Use Drizzle ORM as the database schema, migration, and query layer.
- Do not use Prisma if the user has chosen Drizzle.
- Use snake_case for database table and column names.
- Use camelCase/PascalCase in TypeScript application code.
- Store prices as integer VND, not floats.
- Store passwords as `password_hash`; never return it from APIs.
- Use JWT for auth and a RolesGuard for ADMIN-only routes.
- Use soft delete for products via `is_active` when order history may depend on products.
- Copy product snapshots into `order_items` at checkout time.

## Required Backend Domains

### Auth + Users

Required concepts:
- `users` table
- `USER` and `ADMIN` roles
- register/login/me endpoints
- bcrypt password hashing
- JWT access token
- JwtAuthGuard
- RolesGuard
- CurrentUser decorator

Minimum endpoints:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /users/me`

Optional/admin endpoints only if requested:
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`

### Product + Cart

Required concepts:
- categories
- products
- product_images
- product_options for size/color combinations
- cart_items tied to logged-in users only

Minimum product endpoints:
- `GET /products`
- `GET /products/:id`
- `GET /products/slug/:slug`
- `POST /products` ADMIN
- `PATCH /products/:id` ADMIN
- `DELETE /products/:id` ADMIN or soft delete

Minimum cart endpoints:
- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/:itemId`
- `DELETE /cart/items/:itemId`
- `DELETE /cart`

### Checkout + Order

Required concepts:
- orders
- order_items
- payment method enum: COD, VNPAY_MOCK
- payment status enum: PENDING, PAID, FAILED
- order status enum: PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED

Minimum order endpoints:
- `POST /orders/checkout`
- `GET /orders`
- `GET /orders/:id`
- `GET /admin/orders` ADMIN
- `GET /admin/orders/:id` ADMIN
- `PATCH /admin/orders/:id/status` ADMIN

Checkout must:
- require login
- reject empty cart
- validate shipping info
- calculate totals server-side
- create order and order_items in a transaction
- copy product name/image/price/size/color to order_items
- clear cart after successful order creation

## Response Standards

When asked for a plan, provide:
- short overview
- file/folder structure
- ordered implementation steps
- acceptance criteria
- risks/assumptions

When asked for schema, provide:
- enums
- tables
- relationships
- constraints/indexes
- Drizzle folder layout
- migration/seed commands
- frontend mapping notes

When asked for code, provide complete file-level snippets with paths. Avoid vague fragments.

## Safety and Copyright Boundaries

NovaWear may be inspired by common ecommerce flows, but do not use or recommend using:
- Coolmate logos
- Coolmate real product names
- Coolmate real images
- Coolmate marketing copy or slogans
- scraped Coolmate data
- pixel-perfect copies

Use fake products, legal placeholder images, and original Vietnamese copy.
