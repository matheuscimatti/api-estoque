import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuario'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome', 100).notNullable()
      table.string('cpf', 11).notNullable().unique()
      table.string('senha').notNullable()
      table.enum('tipo', [1, 2, 3, 4]).notNullable()
      table.boolean('inativado')
      table.timestamp('inactivated_at')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}