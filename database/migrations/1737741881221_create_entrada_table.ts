import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'entrada'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('data').notNullable()
      table.integer('produto_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('produto')
      table.float('quantidade').notNullable()
      table.integer('usuario_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('usuario')
        .onUpdate('CASCADE')
      table.integer('estoque_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('estoque')
        .onUpdate('CASCADE')
      table.text('observacao', 'longText')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}