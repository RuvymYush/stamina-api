import { Module } from '@nestjs/common'
import { PlayerController } from './player.controller'
import { PlayerService, PlayerStorageService } from './services/index'

@Module({
  controllers: [PlayerController],
  providers: [PlayerService, PlayerStorageService],
  exports: [PlayerService]
})
export class PlayerModule {}

