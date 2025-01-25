import Entrada from "#models/entrada";
import Saida from "#models/saida";
import { EntradaSaidaInterface } from "app/interfaces/EntradaSaidaInterface.js";

export default class EntradaSaidaService {

    public async listarEntradas(estoque?: number, produto?: number, usuario?: number) {
        try {
            let query = Entrada.query()

            if (estoque) {
                query = query.where('estoque_id', estoque)
            }

            if (produto) {
                query = query.where('produto_id', produto)
            }

            if (usuario) {
                query = query.where('usuario_id', usuario)
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

    public async criarEntrada(dados: EntradaSaidaInterface) {
        try {
            const info = await Entrada.create(dados);
            return {
                status: true,
                message: 'Registro cadastrado com sucesso',
                data: info.toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async mostrarEntrada(id: number) {
        try {
            const info = Entrada.findOrFail(id)
            return {
                status: true,
                message: `Registro encontrado`,
                data: (await info).toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async listarSaidas(estoque?: number, produto?: number, usuario?: number, unidade?: number, setor?: number) {
        try {
            let query = Saida.query()

            if (estoque) {
                query = query.where('estoque_id', estoque)
            }

            if (produto) {
                query = query.where('produto_id', produto)
            }

            if (usuario) {
                query = query.where('usuario_id', usuario)
            }

            if (unidade) {
                query = query.where('unidade_id', unidade)
            }

            if (setor) {
                query = query.where('setor_id', setor)
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

    public async criarSaida(dados: EntradaSaidaInterface) {
        try {
            const info = await Saida.create(dados);
            return {
                status: true,
                message: 'Registro cadastrado com sucesso',
                data: info.toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async mostrarSaida(id: number) {
        try {
            const info = Saida.findOrFail(id)
            return {
                status: true,
                message: `Registro encontrado`,
                data: (await info).toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }
}