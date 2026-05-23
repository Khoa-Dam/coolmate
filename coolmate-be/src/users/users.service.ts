import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { AuthUser } from '../common/types/auth-user.type';
import { db } from '../db';
import { users } from '../db/schema';
import { UpdateUserDto } from './dto/update-user.dto';

type UserRow = typeof users.$inferSelect;

@Injectable()
export class UsersService {
  async me(authUser: AuthUser) {
    return { success: true, message: 'User fetched successfully', data: await this.findUser(authUser.id) };
  }

  async findAll() {
    const rows = await db.select().from(users);
    return { success: true, message: 'Users fetched successfully', data: rows.map(this.toSafeUser) };
  }

  async findOne(id: string, authUser: AuthUser) {
    if (authUser.role !== 'ADMIN' && authUser.id !== id) throw new ForbiddenException('Forbidden');
    return { success: true, message: 'User fetched successfully', data: await this.findUser(id) };
  }

  async update(id: string, dto: UpdateUserDto, authUser: AuthUser) {
    if (authUser.role !== 'ADMIN' && authUser.id !== id) throw new ForbiddenException('Forbidden');
    const values: Partial<typeof users.$inferInsert> = { updatedAt: new Date() };
    if (dto.name) values.name = dto.name;
    if (dto.email) values.email = dto.email.toLowerCase();
    if (dto.password) values.passwordHash = await bcrypt.hash(dto.password, 10);
    const [updated] = await db.update(users).set(values).where(eq(users.id, id)).returning();
    if (!updated) throw new NotFoundException('User not found');
    return { success: true, message: 'User updated successfully', data: this.toSafeUser(updated) };
  }

  async remove(id: string) {
    const [deleted] = await db.delete(users).where(eq(users.id, id)).returning();
    if (!deleted) throw new NotFoundException('User not found');
    return { success: true, message: 'User deleted successfully', data: this.toSafeUser(deleted) };
  }

  private async findUser(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) throw new NotFoundException('User not found');
    return this.toSafeUser(user);
  }

  private toSafeUser(user: UserRow) {
    return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt };
  }
}
