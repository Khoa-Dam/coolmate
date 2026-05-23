import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { AuthUser } from '../common/types/auth-user.type';
import { db } from '../db';
import { users } from '../db/schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type UserRow = typeof users.$inferSelect;

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) throw new ConflictException('Email already exists');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const [created] = await db.insert(users).values({ name: dto.name, email, passwordHash }).returning();
    return this.authResponse('Register successful', created);
  }

  async login(dto: LoginDto) {
    const [user] = await db.select().from(users).where(eq(users.email, dto.email.toLowerCase())).limit(1);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const validPassword = await bcrypt.compare(dto.password, user.passwordHash);
    if (!validPassword) throw new UnauthorizedException('Invalid email or password');
    return this.authResponse('Login successful', user);
  }

  async me(authUser: AuthUser) {
    const [user] = await db.select().from(users).where(eq(users.id, authUser.id)).limit(1);
    if (!user) throw new UnauthorizedException('User not found');
    return { success: true, message: 'Current user fetched successfully', data: this.toSafeUser(user) };
  }

  private authResponse(message: string, user: UserRow) {
    const payload: AuthUser = { id: user.id, email: user.email, role: user.role };
    return { success: true, message, data: { accessToken: this.jwtService.sign(payload), user: this.toSafeUser(user) } };
  }

  private toSafeUser(user: UserRow) {
    return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt };
  }
}
