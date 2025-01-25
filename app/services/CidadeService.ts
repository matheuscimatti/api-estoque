import Cidade from "#models/cidade";
import { CidadeInterface } from "app/interfaces/UnidadeInterface.js";

export default class CidadeService {

    public async listarCidades() {
        try {
            const info = await Cidade.all();
            return {
                status: true,
                message: `${info.length} registro(s) encontrado(s)`,
                data: info,
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async criarCidade(dados: CidadeInterface) {
        try {
            const info = await Cidade.create(dados);
            return {
                status: true,
                message: 'Registro cadastrado com sucesso',
                data: info.toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async atualizarCidade(id: number, dados: CidadeInterface) {
        try {
            const cidade = await Cidade.findOrFail(id)
            cidade.merge(dados)
            await cidade.save()
            return {
                status: true,
                message: 'Registro atualizado com sucesso',
                data: cidade.toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async deletarCidade(id: number) {
        try {
            const cidade = await Cidade.findOrFail(id)
            await cidade.delete()
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