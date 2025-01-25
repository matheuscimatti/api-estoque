import Fornecedor from "#models/fornecedor";
import { FornecedorInterface } from "app/interfaces/ProdutoInterface.js";

export default class FornecedorService {

    public async listarFornecedores(estoque?: number) {
        try {
            let query = Fornecedor.query();

            if (estoque) {
                query = query.where('estoque_id', estoque)
            }

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

    public async criarFornecedor(dados: FornecedorInterface) {
        try {
            const info = await Fornecedor.create(dados);
            return {
                status: true,
                message: 'Registro cadastrado com sucesso',
                data: info.toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async atualizarFornecedor(id: number, dados: FornecedorInterface) {
        try {
            const fornecedor = await Fornecedor.findOrFail(id)
            fornecedor.merge(dados)
            await fornecedor.save()
            return {
                status: true,
                message: 'Registro atualizado com sucesso',
                data: fornecedor.toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async deletarFornecedor(id: number) {
        try {
            const fornecedor = await Fornecedor.findOrFail(id)
            await fornecedor.delete()
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