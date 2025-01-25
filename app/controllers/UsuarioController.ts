import EstoqueService from '#services/EstoqueService';
import UsuarioService from '#services/UsuarioService';
import { usuarioCreateValidator, usuarioLogin, usuarioUpdateValidator } from '#validators/UsuarioValidator';
import type { HttpContext } from '@adonisjs/core/http'

export default class UsuarioController {
    private usuarioService = new UsuarioService()
    private estoqueService = new EstoqueService()

    public async login({ request, response }: HttpContext) {
        const payload = await usuarioLogin.validate(request.all())
        const result = await this.usuarioService.autenticar(payload.cpf, payload.senha)

        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async listar({ request, response }: HttpContext) {
        const { estoque } = request.qs()
        const result = await this.usuarioService.listarUsuarios(estoque)
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async criar({ request, response }: HttpContext) {
        const dados = await usuarioCreateValidator.validate(request.all());

        if (!dados.estoqueId || dados.estoqueId.length === 0) {
            let estoques
            try {
                if (dados.tipo === 1) {
                    estoques = await this.estoqueService.listarEstoques()
                }

                if (estoques?.data && estoques.data.length > 0) {
                    dados.estoqueId = estoques.data.map(
                        (estoque: { id: any }) => estoque.id
                    )
                } else {
                    throw new Error('Nenhum estoque informado.')
                }
            } catch (error) {
                return response.status(400).send({
                    status: false,
                    message: `Erro ao buscar estoques: ${error.message}`,
                })
            }
        }

        const result = await this.usuarioService.criarUsuario(dados)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async mostrar({ params, response }: HttpContext) {
        const result = await this.usuarioService.mostrarUsuario(params.id)
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async atualizar({ params, request, response }: HttpContext) {
        const payload = await usuarioUpdateValidator.validate(request.all(), {
            meta: { usuarioId: params.id },
        })
        const result = await this.usuarioService.atualizarUsuario(params.id, payload)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async deletar({ params, response }: HttpContext) {
        const result = await this.usuarioService.deletarUsuario(params.id)
        return response.status(200).send({
            status: true,
            message: result.message,
            data: result?.data,
        })
    }
}