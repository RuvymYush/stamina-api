import { Module } from '@nestjs/common'
import { PlayerModule } from './player/player.module.js'
import { StaminaModule } from './stamina/stamina.module.js'
import { AppController } from './app.controller.js'

@Module({
  imports: [PlayerModule, StaminaModule],
  controllers: [AppController]
})
export class AppModule {}

