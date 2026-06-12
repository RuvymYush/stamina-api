import { Module } from '@nestjs/common'
import { StaminaController } from './stamina.controller.js'
import { StaminaService } from './services'

@Module({
  controllers: [StaminaController],
  providers: [StaminaService]
})
export class StaminaModule {}
