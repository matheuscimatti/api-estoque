import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'estoque'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('produto_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('produto')

      table.integer('setor_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('setor')

      table.float('quantidade').notNullable()
      table.float('qtd_min').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}