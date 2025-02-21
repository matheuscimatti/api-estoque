import NotFoundException from "#exceptions/notfound_exception";
import Usuario from "#models/usuario";
import hash from "@adonisjs/core/services/hash";
import { UsuarioInterface } from "../interfaces/UsuarioInterface.js";
import UnauthorizedException from "#exceptions/unauthorized_exception";
import UsuarioSetor from "#models/usuario_setor";
import db from "@adonisjs/lucid/services/db";


export default class UsuarioService {

    public async autenticar(cpf: string, senha: string) {
        try {
            const user = await Usuario.findByOrFail('cpf', cpf)

            if (!user) {
                throw new NotFoundException('Usuário não encontrado', {
                    code: 'E_ROW_NOT_FOUND',
                    status: 404,
                })
            }
            const isValidPassword = await hash.verify(user.senha, senha)

            if (!isValidPassword)
                throw new UnauthorizedException('Senha inválida', { code: 'UNAUTHORIZED', status: 401 })

            const token = await Usuario.accessTokens.create(user);

            const permissoes = await db.from('usuario_setor').select('setor_id', 'permissao').where('usuario_id', user.id)

            return {
                status: true,
                message: `Usuário autenticado com sucesso`,
                data: {
                    id: user.id,
                    nome: user.nome,
                    tipo: user.tipo,
                    permissoes,
                    token: token.value!.release(),
                }
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async listarUsuarios(unidade?: number, setor?: number) {
        try {
            let query = db.query()
                .from('usuario')
                .innerJoin('usuario_setor', 'usuario_setor.usuario_id', 'usuario.id')
                .innerJoin('setor', 'setor.id', 'usuario_setor.setor_id')
                .innerJoin('unidade', 'unidade.id', 'setor.unidade_id')
                .select('usuario.id', 'usuario.nome', 'usuario.cpf', 'usuario.tipo',
                    db.raw(`
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'unidade_id', unidade.id,
                                'unidade', unidade.nome,
                                'setor_id', setor.id,
                                'setor', setor.nome,
                                'permissao', usuario_setor.permissao
                            ) 
                            ORDER BY unidade.id, setor.id
                        ) AS permissoes
                    `)
                )
                .groupBy('usuario.id')

            if (unidade) {
                query = query.where('unidade.id', unidade);
            }

            if (setor) {
                query = query.where('setor.id', setor);
            }

            const info = await query.exec();
            console.log(info)

            return {
                status: true,
                message: `${info.length} registro(s) encontrado(s)`,
                data: info,
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async criarUsuario(dados: UsuarioInterface) {
        try {
            const { permissoes, ...dadosUsuario } = dados;

            if (dadosUsuario.tipo === 3 || dadosUsuario.tipo === 4) {
                if (!permissoes || permissoes.length <= 0) {
                    throw new Error('Para usuários de tipo 3 ou 4, é obrigatório informar os setores e permissões.')
                }
            }

            const info = await Usuario.create(dadosUsuario);
            const data = info.toJSON();
            const usuarioId = data.id;

            if (dadosUsuario.tipo === 1 || dadosUsuario.tipo === 2) {
                const setores = await db.from('setor').select('id')
                const usuarioSetorData = setores.map((item) => ({
                    usuarioId,
                    setorId: item.id,
                    permissao: dadosUsuario.tipo
                }));
                await UsuarioSetor.createMany(usuarioSetorData);
            }
            else if ((dadosUsuario.tipo === 3 || dadosUsuario.tipo === 4) && permissoes) {
                const usuarioSetorData = permissoes.map((item) => ({
                    usuarioId,
                    setorId: item.setorId,
                    permissao: dadosUsuario.tipo === 4 ? 4 : item.permissao,
                }));
                await UsuarioSetor.createMany(usuarioSetorData);
            }

            return {
                status: true,
                message: 'Registro cadastrado com sucesso',
                data,
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async mostrarUsuario(id: number) {
        try {
            const user = (await Usuario.findOrFail(id)).toJSON()
            const permissoes = await db.from('usuario_setor').select('setor_id', 'permissao').where('usuario_id', user.id)

            return {
                status: true,
                message: `Registro encontrado`,
                data: {
                    id: user.id,
                    nome: user.nome,
                    cpf: user.cpf,
                    tipo: user.tipo,
                    permissoes
                },
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async atualizarUsuario(id: number, dados: UsuarioInterface) {
        try {
            const { permissoes, ...dadosUsuario } = dados;
            if (dadosUsuario.tipo === 3 || dadosUsuario.tipo === 4) {
                if (!permissoes || permissoes.length <= 0) {
                    throw new Error('Para usuários de tipo 3 ou 4, é obrigatório informar os setores e permissões.')
                }
            }

            const usuario = await Usuario.findOrFail(id)

            await db.from('usuario_setor').where('usuario_id', id).delete();

            if (dadosUsuario.tipo === 1 || dadosUsuario.tipo === 2) {
                const setores = await db.from('setor').select('id')
                const usuarioSetorData = setores.map((item) => ({
                    usuarioId: id,
                    setorId: item.id,
                    permissao: dadosUsuario.tipo
                }));
                await UsuarioSetor.createMany(usuarioSetorData);
            }
            else if ((dadosUsuario.tipo === 3 || dadosUsuario.tipo === 4) && permissoes) {
                const usuarioSetorData = permissoes.map((item) => ({
                    usuarioId: id,
                    setorId: item.setorId,
                    permissao: dadosUsuario.tipo === 4 ? 4 : item.permissao,
                }));
                await UsuarioSetor.createMany(usuarioSetorData);
            }

            usuario.merge(dadosUsuario)
            await usuario.save()

            return {
                status: true,
                message: 'Registro atualizado com sucesso',
                data: usuario.toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async deletarUsuario(id: number) {
        try {
            const usuario = await Usuario.findOrFail(id)
            await usuario.delete()
            return {
                status: true,
                message: `Registro excluído com sucesso`,
                data: null,
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

}