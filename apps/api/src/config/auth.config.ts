import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  otpLength: parseInt(process.env.OTP_LENGTH || '6', 10),
  otpExpiresMinutes: parseInt(process.env.OTP_EXPIRES_MINUTES || '5', 10),
  smsProvider: process.env.SMS_PROVIDER || 'twilio', // twilio | unifonic
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
}));
