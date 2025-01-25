import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Saida extends BaseModel {
  static table = 'saida'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare data: string

  @column()
  declare produtoId: number

  @column()
  declare quantidade: number

  @column()
  declare usuarioId: number

  @column()
  declare estoqueId: number

  @column()
  declare unidadeId: number

  @column()
  declare setorId: number

  @column()
  declare retiradoPor: string

  @column()
  declare observacao: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}