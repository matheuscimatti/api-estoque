import Estoque from "#models/estoque";
import db from "@adonisjs/lucid/services/db";
import { EstoqueInterface } from "app/interfaces/EstoqueInterface.js";


export default class EstoqueService {

    public async listarEstoques(setor?: number, produto?: number) {
        try {
            let query = db.query().from('estoque');

            if (setor) {
                query = query.where('estoque.setor_id', setor)
            }

            if (produto) {
                query = query.where('estoque.produto_id', produto)
            }

            query = query
                .join('setor', 'setor.id', 'estoque.setor_id')
                .join('produto', 'produto.id', 'estoque.produto_id')
                .select('estoque.id', 'estoque.setor_id', 'setor.nome as setor', 'estoque.produto_id', 'produto.nome as produto', 'estoque.quantidade', 'estoque.qtd_min')

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

    public async criarEstoque(dados: EstoqueInterface) {
        try {
            if (dados.setorId && dados.produtoId) {
                const existeEstoque = await db
                    .from('estoque')
                    .where('setor_id', dados.setorId)
                    .andWhere('produto_id', dados.produtoId);
                if (existeEstoque.length > 0) {
                    throw new Error(`Já existe um estoque deste produto no setor informado. ID: ${existeEstoque[0].id}`)
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

    public async atualizarEstoque(id: number, dados: EstoqueInterface) {
        try {
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