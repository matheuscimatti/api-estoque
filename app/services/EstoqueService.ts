import Estoque from "#models/estoque";
import { EstoqueInterface } from "app/interfaces/UsuarioInterface.js";


export default class EstoqueService {

    public async listarEstoques() {
        try {
            const info = await Estoque.all();
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