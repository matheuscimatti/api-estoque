import CidadeService from '#services/CidadeService';
import { cidadeCreateValidator, cidadeUpdateValidator } from '#validators/UnidadeValidator';
import type { HttpContext } from '@adonisjs/core/http'

export default class CidadeController {
    private cidadeService = new CidadeService()

    public async listar({ response }: HttpContext) {
        const result = await this.cidadeService.listarCidades()
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async criar({ request, response }: HttpContext) {
        const dados = await cidadeCreateValidator.validate(request.all());

        const result = await this.cidadeService.criarCidade(dados)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async atualizar({ params, request, response }: HttpContext) {
        const payload = await cidadeUpdateValidator.validate(request.all(), {
            meta: { cidadeId: params.id },
        })
        const result = await this.cidadeService.atualizarCidade(params.id, payload)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async deletar({ params, response }: HttpContext) {
        const result = await this.cidadeService.deletarCidade(params.id)
        return response.status(200).send({
            status: true,
            message: result.message,
            data: result?.data,
        })
    }
}