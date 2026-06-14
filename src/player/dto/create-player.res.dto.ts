import { ApiProperty } from '@nestjs/swagger'

export class CreatePlayerResDto {
  @ApiProperty({ example: 'player1' })
  readonly playerId: string

  @ApiProperty({ example: 5 })
  readonly stamina: number
}
