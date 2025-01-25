import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const UsuarioController = () => import('#controllers/UsuarioController')
const EstoqueController = () => import('#controllers/EstoqueController')
const UnidadeController = () => import('#controllers/UnidadeController')
const CidadeController = () => import('#controllers/CidadeController')
const SetorController = () => import('#controllers/SetorController')
const CategoriaController = () => import('#controllers/CategoriaController')
const FornecedorController = () => import('#controllers/FornecedorController')
const ProdutoController = () => import('#controllers/ProdutoController')
const EntradaSaidaController = () => import('#controllers/EntradaSaidaController')

router
  .group(() => {
    // Rota para login
    router.post('login', [UsuarioController, 'login'])

    // Rotas para Usuário
    router.group(() => {
      router.get('/', [UsuarioController, 'listar'])
      router.post('/', [UsuarioController, 'criar'])
      router.get('/:id', [UsuarioController, 'mostrar']).where('id', router.matchers.number())
      router.put('/:id', [UsuarioController, 'atualizar']).where('id', router.matchers.number())
      router.delete('/:id', [UsuarioController, 'deletar']).where('id', router.matchers.number())
    })
      .prefix('usuario')
      // .use(middleware.auth())

    // Rotas para Estoque
    router.group(() => {
      router.get('/', [EstoqueController, 'listar'])
      router.post('/', [EstoqueController, 'criar'])
      router.put('/:id', [EstoqueController, 'atualizar']).where('id', router.matchers.number())
      router.delete('/:id', [EstoqueController, 'deletar']).where('id', router.matchers.number())
    })
      .prefix('estoque')
      // .use(middleware.auth())

    // Rotas para Cidade
    router.group(() => {
      router.get('/', [CidadeController, 'listar'])
      router.post('/', [CidadeController, 'criar'])
      router.put('/:id', [CidadeController, 'atualizar']).where('id', router.matchers.number())
      router.delete('/:id', [CidadeController, 'deletar']).where('id', router.matchers.number())
    })
      .prefix('cidade')
      .use(middleware.auth())

    // Rotas para Unidade
    router.group(() => {
      router.get('/', [UnidadeController, 'listar'])
      router.post('/', [UnidadeController, 'criar'])
      router.put('/:id', [UnidadeController, 'atualizar']).where('id', router.matchers.number())
      router.delete('/:id', [UnidadeController, 'deletar']).where('id', router.matchers.number())
    })
      .prefix('unidade')
      .use(middleware.auth())

    // Rotas para Setor
    router.group(() => {
      router.get('/', [SetorController, 'listar'])
      router.post('/', [SetorController, 'criar'])
      router.put('/:id', [SetorController, 'atualizar']).where('id', router.matchers.number())
      router.delete('/:id', [SetorController, 'deletar']).where('id', router.matchers.number())
    })
      .prefix('setor')
      .use(middleware.auth())

    // Rotas para Categoria
    router.group(() => {
      router.get('/', [CategoriaController, 'listar'])
      router.post('/', [CategoriaController, 'criar'])
      router.put('/:id', [CategoriaController, 'atualizar']).where('id', router.matchers.number())
      router.delete('/:id', [CategoriaController, 'deletar']).where('id', router.matchers.number())
    })
      .prefix('categoria')
      .use(middleware.auth())

    // Rotas para Fornecedor
    router.group(() => {
      router.get('/', [FornecedorController, 'listar'])
      router.post('/', [FornecedorController, 'criar'])
      router.put('/:id', [FornecedorController, 'atualizar']).where('id', router.matchers.number())
      router.delete('/:id', [FornecedorController, 'deletar']).where('id', router.matchers.number())
    })
      .prefix('fornecedor')
      .use(middleware.auth())

    // Rotas para Produto
    router.group(() => {
      router.get('/', [ProdutoController, 'listar'])
      router.post('/', [ProdutoController, 'criar'])
      router.get('/:id', [ProdutoController, 'mostrar']).where('id', router.matchers.number())
      router.put('/:id', [ProdutoController, 'atualizar']).where('id', router.matchers.number())
      router.delete('/:id', [ProdutoController, 'deletar']).where('id', router.matchers.number())
    })
      .prefix('produto')
      .use(middleware.auth())

    // Rotas para Entrada
    router.group(() => {
      router.get('/', [EntradaSaidaController, 'listarEntrada'])
      router.post('/', [EntradaSaidaController, 'criarEntrada'])
      router.get('/:id', [EntradaSaidaController, 'mostrarEntrada']).where('id', router.matchers.number())
    })
      .prefix('entrada')
      .use(middleware.auth())

    // Rotas para Saida
    router.group(() => {
      router.get('/', [EntradaSaidaController, 'listarSaida'])
      router.post('/', [EntradaSaidaController, 'criarSaida'])
      router.get('/:id', [EntradaSaidaController, 'mostrarSaida']).where('id', router.matchers.number())
    })
      .prefix('saida')
      .use(middleware.auth())
  })
  .prefix('api/v1')