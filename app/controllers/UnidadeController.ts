import UnauthorizedException from '#exceptions/unauthorized_exception'
import UnidadeService from '#services/UnidadeService'
import { unidadeCreateValidator, unidadeUpdateValidator } from '#validators/UnidadeValidator'
import type { HttpContext } from '@adonisjs/core/http'

export default class UnidadeController {
    private unidadeService = new UnidadeService()

    public async listar({ request, response }: HttpContext) {
        const { cidade } = request.qs()
        const result = await this.unidadeService.listarUnidades(cidade)
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async criar({ request, response, auth }: HttpContext) {
        const tipoUsuario = (await auth.authenticate()).tipo;
        if (tipoUsuario === 4 || tipoUsuario === 3) {
            throw new UnauthorizedException('Usuário sem permissão para concluir a ação.', { code: 'UNAUTHORIZED', status: 401 })
        }

        const dados = await unidadeCreateValidator.validate(request.all());

        const result = await this.unidadeService.criarUnidade(dados)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async atualizar({ params, request, response, auth }: HttpContext) {
        const tipoUsuario = (await auth.authenticate()).tipo;
        if (tipoUsuario === 4 || tipoUsuario === 3) {
            throw new UnauthorizedException('Usuário sem permissão para concluir a ação.', { code: 'UNAUTHORIZED', status: 401 })
        }

        const payload = await unidadeUpdateValidator.validate(request.all(), {
            meta: { unidadeId: params.id },
        })
        const result = await this.unidadeService.atualizarUnidade(params.id, payload)
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

        const result = await this.unidadeService.deletarUnidade(params.id)
        return response.status(200).send({
            status: true,
            message: result.message,
            data: result?.data,
        })
    }
}