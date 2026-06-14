import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreatePlayerReqDto {
  @ApiProperty({ example: 'player1' })
  @IsString()
  @IsNotEmpty()
  readonly playerId: string
}
