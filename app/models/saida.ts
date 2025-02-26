import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Saida extends BaseModel {
  static table = 'saida'

  @column({ isPrimary: true })
  declare id: number

  @column.date()
  declare data: DateTime
  
  @column()
  declare hora: string
  
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
  declare retiradoPor: string

  @column()
  declare entradaId: number | null

  @column()
  declare observacao: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}