import FornecedorService from '#services/FornecedorService';
import { fornecedorCreateValidator, fornecedorUpdateValidator } from '#validators/ProdutoValidator';
import type { HttpContext } from '@adonisjs/core/http'

export default class FornecedorController {
    private fornecedorService = new FornecedorService()

    public async listar({ request, response }: HttpContext) {
        const { estoque } = request.qs();
        const result = await this.fornecedorService.listarFornecedores(estoque)
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async criar({ request, response }: HttpContext) {
        const dados = await fornecedorCreateValidator.validate(request.all());

        const result = await this.fornecedorService.criarFornecedor(dados)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async atualizar({ params, request, response }: HttpContext) {
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

    public async deletar({ params, response }: HttpContext) {
        const result = await this.fornecedorService.deletarFornecedor(params.id)
        return response.status(200).send({
            status: true,
            message: result.message,
            data: result?.data,
        })
    }
}