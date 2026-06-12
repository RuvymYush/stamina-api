import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class StaminaSnapshotDto {
  @ApiProperty({ example: 'player1' })
  playerId: string

  @ApiProperty({ example: 5 })
  currentStamina: number

  @ApiPropertyOptional({ example: 1749753600000, nullable: true })
  nextRegenAt: number | null

  @ApiPropertyOptional({ example: 1749753900000, nullable: true })
  fullRegenAt: number | null

  @ApiProperty({ example: '2026-06-12T20:00:00.000Z' })
  serverTime: string
}
