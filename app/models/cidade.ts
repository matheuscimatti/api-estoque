import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Cidade extends BaseModel {
  static table = 'cidade'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare uf: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}