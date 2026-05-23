import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { AuthUser } from '../common/types/auth-user.type';
import { db } from '../db';
import { cartItems, orderItems, orders } from '../db/schema';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

type OrderWithItems = typeof orders.$inferSelect & {
  items: (typeof orderItems.$inferSelect)[];
};

@Injectable()
export class OrdersService {
  async checkout(user: AuthUser, dto: CheckoutDto) {
    const cart = await db.query.cartItems.findMany({ where: eq(cartItems.userId, user.id), with: { product: true, productOption: true } });
    if (!cart.length) throw new BadRequestException('Cart is empty');
    for (const item of cart) {
      if (!item.product.isActive) throw new BadRequestException('Cart contains inactive product');
      if (item.quantity > item.productOption.stock) throw new BadRequestException('Cart item quantity exceeds stock');
    }
    const subtotal = cart.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0);
    const shippingFee = 0;
    const discount = 0;
    const totalAmount = subtotal + shippingFee - discount;
    const code = this.generateOrderCode();
    const paymentStatus = dto.paymentMethod === 'VNPAY_MOCK' ? 'PAID' : 'PENDING';
    const [created] = await db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values({ code, userId: user.id, shippingName: dto.shippingInfo.fullName, shippingPhone: dto.shippingInfo.phone, shippingAddress: dto.shippingInfo.address, shippingCity: dto.shippingInfo.city, shippingDistrict: dto.shippingInfo.district, shippingWard: dto.shippingInfo.ward, shippingNote: dto.shippingInfo.note, paymentMethod: dto.paymentMethod, paymentStatus, orderStatus: 'PENDING', subtotal, shippingFee, discount, totalAmount }).returning();
      await tx.insert(orderItems).values(cart.map((item) => ({ orderId: order.id, productId: item.productId, productOptionId: item.productOptionId, productName: item.product.name, productImage: item.product.imageUrl, size: item.productOption.size, colorName: item.productOption.colorName, colorValue: item.productOption.colorValue, price: item.priceAtTime, quantity: item.quantity })));
      await tx.delete(cartItems).where(eq(cartItems.userId, user.id));
      return [order];
    });
    return { success: true, message: 'Order created successfully', data: this.mapOrder(await this.getOrder(created.id)) };
  }

  async findUserOrders(user: AuthUser) {
    const rows = await db.query.orders.findMany({ where: eq(orders.userId, user.id), orderBy: [desc(orders.createdAt)], with: { items: true } });
    return { success: true, message: 'Orders fetched successfully', data: rows.map((row) => this.mapOrder(row)) };
  }

  async findUserOrder(id: string, user: AuthUser) {
    const order = await this.getOrder(id);
    if (order.userId !== user.id) throw new ForbiddenException('Forbidden');
    return { success: true, message: 'Order fetched successfully', data: this.mapOrder(order) };
  }

  async findAllAdmin() {
    const rows = await db.query.orders.findMany({ orderBy: [desc(orders.createdAt)], with: { items: true } });
    return { success: true, message: 'Orders fetched successfully', data: rows.map((row) => this.mapOrder(row)) };
  }

  async findAdminOrder(id: string) {
    return { success: true, message: 'Order fetched successfully', data: this.mapOrder(await this.getOrder(id)) };
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const [updated] = await db.update(orders).set({ orderStatus: dto.orderStatus, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
    if (!updated) throw new NotFoundException('Order not found');
    return { success: true, message: 'Order status updated successfully', data: this.mapOrder(await this.getOrder(id)) };
  }

  private async getOrder(id: string) {
    const order = await db.query.orders.findFirst({ where: eq(orders.id, id), with: { items: true } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  private generateOrderCode() {
    const date = new Date();
    const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
    return `NW${ymd}${Math.floor(1000 + Math.random() * 900000)}`;
  }

  private mapOrder(order: OrderWithItems) {
    return { id: order.id, code: order.code, userId: order.userId, items: order.items.map((item) => ({ id: item.id, productId: item.productId, productName: item.productName, productImage: item.productImage, price: item.price, size: item.size, color: { name: item.colorName, value: item.colorValue }, quantity: item.quantity })), shippingInfo: { fullName: order.shippingName, phone: order.shippingPhone, address: order.shippingAddress, city: order.shippingCity, district: order.shippingDistrict, ward: order.shippingWard, note: order.shippingNote }, paymentMethod: order.paymentMethod, paymentStatus: order.paymentStatus, orderStatus: order.orderStatus, subtotal: order.subtotal, shippingFee: order.shippingFee, discount: order.discount, totalAmount: order.totalAmount, createdAt: order.createdAt, updatedAt: order.updatedAt };
  }
}
