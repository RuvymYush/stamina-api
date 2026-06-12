import { Module } from '@nestjs/common'
import { PlayerStorageModule } from './player-storage/player-storage.module.js'
import { StaminaModule } from './stamina/stamina.module.js'

@Module({
  imports: [PlayerStorageModule, StaminaModule]
})
export class AppModule {}
