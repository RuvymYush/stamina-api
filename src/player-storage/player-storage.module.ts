import { Global, Module } from '@nestjs/common'
import { PlayerStorageService } from './services'

@Global()
@Module({
  providers: [PlayerStorageService],
  exports: [PlayerStorageService]
})
export class PlayerStorageModule {}
