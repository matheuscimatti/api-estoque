import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'produto'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome').notNullable()
      table.float('quantidade').notNullable()
      table.string('unidade_medida')
      table.integer('fornecedor_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('fornecedor')

      table.integer('categoria_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('categoria')
        .onUpdate('CASCADE')

      table.integer('estoque_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('estoque')
        .onUpdate('CASCADE')

      table.float('qtd_min').notNullable()

      table.string('anexo')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}