import UnauthorizedException from '#exceptions/unauthorized_exception';
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

    public async criar({ request, response, auth }: HttpContext) {
        const tipoUsuario = (await auth.authenticate()).tipo;
        if (Number(tipoUsuario) === 4 || Number(tipoUsuario) === 3) {
            throw new UnauthorizedException('Usuário sem permissão para concluir a ação.', { code: 'UNAUTHORIZED', status: 401 })
        }

        const dados = await setorCreateValidator.validate(request.all());

        const result = await this.setorService.criarSetor(dados)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async atualizar({ params, request, response, auth }: HttpContext) {
        const tipoUsuario = (await auth.authenticate()).tipo;
        if (Number(tipoUsuario) === 4 || Number(tipoUsuario) === 3) {
            throw new UnauthorizedException('Usuário sem permissão para concluir a ação.', { code: 'UNAUTHORIZED', status: 401 })
        }

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

    public async deletar({ params, response, auth }: HttpContext) {
        const tipoUsuario = (await auth.authenticate()).tipo;
        if (Number(tipoUsuario) !== 1) {
            throw new UnauthorizedException('Usuário sem permissão para concluir a ação.', { code: 'UNAUTHORIZED', status: 401 })
        }

        const result = await this.setorService.deletarSetor(params.id)
        return response.status(200).send({
            status: true,
            message: result.message,
            data: result?.data,
        })
    }
}