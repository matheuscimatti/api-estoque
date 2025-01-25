import SetorService from '#services/SetorService';
import { setorCreateValidator, setorUpdateValidator } from '#validators/UnidadeValidator';
import type { HttpContext } from '@adonisjs/core/http'

export default class SetorController {
    private setorService = new SetorService()

    public async listar({ request, response }: HttpContext) {
        const { unidade } = request.qs();

        const result = await this.setorService.listarSetores(unidade)
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async criar({ request, response }: HttpContext) {
        const dados = await setorCreateValidator.validate(request.all());

        const result = await this.setorService.criarSetor(dados)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async atualizar({ params, request, response }: HttpContext) {
        const payload = await setorUpdateValidator.validate(request.all(), {
            meta: { setorId: params.id },
        })
        const result = await this.setorService.atualizarSetor(params.id, payload)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async deletar({ params, response }: HttpContext) {
        const result = await this.setorService.deletarSetor(params.id)
        return response.status(200).send({
            status: true,
            message: result.message,
            data: result?.data,
        })
    }
}