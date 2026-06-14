import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger'
import { StaminaService } from './services/index.js'
import { SpendStaminaReqDto, StaminaSnapshotDto } from './dto/index.js'

@ApiTags('Stamina')
@Controller('stamina')
export class StaminaController {
  constructor(private readonly staminaService: StaminaService) {}

  @Get(':playerId')
  @ApiOperation({ summary: 'Get current stamina (computes offline regeneration)' })
  @ApiParam({ name: 'playerId', example: 'player1' })
  getStamina(@Param('playerId') playerId: string): StaminaSnapshotDto {
    return this.staminaService.getStamina(playerId)
  }

  @Post(':playerId/spend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Spend 1 stamina point' })
  @ApiParam({ name: 'playerId', example: 'player1' })
  @ApiBody({ type: SpendStaminaReqDto, required: false })
  spendStamina(
    @Param('playerId') playerId: string,
    @Body() dto: SpendStaminaReqDto
  ): StaminaSnapshotDto {
    return this.staminaService.spendStamina(playerId, dto.reason)
  }
}
