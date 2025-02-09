
import EstoqueService from '#services/EstoqueService';
import { estoqueCreateValidator, estoqueUpdateValidator } from '#validators/EstoqueValidator';
import type { HttpContext } from '@adonisjs/core/http'

export default class EstoqueController {
    private estoqueService = new EstoqueService();

    public async listar({ request, response }: HttpContext) {
        const { setor, produto } = request.qs();

        const result = await this.estoqueService.listarEstoques(setor, produto);
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async criar({ request, response }: HttpContext) {
        const dados = await estoqueCreateValidator.validate(request.all());
        
        const result = await this.estoqueService.criarEstoque(dados)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async atualizar({ params, request, response }: HttpContext) {
        const payload = await estoqueUpdateValidator.validate(request.all(), {
            meta: { estoqueId: params.id },
        })
        const result = await this.estoqueService.atualizarEstoque(params.id, payload)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async deletar({ params, response }: HttpContext) {
        const result = await this.estoqueService.deletarEstoque(params.id)
        return response.status(200).send({
            status: true,
            message: result.message,
            data: result?.data,
        })
    }
}