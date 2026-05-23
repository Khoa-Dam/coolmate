# Coolmate Clone Rules

## Scope

The goal is to recreate the user experience and ecommerce patterns of Coolmate, not to copy proprietary implementation, private data, or protected assets.

## Pages and flows to prioritize

1. Home page: hero, promotion areas, product collections, category navigation, trust/benefit sections.
2. Product listing page: filters, sorting, product grid, badges, responsive behavior.
3. Product detail page: gallery, variants, size selector, price, promotion, add to cart, recommendations.
4. Cart: item quantity, remove item, subtotal, promotion messaging, checkout CTA.
5. Checkout shell: customer info, shipping/payment placeholders, order summary.
6. Account/order pages only after core shopping flows work.

## Ecommerce behavior

- Product cards should support image, name, color/variant hint, price, compare-at price, discount badge, and availability.
- Product detail should clearly handle selected variant, missing selection, stock status, and add-to-cart feedback.
- Cart state should be predictable and testable.
- Navigation should work without hidden dead ends.

## Clone boundaries

- Do not copy Coolmate source code.
- Do not scrape protected endpoints or bypass anti-bot controls.
- Do not use copyrighted images/logos unless the user provides authorized assets.
- Use original component names and implementation.

## Quality bar

Every finished UI should feel production-like: aligned spacing, responsive behavior, accessible interactions, no obvious placeholder text unless explicitly marked as mock data.
