
import UnauthorizedException from '#exceptions/unauthorized_exception';
import EstoqueService from '#services/EstoqueService';
import { estoqueCreateValidator, estoqueUpdateValidator } from '#validators/EstoqueValidator';
import type { HttpContext } from '@adonisjs/core/http'

export default class EstoqueController {
    private estoqueService = new EstoqueService();

    public async listar({ request, response }: HttpContext) {
        const { setor, produto, categoria } = request.qs();

        const result = await this.estoqueService.listarEstoques(setor, produto, categoria);
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async criar({ request, response, auth }: HttpContext) {
        const dados = await estoqueCreateValidator.validate(request.all());
        const userId = (await auth.authenticate()).id;
        
        const result = await this.estoqueService.criarEstoque(dados, userId)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async atualizar({ params, request, response, auth }: HttpContext) {
        const payload = await estoqueUpdateValidator.validate(request.all(), {
            meta: { estoqueId: params.id },
        })
        const userId = (await auth.authenticate()).id;

        const result = await this.estoqueService.atualizarEstoque(params.id, payload, userId)
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

        const result = await this.estoqueService.deletarEstoque(params.id)
        return response.status(200).send({
            status: true,
            message: result.message,
            data: result?.data,
        })
    }
}