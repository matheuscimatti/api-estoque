import UnauthorizedException from '#exceptions/unauthorized_exception';
import FornecedorService from '#services/FornecedorService';
import { fornecedorCreateValidator, fornecedorUpdateValidator } from '#validators/ProdutoValidator';
import type { HttpContext } from '@adonisjs/core/http'

export default class FornecedorController {
    private fornecedorService = new FornecedorService()

    public async listar({ response }: HttpContext) {
        const result = await this.fornecedorService.listarFornecedores()
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async criar({ request, response, auth }: HttpContext) {
        const tipoUsuario = (await auth.authenticate()).tipo;
        if (tipoUsuario === 4) {
            throw new UnauthorizedException('Usuário sem permissão para concluir a ação.', { code: 'UNAUTHORIZED', status: 401 })
        }

        const dados = await fornecedorCreateValidator.validate(request.all());

        const result = await this.fornecedorService.criarFornecedor(dados)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async atualizar({ params, request, response, auth }: HttpContext) {
        const tipoUsuario = (await auth.authenticate()).tipo;
        if (tipoUsuario === 4) {
            throw new UnauthorizedException('Usuário sem permissão para concluir a ação.', { code: 'UNAUTHORIZED', status: 401 })
        }

        const payload = await fornecedorUpdateValidator.validate(request.all(), {
            meta: { fornecedorId: params.id },
        })
        const result = await this.fornecedorService.atualizarFornecedor(params.id, payload)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async deletar({ params, response, auth }: HttpContext) {
        const tipoUsuario = (await auth.authenticate()).tipo;
        if (tipoUsuario !== 1) {
            throw new UnauthorizedException('Usuário sem permissão para concluir a ação.', { code: 'UNAUTHORIZED', status: 401 })
        }

        const result = await this.fornecedorService.deletarFornecedor(params.id)
        return response.status(200).send({
            status: true,
            message: result.message,
            data: result?.data,
        })
    }
}