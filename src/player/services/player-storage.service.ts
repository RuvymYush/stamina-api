import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import * as fs from 'node:fs'
import * as path from 'node:path'
import type { PlayerRecord } from '../interfaces/index'

const DATA_DIR = path.resolve(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'players.json')
const DEBOUNCE_MS = 500

@Injectable()
export class PlayerStorageService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PlayerStorageService.name)
  private players = new Map<string, PlayerRecord>()
  private debounceTimer: ReturnType<typeof setTimeout> | null = null

  onModuleInit(): void {
    this.loadFromDisk()
  }

  onModuleDestroy(): void {
    this.flushNow()
  }

  get(playerId: string): PlayerRecord | undefined {
    return this.players.get(playerId)
  }

  has(playerId: string): boolean {
    return this.players.has(playerId)
  }

  save(record: PlayerRecord): void {
    this.players.set(record.playerId, record)
    this.scheduleDebouncedFlush()
  }

  remove(playerId: string): boolean {
    const deleted = this.players.delete(playerId)
    if (deleted) {
      this.scheduleDebouncedFlush()
    }
    return deleted
  }

  private scheduleDebouncedFlush(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    this.debounceTimer = setTimeout(() => this.flushNow(), DEBOUNCE_MS)
  }

  private flushNow(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }

    const data = JSON.stringify([...this.players.values()], null, 2)
    const tmpFile = `${DATA_FILE}.tmp`

    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

      fs.writeFileSync(tmpFile, data, 'utf-8')
      fs.renameSync(tmpFile, DATA_FILE)
    } catch (err) {
      this.logger.error('Failed to persist data!', err)
      try {
        fs.unlinkSync(tmpFile)
      } catch {}
    }
  }

  private loadFromDisk(): void {
    if (!fs.existsSync(DATA_FILE)) {
      this.logger.log(`No data file found at ${DATA_FILE} — starting fresh.`)
      return
    }

    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8')
      const records: PlayerRecord[] = JSON.parse(raw)
      this.players = new Map(records.map((r) => [r.playerId, r]))
      this.logger.log(`Loaded ${this.players.size} player(s) from disk.`)
    } catch (err) {
      this.logger.error('Failed to parse data file — starting with empty store.', err)
    }
  }
}
