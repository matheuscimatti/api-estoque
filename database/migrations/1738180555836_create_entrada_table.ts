import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'entrada'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.date('data').notNullable()
      table.time('hora').notNullable()

      table.integer('estoque_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('estoque')

      table.integer('produto_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('produto')
        .onUpdate('CASCADE')

      table.integer('setor_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('setor')
        .onUpdate('CASCADE')

      table.float('quantidade').notNullable()

      table.integer('usuario_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('usuario')
        .onUpdate('CASCADE')

      table.string('solicitado_por', 50).notNullable()
      table.string('observacao')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}