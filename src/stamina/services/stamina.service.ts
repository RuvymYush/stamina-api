import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { PlayerService } from '../../player/services/index.js'
import type { PlayerRecord } from '../../player/interfaces/index.js'
import { StaminaSnapshotDto } from '../dto/index.js'
import { MAX_STAMINA, REGEN_INTERVAL } from '../constants/index.js'

@Injectable()
export class StaminaService {
  private readonly logger = new Logger(StaminaService.name)

  constructor(private readonly storage: PlayerService) {}

  getStamina(playerId: string): StaminaSnapshotDto {
    const record = this.applyRegeneration(this.getRecordOrThrow(playerId))
    this.storage.save(record)
    return this.buildSnapshot(record)
  }

  spendStamina(playerId: string, reason?: string): StaminaSnapshotDto {
    const regenerated = this.applyRegeneration(this.getRecordOrThrow(playerId))

    if (regenerated.stamina <= 0) throw new BadRequestException('Not enough stamina.')

    const record: PlayerRecord = {
      ...regenerated,
      stamina: regenerated.stamina - 1,
      regenStartedAt: regenerated.stamina === MAX_STAMINA ? Date.now() : regenerated.regenStartedAt
    }

    this.logger.log(
      `Player ${playerId} spent 1 stamina (reason: ${reason ?? 'unspecified'}). ` +
        `Now at ${record.stamina}/${MAX_STAMINA}.`
    )

    this.storage.save(record)
    return this.buildSnapshot(record)
  }

  private applyRegeneration(record: PlayerRecord): PlayerRecord {
    if (!record.regenStartedAt || record.stamina >= MAX_STAMINA) return record

    const now = Date.now()
    const elapsed = now - record.regenStartedAt

    if (elapsed < 0) return record

    const regenUnits = Math.floor(elapsed / REGEN_INTERVAL)

    if (regenUnits <= 0) return record

    const staminaDeficit = MAX_STAMINA - record.stamina
    const actualRegen = Math.min(regenUnits, staminaDeficit)
    const newStamina = record.stamina + actualRegen

    return {
      ...record,
      stamina: newStamina,
      regenStartedAt:
        newStamina >= MAX_STAMINA ? undefined : record.regenStartedAt + regenUnits * REGEN_INTERVAL
    }
  }

  private getRecordOrThrow(playerId: string): PlayerRecord {
    const record = this.storage.get(playerId)
    if (!record) throw new NotFoundException(`Player "${playerId}" not found.`)
    return record
  }

  private buildSnapshot(record: PlayerRecord): StaminaSnapshotDto {
    const { playerId, stamina, regenStartedAt } = record

    const regenTimers =
      stamina < MAX_STAMINA && regenStartedAt
        ? {
            nextRegenAt: regenStartedAt + REGEN_INTERVAL,
            fullRegenAt: regenStartedAt + (MAX_STAMINA - stamina) * REGEN_INTERVAL
          }
        : { nextRegenAt: null, fullRegenAt: null }

    return {
      playerId,
      currentStamina: stamina,
      ...regenTimers,
      serverTime: new Date().toISOString()
    }
  }
}
