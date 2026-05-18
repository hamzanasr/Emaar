import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  constructor(private config: ConfigService) {}

  /**
   * Generate a random OTP code
   */
  generateOtp(): string {
    const length = this.config.get<number>('auth.otpLength')!;
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  /**
   * Send OTP via SMS provider (Twilio/Unifonic)
   */
  async sendSms(phone: string, otp: string): Promise<void> {
    const provider = this.config.get<string>('auth.smsProvider');

    if (process.env.NODE_ENV === 'development') {
      // In development, log OTP instead of sending SMS
      console.warn(`[DEV] OTP for ${phone}: ${otp}`);
      return;
    }

    switch (provider) {
      case 'twilio':
        await this.sendViaTwilio(phone, otp);
        break;
      case 'unifonic':
        await this.sendViaUnifonic(phone, otp);
        break;
      default:
        console.warn(`[SMS] OTP for ${phone}: ${otp}`);
    }
  }

  private async sendViaTwilio(phone: string, otp: string): Promise<void> {
    // Twilio integration placeholder
    // const client = twilio(accountSid, authToken);
    // await client.messages.create({
    //   body: `رمز التحقق الخاص بك في إعمار: ${otp}`,
    //   from: this.config.get('auth.twilioPhoneNumber'),
    //   to: phone,
    // });
    console.warn(`[Twilio] Sending OTP to ${phone}`);
  }

  private async sendViaUnifonic(phone: string, otp: string): Promise<void> {
    // Unifonic integration placeholder
    console.warn(`[Unifonic] Sending OTP to ${phone}`);
  }
}
