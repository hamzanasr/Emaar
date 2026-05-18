import { IsUUID, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty({ description: 'Milestone ID to deposit for' })
  @IsUUID()
  milestoneId: string;

  @ApiPropertyOptional({ description: 'Payment method reference' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
