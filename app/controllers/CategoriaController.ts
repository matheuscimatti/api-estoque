import CategoriaService from '#services/CategoriaService';
import { categoriaValidator } from '#validators/ProdutoValidator';
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriaController {
    private categoriaService = new CategoriaService()

    public async listar({ response }: HttpContext) {
        const result = await this.categoriaService.listarCategorias()
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async criar({ request, response }: HttpContext) {
        const dados = await categoriaValidator.validate(request.all());

        const result = await this.categoriaService.criarCategoria(dados)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async atualizar({ params, request, response }: HttpContext) {
        const payload = await categoriaValidator.validate(request.all(), {
            meta: { categoriaId: params.id },
        })
        const result = await this.categoriaService.atualizarCategoria(params.id, payload)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async deletar({ params, response }: HttpContext) {
        const result = await this.categoriaService.deletarCategoria(params.id)
        return response.status(200).send({
            status: true,
            message: result.message,
            data: result?.data,
        })
    }
}