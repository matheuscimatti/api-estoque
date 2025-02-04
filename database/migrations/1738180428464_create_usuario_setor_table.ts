import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuario_setor'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('usuario_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('usuario')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table.integer('setor_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('setor')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table.enum('permissao', [1, 2, 3, 4]).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}