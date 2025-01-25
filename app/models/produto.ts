import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Produto extends BaseModel {
  static table = 'produto'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare quantidade: number

  @column()
  declare unidadeMedida: string

  @column()
  declare fornecedorId: number

  @column()
  declare categoriaId: number

  @column()
  declare estoqueId: number

  @column()
  declare qtdMin: number

  @column()
  declare anexo: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}