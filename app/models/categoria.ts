import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Categoria extends BaseModel {
  static table = 'categoria'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare estoqueId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}