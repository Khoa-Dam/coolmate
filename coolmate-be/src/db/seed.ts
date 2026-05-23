import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from './index';
import { categories, productImages, productOptions, products, users } from './schema';

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const colors = [
  { name: 'Đen', value: '#000000' },
  { name: 'Trắng', value: '#FFFFFF' },
  { name: 'Xám', value: '#808080' },
  { name: 'Xanh Navy', value: '#0F172A' },
];

async function seed() {
  const passwordHash = await bcrypt.hash('Admin@123456', 10);
  await db.insert(users).values({ name: 'NovaWear Admin', email: 'admin@novawear.local', passwordHash, role: 'ADMIN' }).onConflictDoNothing({ target: users.email });

  const categoryRows = [
    { slug: 'ao-thun', name: 'Áo thun' },
    { slug: 'ao-polo', name: 'Áo polo' },
    { slug: 'quan-short', name: 'Quần short' },
    { slug: 'do-mac-nha', name: 'Đồ mặc nhà' },
    { slug: 'phu-kien', name: 'Phụ kiện' },
  ];

  for (const category of categoryRows) {
    await db.insert(categories).values(category).onConflictDoNothing({ target: categories.slug });
  }

  const allCategories = await db.select().from(categories);
  const categoryBySlug = new Map(allCategories.map((category) => [category.slug, category]));

  const productRows = [
    { slug: 'ao-thun-nam-cotton-compact', category: 'ao-thun', name: 'Áo thun nam Cotton Compact', description: 'Áo thun nam chất cotton compact mềm, thoáng và dễ phối đồ.', price: 199000, originalPrice: 249000 },
    { slug: 'ao-polo-nam-basic', category: 'ao-polo', name: 'Áo polo nam Basic', description: 'Áo polo nam phom gọn, phù hợp đi làm và đi chơi.', price: 259000, originalPrice: 319000 },
    { slug: 'quan-short-nam-the-thao', category: 'quan-short', name: 'Quần short nam thể thao', description: 'Quần short nam co giãn nhẹ, tiện cho vận động hằng ngày.', price: 229000, originalPrice: 279000 },
    { slug: 'ao-tanktop-nam-active', category: 'ao-thun', name: 'Áo tanktop nam Active', description: 'Áo tanktop nam nhẹ, thoáng, dành cho luyện tập.', price: 159000, originalPrice: 199000 },
    { slug: 'boxer-nam-cotton-modal', category: 'do-mac-nha', name: 'Boxer nam Cotton Modal', description: 'Boxer nam vải cotton modal mềm và ôm vừa vặn.', price: 99000, originalPrice: 129000 },
    { slug: 'tat-nam-co-trung', category: 'phu-kien', name: 'Tất nam cổ trung', description: 'Tất nam cổ trung dày vừa, dùng tốt cho giày sneaker.', price: 59000, originalPrice: 79000 },
  ];

  for (const item of productRows) {
    const category = categoryBySlug.get(item.category);
    if (!category) continue;
    const imageUrl = `https://placehold.co/800x1000?text=${encodeURIComponent(item.name)}`;
    await db.insert(products).values({
      categoryId: category.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      price: item.price,
      originalPrice: item.originalPrice,
      imageUrl,
      stock: 120,
      isActive: true,
    }).onConflictDoNothing({ target: products.slug });

    const [product] = await db.select().from(products).where(eq(products.slug, item.slug)).limit(1);
    if (!product) continue;

    await db.insert(productImages).values([
      { productId: product.id, url: imageUrl, alt: item.name, sortOrder: 0 },
      { productId: product.id, url: `https://placehold.co/800x1000?text=${encodeURIComponent(item.name + ' 2')}`, alt: item.name, sortOrder: 1 },
    ]).onConflictDoNothing();

    const options = sizes.flatMap((size) => colors.map((color) => ({ productId: product.id, size, colorName: color.name, colorValue: color.value, stock: 24 })));
    await db.insert(productOptions).values(options).onConflictDoNothing();
  }

  console.log('Seed completed');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
