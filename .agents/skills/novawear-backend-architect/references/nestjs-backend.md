# NestJS Backend Reference

## Target Backend

Use NestJS with TypeScript, REST APIs, Drizzle ORM, Supabase PostgreSQL, JWT authentication, bcrypt password hashing, and DTO validation.

## Recommended Folder Structure

```txt
backend/
  src/
    main.ts
    app.module.ts
    common/
      decorators/
        current-user.decorator.ts
        roles.decorator.ts
      guards/
        jwt-auth.guard.ts
        roles.guard.ts
      types/
        authenticated-user.type.ts
    db/
      index.ts
      schema/
      seed.ts
    auth/
      auth.module.ts
      auth.controller.ts
      auth.service.ts
      dto/
        login.dto.ts
        register.dto.ts
      strategies/
        jwt.strategy.ts
    users/
      users.module.ts
      users.controller.ts
      users.service.ts
      dto/
        update-user.dto.ts
    products/
      products.module.ts
      products.controller.ts
      products.service.ts
      dto/
        create-product.dto.ts
        update-product.dto.ts
        product-query.dto.ts
    cart/
      cart.module.ts
      cart.controller.ts
      cart.service.ts
      dto/
        add-to-cart.dto.ts
        update-cart-item.dto.ts
    orders/
      orders.module.ts
      orders.controller.ts
      orders.service.ts
      dto/
        checkout.dto.ts
        update-order-status.dto.ts
```

## Modules

### AuthModule

Endpoints:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Rules:
- Hash passwords with bcrypt.
- Login returns `{ accessToken, user }`.
- Use JwtStrategy and JwtAuthGuard.
- Exclude `password_hash` from returned user objects.

### UsersModule

Endpoints:
- `GET /users/me`
- Optional admin: `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`

Rules:
- Normal users can access their own profile.
- Admin-only routes require `ADMIN` role.

### ProductsModule

Endpoints:
- `GET /products`
- `GET /products/:id`
- `GET /products/slug/:slug`
- `POST /products` ADMIN
- `PATCH /products/:id` ADMIN
- `DELETE /products/:id` ADMIN

Rules:
- Public product list returns active products only.
- Admin routes can include inactive products.
- Delete should soft delete with `is_active=false` unless hard delete is explicitly requested and safe.
- Include images/options when returning product detail.

### CartModule

Endpoints:
- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/:itemId`
- `DELETE /cart/items/:itemId`
- `DELETE /cart`

Rules:
- All routes require login.
- Cart is per user only; no guest cart by default.
- Adding the same product option should increase quantity.
- Validate stock before add/update.
- Return computed totals.

### OrdersModule

Endpoints:
- `POST /orders/checkout`
- `GET /orders`
- `GET /orders/:id`
- `GET /admin/orders` ADMIN
- `GET /admin/orders/:id` ADMIN
- `PATCH /admin/orders/:id/status` ADMIN

Rules:
- Checkout must run in a database transaction.
- Reject empty cart.
- Re-check stock at checkout.
- Copy product snapshots into `order_items`.
- Clear cart after successful checkout.
- User can only view their own orders.
- Admin can view all orders and update status.

## DTOs

Minimum DTOs:
- `RegisterDto`: name, email, password
- `LoginDto`: email, password
- `CreateProductDto`: categoryId, name, slug, description, price, originalPrice, imageUrl, stock, images, options
- `UpdateProductDto`: partial create product fields
- `AddToCartDto`: productId, productOptionId, quantity
- `UpdateCartItemDto`: quantity
- `CheckoutDto`: shippingInfo, paymentMethod
- `UpdateOrderStatusDto`: orderStatus

## Guards and Decorators

Use:
- `@CurrentUser()` to access authenticated user.
- `@Roles('ADMIN')` for admin routes.
- `JwtAuthGuard` for private routes.
- `RolesGuard` for role authorization.

## Response Conventions

Prefer consistent response shape:

```ts
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
```

For paginated lists:

```ts
type PaginatedResponse<T> = {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
```

## Implementation Priorities

1. Setup NestJS backend.
2. Setup Drizzle + Supabase connection.
3. Create schema/migrations.
4. Implement auth + roles.
5. Implement product CRUD.
6. Implement cart CRUD.
7. Implement checkout/order.
8. Add seed data.
9. Add README and `.env.example`.
