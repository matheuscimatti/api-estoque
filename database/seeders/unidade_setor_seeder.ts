import Setor from '#models/setor'
import Unidade from '#models/unidade'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Unidade.createMany([
      {
        nome: 'Complexo',
        cnpj: '00122815000143',
        telefone: '67996219796',
        endereco: 'R. Hilda Bergo Duarte, 1135',
        cidadeId: 1
      }
    ])

    await Setor.createMany([
      {
        nome: 'Tecnologias da Informação',
        unidadeId: 1
      }
    ])
  }
}