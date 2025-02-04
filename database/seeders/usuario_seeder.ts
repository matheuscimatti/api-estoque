import Usuario from '#models/usuario'
import UsuarioSetor from '#models/usuario_setor'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Usuario.createMany([
      {
        nome: 'Matheus Cimatti',
        cpf: '04681336157',
        senha: '046813',
        tipo: 1
      }
    ])

    await UsuarioSetor.createMany([
      {
        usuarioId: 1,
        setorId: 1,
        permissao: 1
      }
    ])
  }
}