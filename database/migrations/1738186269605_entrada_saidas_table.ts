import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'entrada'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('saida_id')
        .unsigned()
        .references('id')
        .inTable('saida')
        .onUpdate('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign(['saida_id'])
    })
  }
}