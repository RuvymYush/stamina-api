import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger'
import { PlayerService } from './services/index.js'
import { CreatePlayerReqDto, CreatePlayerResDto } from './dto/index.js'

@ApiTags('Players')
@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new player' })
  @ApiBody({ type: CreatePlayerReqDto })
  createPlayer(@Body() dto: CreatePlayerReqDto): CreatePlayerResDto {
    return this.playerService.createPlayer(dto.playerId)
  }
}
