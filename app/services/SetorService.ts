import Setor from "#models/setor";
import { SetorInterface } from "app/interfaces/UnidadeInterface.js";

export default class SetorService {

    public async listarSetores(unidade?: number) {
        try {
            let query = Setor.query();

            if (unidade) {
                query = query.where('unidade_id', unidade)
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

    public async criarSetor(dados: SetorInterface) {
        try {
            const info = await Setor.create(dados);
            return {
                status: true,
                message: 'Registro cadastrado com sucesso',
                data: info.toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async atualizarSetor(id: number, dados: SetorInterface) {
        try {
            const setor = await Setor.findOrFail(id)
            setor.merge(dados)
            await setor.save()
            return {
                status: true,
                message: 'Registro atualizado com sucesso',
                data: setor.toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async deletarSetor(id: number) {
        try {
            const setor = await Setor.findOrFail(id)
            await setor.delete()
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