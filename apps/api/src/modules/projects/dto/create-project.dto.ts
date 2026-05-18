import { IsString, IsNumber, IsOptional, IsUUID, IsObject, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'تشطيب فيلا سكنية' })
  @IsString()
  titleAr: string;

  @ApiProperty({ example: 'Villa finishing project' })
  @IsString()
  titleEn: string;

  @ApiProperty({ example: 'تشطيب كامل لفيلا مساحتها 400 متر مربع' })
  @IsString()
  description: string;

  @ApiProperty()
  @IsUUID()
  regionId: string;

  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  @Min(0)
  totalBudget: number;

  @ApiPropertyOptional({ example: 'SAR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  address?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  specs?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  expectedEnd?: string;
}
