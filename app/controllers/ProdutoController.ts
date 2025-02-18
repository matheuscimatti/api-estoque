import UnauthorizedException from '#exceptions/unauthorized_exception';
import ProdutoService from '#services/ProdutoService';
import { produtoCreateValidator, produtoUpdateValidator } from '#validators/ProdutoValidator';
import type { HttpContext } from '@adonisjs/core/http'

export default class ProdutoController {
    private produtoService = new ProdutoService()

    public async listar({ request, response }: HttpContext) {
        const { categoria, fornecedor } = request.qs()
        const result = await this.produtoService.listarProdutos(categoria, fornecedor)
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async criar({ request, response, auth }: HttpContext) {
        const tipoUsuario = (await auth.authenticate()).tipo;
        if (Number(tipoUsuario) === 4) {
            throw new UnauthorizedException('Usuário sem permissão para concluir a ação.', { code: 'UNAUTHORIZED', status: 401 })
        }

        const dados = await produtoCreateValidator.validate(request.all());

        const result = await this.produtoService.criarProduto(dados)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async mostrar({ params, response }: HttpContext) {
        const result = await this.produtoService.mostrarProduto(params.id)
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async atualizar({ params, request, response, auth }: HttpContext) {
        const tipoUsuario = (await auth.authenticate()).tipo;
        if (Number(tipoUsuario) === 4) {
            throw new UnauthorizedException('Usuário sem permissão para concluir a ação.', { code: 'UNAUTHORIZED', status: 401 })
        }

        const payload = await produtoUpdateValidator.validate(request.all(), {
            meta: { produtoId: params.id },
        })
        const result = await this.produtoService.atualizarProduto(params.id, payload)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async deletar({ params, response, auth }: HttpContext) {
        const tipoUsuario = (await auth.authenticate()).tipo;
        if (Number(tipoUsuario) !== 1) {
            throw new UnauthorizedException('Usuário sem permissão para concluir a ação.', { code: 'UNAUTHORIZED', status: 401 })
        }

        const result = await this.produtoService.deletarProduto(params.id)
        return response.status(200).send({
            status: true,
            message: result.message,
            data: result?.data,
        })
    }
}