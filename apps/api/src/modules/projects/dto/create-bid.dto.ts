import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBidDto {
  @ApiProperty({ example: 120000, description: 'Bid amount in SAR' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 90, description: 'Estimated duration in days' })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 'خبرة 10 سنوات في التشطيب...' })
  @IsString()
  proposal: string;
}
