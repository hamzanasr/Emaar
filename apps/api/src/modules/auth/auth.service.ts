import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { OtpService } from './otp.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private jwt: JwtService,
    private config: ConfigService,
    private otpService: OtpService,
  ) {}

  /**
   * Send OTP to phone number
   */
  async sendOtp(phone: string) {
    // Rate limit: 5 OTP requests per minute per phone
    const rateLimitKey = `otp:ratelimit:${phone}`;
    const attempts = await this.redis.incr(rateLimitKey);
    if (attempts === 1) {
      await this.redis.expire(rateLimitKey, 60);
    }
    if (attempts > 5) {
      throw new BadRequestException('تم تجاوز الحد الأقصى لمحاولات الإرسال. حاول بعد دقيقة.');
    }

    // Generate and store OTP
    const otp = this.otpService.generateOtp();
    const otpKey = `otp:${phone}`;
    const expiresMinutes = this.config.get<number>('auth.otpExpiresMinutes')!;
    await this.redis.set(otpKey, otp, expiresMinutes * 60);

    // Send via SMS provider
    await this.otpService.sendSms(phone, otp);

    return { message: 'تم إرسال رمز التحقق بنجاح', expiresIn: expiresMinutes * 60 };
  }

  /**
   * Verify OTP and return JWT tokens
   */
  async verifyOtp(phone: string, code: string) {
    const otpKey = `otp:${phone}`;
    const storedOtp = await this.redis.get(otpKey);

    if (!storedOtp || storedOtp !== code) {
      throw new UnauthorizedException('رمز التحقق غير صحيح أو منتهي الصلاحية');
    }

    // Delete used OTP
    await this.redis.del(otpKey);

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user) {
      // New user - will need to complete registration
      user = await this.prisma.user.create({
        data: {
          phone,
          fullNameAr: '',
          fullNameEn: '',
          role: 'CLIENT', // Default role, can be changed during onboarding
        },
      });
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.role);

    return {
      ...tokens,
      user: {
        id: user.id,
        role: user.role,
        phone: user.phone,
        fullNameAr: user.fullNameAr,
        fullNameEn: user.fullNameEn,
        kycStatus: user.kycStatus,
        isNewUser: !user.fullNameAr,
      },
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('الجلسة منتهية الصلاحية. يرجى تسجيل الدخول مجدداً.');
    }

    // Rotate refresh token
    await this.prisma.refreshToken.delete({ where: { id: stored.id } });

    return this.generateTokens(stored.user.id, stored.user.role);
  }

  /**
   * Logout — invalidate refresh token
   */
  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    return { message: 'تم تسجيل الخروج بنجاح' };
  }

  /**
   * Generate access + refresh token pair
   */
  private async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };

    const accessToken = this.jwt.sign(payload);
    const refreshToken = uuidv4();

    // Store refresh token in DB
    const refreshExpiresIn = this.config.get<string>('auth.jwtRefreshExpiresIn')!;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }
}
