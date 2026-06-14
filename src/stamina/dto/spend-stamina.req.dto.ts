import { IsEnum, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { SpendStaminaReason } from '../enums'

export class SpendStaminaReqDto {
  @ApiPropertyOptional({ enum: SpendStaminaReason, example: SpendStaminaReason.LEVEL_LOST })
  @IsOptional()
  @IsEnum(SpendStaminaReason)
  reason?: SpendStaminaReason
}
