import UnauthorizedException from "#exceptions/unauthorized_exception";
import Estoque from "#models/estoque";
import db from "@adonisjs/lucid/services/db";
import { EstoqueInterface } from "app/interfaces/EstoqueInterface.js";


export default class EstoqueService {

    public async listarEstoques(setor?: number, produto?: number, categoria?: number) {
        try {
            let query = db.query().from('estoque');

            if (setor) {
                query = query.where('estoque.setor_id', setor)
            }

            if (produto) {
                query = query.where('estoque.produto_id', produto)
            }
            
            if (categoria) {
                query = query.where('produto.categoria_id', categoria)
            }

            query = query
                .join('setor', 'setor.id', 'estoque.setor_id')
                .join('produto', 'produto.id', 'estoque.produto_id')
                .join('categoria', 'categoria.id', 'produto.categoria_id')
                .select('estoque.id', 'estoque.setor_id', 'setor.nome as setor', 'produto.categoria_id', 'categoria.nome as categoria', 'estoque.produto_id', 'produto.nome as produto', 'estoque.quantidade', 'estoque.qtd_min', 'produto.valor as valor_produto')

            const info = await query.exec();

            return {
                status: true,
                message: `${info.length} registro(s) encontrado(s)`,
                data: info,
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async criarEstoque(dados: EstoqueInterface, userId: number) {
        try {
            if (dados.setorId) {
                const permissao = await db
                    .from('usuario_setor')
                    .select('usuario_setor.permissao')
                    .where('usuario_setor.usuario_id', userId)
                    .andWhere('usuario_setor.setor_id', dados.setorId)
                    .first()

                if (!permissao || permissao?.permissao === '3') {
                    throw new UnauthorizedException('Usuário sem permissão para criar estoque neste setor', { code: 'UNAUTHORIZED', status: 401 })
                }
            }
            if (dados.setorId && dados.produtoId) {
                const existeEstoque = await db
                    .from('estoque')
                    .where('setor_id', dados.setorId)
                    .andWhere('produto_id', dados.produtoId);
                if (existeEstoque.length > 0) {
                    throw new Error(`Já existe um estoque deste produto no setor informado.`)
                }
            }

            const info = await Estoque.create(dados);
            return {
                status: true,
                message: 'Registro cadastrado com sucesso',
                data: info.toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async mostrarEstoque(id: number) {
        try {
            const info = Estoque.findOrFail(id)
            return {
                status: true,
                message: `Registro encontrado`,
                data: (await info).toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async atualizarEstoque(id: number, dados: EstoqueInterface, userId: number) {
        try {
            if (dados.id) {
                const permissao = await db
                    .from('usuario_setor')
                    .join('estoque', 'estoque.setor_id', 'usuario_setor.setor_id')
                    .select('usuario_setor.permissao')
                    .where('usuario_setor.usuario_id', userId)
                    .andWhere('estoque.id', dados.id)
                    .first()
    
                if (!permissao || permissao?.permissao === '3') {
                    throw new UnauthorizedException('Usuário sem permissão atualizar este estoque', { code: 'UNAUTHORIZED', status: 401 })
                }
            }
            const estoque = await Estoque.findOrFail(id)
            estoque.merge(dados)
            await estoque.save()
            return {
                status: true,
                message: 'Registro atualizado com sucesso',
                data: estoque.toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async deletarEstoque(id: number) {
        try {
            const estoque = await Estoque.findOrFail(id)
            await estoque.delete()
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