import { IsString, IsPhoneNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '+966501234567', description: 'Phone number with country code' })
  @IsString()
  @IsPhoneNumber()
  phone: string;
}
