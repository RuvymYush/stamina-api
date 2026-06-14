import { Injectable, BadRequestException } from '@nestjs/common'
import { MAX_STAMINA } from '../../stamina/constants/index'
import { PlayerStorageService } from './player-storage.service'
import type { PlayerRecord } from '../interfaces/index'
import type { CreatePlayerResDto } from '../dto/index'

@Injectable()
export class PlayerService {
  constructor(private readonly storage: PlayerStorageService) {}

  get(playerId: string): PlayerRecord | undefined {
    return this.storage.get(playerId)
  }

  createPlayer(playerId: string): CreatePlayerResDto {
    if (this.storage.has(playerId))
      throw new BadRequestException(`Player "${playerId}" already exists.`)

    const record: PlayerRecord = {
      playerId,
      stamina: MAX_STAMINA
    }

    this.storage.save(record)
    return record
  }

  save(record: PlayerRecord): void {
    this.storage.save(record)
  }

  remove(playerId: string): boolean {
    return this.storage.remove(playerId)
  }
}
