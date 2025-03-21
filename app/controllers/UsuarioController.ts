import UnauthorizedException from '#exceptions/unauthorized_exception';
import UsuarioService from '#services/UsuarioService';
import { usuarioCreateValidator, usuarioLogin, usuarioUpdateValidator } from '#validators/UsuarioValidator';
import type { HttpContext } from '@adonisjs/core/http'

export default class UsuarioController {
    private usuarioService = new UsuarioService()

    public async login({ request, response }: HttpContext) {
        const payload = await usuarioLogin.validate(request.all())
        const result = await this.usuarioService.autenticar(payload.cpf, payload.senha)

        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async listar({ request, response }: HttpContext) {
        const { setor } = request.qs()
        const result = await this.usuarioService.listarUsuarios(setor)
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

        const dados = await usuarioCreateValidator.validate(request.all());

        const result = await this.usuarioService.criarUsuario(dados)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async mostrar({ params, response, auth }: HttpContext) {
        const tipoUsuario = (await auth.authenticate()).tipo;
        if (Number(tipoUsuario) === 4) {
            throw new UnauthorizedException('Usuário sem permissão para concluir a ação.', { code: 'UNAUTHORIZED', status: 401 })
        }

        const result = await this.usuarioService.mostrarUsuario(params.id)
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

        const payload = await usuarioUpdateValidator.validate(request.all(), {
            meta: { usuarioId: params.id },
        })
        const result = await this.usuarioService.atualizarUsuario(params.id, payload)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async inativar({ params, response, auth }: HttpContext) {
        const tipoUsuario = (await auth.authenticate()).tipo;
        if (Number(tipoUsuario) === 4) {
            throw new UnauthorizedException('Usuário sem permissão para concluir a ação.', { code: 'UNAUTHORIZED', status: 401 })
        }

        const { id } = params;
        
        const result = await this.usuarioService.inativarUsuario(id);
        return response.status(200).send({
            status: true,
            message: result.message,
            data: result?.data,
        })
    }
}