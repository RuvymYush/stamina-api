import { Module } from '@nestjs/common'
import { StaminaController } from './stamina.controller.js'
import { StaminaService } from './services/index.js'
import { PlayerModule } from '../player/player.module.js'

@Module({
  imports: [PlayerModule],
  controllers: [StaminaController],
  providers: [StaminaService]
})
export class StaminaModule {}

