import Produto from "#models/produto";
import db from "@adonisjs/lucid/services/db";
import { ProdutoInterface } from "app/interfaces/ProdutoInterface.js";

export default class ProdutoService {

    public async listarProdutos(categoria?: number, fornecedor?: number) {
        try {
            let query = db.query().from('produto');

            if (categoria) {
                query = query.where('produto.categoria_id', categoria)
            }

            if (fornecedor) {
                query = query.where('produto.fornecedor_id', fornecedor)
            }

            query = query
                .join('categoria', 'categoria.id', 'produto.categoria_id')
                .join('fornecedor', 'fornecedor.id', 'produto.fornecedor_id')
                .select('produto.id', 'produto.nome', 'produto.categoria_id', 'categoria.nome as categoria', 'produto.fornecedor_id', 'fornecedor.nome as fornecedor', 'produto.valor')

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

    public async criarProduto(dados: ProdutoInterface) {
        try {
            const info = await Produto.create(dados);
            return {
                status: true,
                message: 'Registro cadastrado com sucesso',
                data: info.toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async mostrarProduto(id: number) {
        try {
            const info = Produto.findOrFail(id)
            return {
                status: true,
                message: `Registro encontrado`,
                data: (await info).toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async atualizarProduto(id: number, dados: ProdutoInterface) {
        try {
            const produto = await Produto.findOrFail(id)
            produto.merge(dados)
            await produto.save()
            return {
                status: true,
                message: 'Registro atualizado com sucesso',
                data: produto.toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async deletarProduto(id: number) {
        try {
            const produto = await Produto.findOrFail(id)
            await produto.delete()
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