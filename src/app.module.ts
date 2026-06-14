import { Module } from '@nestjs/common'
import { PlayerModule } from './player/player.module.js'
import { StaminaModule } from './stamina/stamina.module.js'

@Module({
  imports: [PlayerModule, StaminaModule]
})
export class AppModule {}

