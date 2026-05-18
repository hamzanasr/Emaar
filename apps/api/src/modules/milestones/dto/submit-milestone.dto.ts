import { IsArray, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitMilestoneDto {
  @ApiPropertyOptional({ description: 'Proof media (photos, videos, documents)' })
  @IsOptional()
  @IsArray()
  proofMedia?: any[];
}
