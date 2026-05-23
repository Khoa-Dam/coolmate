# Frontend-Backend API Contract Reference

## Standard API Response

Use this shape across backend responses and frontend service types:

```ts
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  meta: PaginationMeta;
};
```

## Product Frontend Shape

```ts
export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  images: string[];
  category: string;
  sizes: string[];
  colors: { name: string; value: string }[];
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
```

Mapping:
- `products.id` -> `id`
- `products.name` -> `name`
- `products.slug` -> `slug`
- `products.description` -> `description`
- `products.price` -> `price`
- `products.original_price` -> `originalPrice`
- `products.image_url` -> `imageUrl`
- `product_images[]` -> `images`
- `categories.slug` -> `category`
- distinct `product_options.size` -> `sizes`
- distinct `product_options.color_name/color_value` -> `colors`
- `products.stock` or sum of `product_options.stock` -> `stock`
- `products.is_active` -> `isActive`
- timestamps -> ISO strings

## Cart Frontend Shape

```ts
export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  size: string;
  color: { name: string; value: string };
  quantity: number;
  stock: number;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
};
```

Mapping:
- `cart_items.id` -> `id`
- `products.id` -> `productId`
- `products.slug` -> `slug`
- `products.name` -> `name`
- `products.image_url` -> `imageUrl`
- `cart_items.price_at_time` -> `price`
- `products.original_price` -> `originalPrice`
- `product_options.size` -> `size`
- `product_options.color_name/color_value` -> `color`
- `cart_items.quantity` -> `quantity`
- `product_options.stock` -> `stock`

## Order Frontend Shape

```ts
export type Order = {
  id: string;
  code: string;
  userId: string;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: "COD" | "VNPAY_MOCK";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderStatus: "PENDING" | "CONFIRMED" | "SHIPPING" | "COMPLETED" | "CANCELLED";
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
};
```

Mapping:
- `orders.id` -> `id`
- `orders.code` -> `code`
- `orders.user_id` -> `userId`
- `order_items[]` -> `items`
- `shipping_*` columns -> `shippingInfo`
- enum fields -> camelCase fields
- integer totals -> number fields
- timestamps -> ISO strings

## Recommended Endpoints

Auth:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Products:
- `GET /products?page=&limit=&category=&search=`
- `GET /products/:id`
- `GET /products/slug/:slug`
- `POST /products` ADMIN
- `PATCH /products/:id` ADMIN
- `DELETE /products/:id` ADMIN

Cart:
- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/:itemId`
- `DELETE /cart/items/:itemId`
- `DELETE /cart`

Orders:
- `POST /orders/checkout`
- `GET /orders`
- `GET /orders/:id`
- `GET /admin/orders` ADMIN
- `GET /admin/orders/:id` ADMIN
- `PATCH /admin/orders/:id/status` ADMIN

## Error Shape

```ts
export type ApiError = {
  success: false;
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
};
```

Use proper HTTP status codes:
- 400 invalid input
- 401 unauthenticated
- 403 unauthorized role
- 404 not found
- 409 conflict such as duplicate email or slug
- 422 business rule violation such as insufficient stock
