import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Entrada extends BaseModel {
  static table = 'entrada'

  @column({ isPrimary: true })
  declare id: number

  @column.date()
  declare data: DateTime

  @column()
  declare estoqueId: number

  @column()
  declare produtoId: number

  @column()
  declare setorId: number

  @column()
  declare quantidade: number

  @column()
  declare usuarioId: number

  @column()
  declare solicitadoPor: string

  @column()
  declare saidaId: number | null

  @column()
  declare observacao: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}