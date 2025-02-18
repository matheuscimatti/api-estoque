import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'estoque'

  async up() {
    this.schema.raw(`
      CREATE OR REPLACE FUNCTION update_estoque_entrada()
      RETURNS TRIGGER AS $$
      BEGIN
          UPDATE estoque
          SET quantidade = quantidade + NEW.quantidade
          WHERE id = NEW.estoque_id;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER after_insert_entrada
      AFTER INSERT ON entrada
      FOR EACH ROW
      EXECUTE FUNCTION update_estoque_entrada();

      -- Gatilho para SAÍDA
      CREATE OR REPLACE FUNCTION update_estoque_saida()
      RETURNS TRIGGER AS $$
      BEGIN
          UPDATE estoque
          SET quantidade = quantidade - NEW.quantidade
          WHERE id = NEW.estoque_id;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER after_insert_saida
      AFTER INSERT ON saida
      FOR EACH ROW
      EXECUTE FUNCTION update_estoque_saida();

      CREATE INDEX idx_entrada_estoque_data ON entrada(estoque_id, data);
      CREATE INDEX idx_saida_estoque_data ON saida(estoque_id, data);
      CREATE INDEX idx_estoque_setor_id ON estoque(setor_id);
    `)
  }

  async down() {
    this.schema.raw(`
      DROP TRIGGER after_insert_entrada ON entrada;
      DROP TRIGGER after_insert_saida ON saida;

      DROP FUNCTION update_estoque_entrada;
      DROP FUNCTION update_estoque_saida;
    `)
  }
}