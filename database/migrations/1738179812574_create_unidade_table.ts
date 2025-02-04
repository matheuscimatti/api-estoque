import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'unidade'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome', 50).notNullable()
      table.string('cnpj', 14).notNullable()
      table.string('telefone', 12).notNullable()
      table.string('endereco', 100).notNullable()

      table.integer('cidade_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('cidade')
        .onUpdate('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}