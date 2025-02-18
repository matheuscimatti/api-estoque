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

      table.float('quantidade').notNullable().unsigned()
      table.float('qtd_min').notNullable().unsigned()
      table.float('qtd_inicial').notNullable().unsigned().defaultTo(1)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.raw(`
      CREATE OR REPLACE FUNCTION set_qtd_inicial() 
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.qtd_inicial := NEW.quantidade;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER before_insert_estoque
      BEFORE INSERT ON estoque
      FOR EACH ROW
      EXECUTE FUNCTION set_qtd_inicial();
    `)
  }

  async down() {
    this.schema.dropTable(this.tableName)

    this.schema.raw(`
      DROP TRIGGER before_insert_estoque ON estoque;
      DROP FUNCTION set_qtd_inicial;
    `)
  }
}