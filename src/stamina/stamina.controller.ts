import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger'
import { StaminaService } from './services'
import { SpendStaminaDto, StaminaSnapshotDto } from './dto'

@ApiTags('Players')
@Controller('players')
export class StaminaController {
  constructor(private readonly staminaService: StaminaService) {}

  @Post(':playerId')
  @ApiOperation({ summary: 'Register a new player with full stamina' })
  @ApiParam({ name: 'playerId', example: 'player1' })
  createPlayer(@Param('playerId') playerId: string): StaminaSnapshotDto {
    return this.staminaService.createPlayer(playerId)
  }

  @Get(':playerId/stamina')
  @ApiOperation({ summary: 'Get current stamina (computes offline regeneration)' })
  @ApiParam({ name: 'playerId', example: 'player1' })
  getStamina(@Param('playerId') playerId: string): StaminaSnapshotDto {
    return this.staminaService.getStamina(playerId)
  }

  @Post(':playerId/stamina/spend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Spend 1 stamina point' })
  @ApiParam({ name: 'playerId', example: 'player1' })
  @ApiBody({ type: SpendStaminaDto, required: false })
  spendStamina(
    @Param('playerId') playerId: string,
    @Body() dto: SpendStaminaDto
  ): StaminaSnapshotDto {
    return this.staminaService.spendStamina(playerId, dto.reason)
  }
}
