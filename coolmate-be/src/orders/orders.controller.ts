import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { AuthUser } from '../common/types/auth-user.type';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('orders/checkout')
  @UseGuards(JwtAuthGuard)
  checkout(@CurrentUser() user: AuthUser, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(user, dto);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  findUserOrders(@CurrentUser() user: AuthUser) {
    return this.ordersService.findUserOrders(user);
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  findUserOrder(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.ordersService.findUserOrder(id, user);
  }

  @Get('admin/orders')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAllAdmin() {
    return this.ordersService.findAllAdmin();
  }

  @Get('admin/orders/:id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAdminOrder(@Param('id') id: string) {
    return this.ordersService.findAdminOrder(id);
  }

  @Patch('admin/orders/:id/status')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
