import NotFoundException from "#exceptions/notfound_exception";
import UnauthorizedException from "#exceptions/unauthorized_exception";
import Entrada from "#models/entrada";
import Estoque from "#models/estoque";
import Saida from "#models/saida";
import db from "@adonisjs/lucid/services/db";
import { EntradaInterface, SaidaInterface } from "app/interfaces/EntradaSaidaInterface.js";
import { DateTime } from "luxon";

export default class EntradaSaidaService {

    public async listarEntradas(dataInicio: string, dataFim: string, setor?: number, produto?: number, usuario?: number, solicitadoPor?: string) {
        try {
            let query = db.query()
                .from('entrada')
                .join('produto', 'produto.id', 'entrada.produto_id')
                .join('setor', 'setor.id', 'entrada.setor_id')
                .join('usuario', 'usuario.id', 'entrada.usuario_id')
                .select('entrada.*', 'produto.nome as produto', 'setor.nome as setor', 'usuario.nome as usuario')
                .whereBetween('data', [dataInicio, dataFim])
                .orderBy('data');

            if (setor) {
                query = query.where('entrada.setor_id', setor)
            }

            if (produto) {
                query = query.where('entrada.produto_id', produto)
            }

            if (usuario) {
                query = query.where('entrada.usuario_id', usuario)
            }

            if (solicitadoPor) {
                query = query.whereILike('entrada.solicitado_por', `%${solicitadoPor}%`)
            }

            const info = await query.exec();
            const data = info.map((entrada) => ({
                ...entrada,
                data: DateTime.fromJSDate(entrada.data).toFormat('yyyy-MM-dd'),
            }));
            return {
                status: true,
                message: `${info.length} registro(s) encontrado(s)`,
                data,
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async criarEntrada(dados: EntradaInterface, userId: number) {
        try {
            const permissao = await db
                .from('usuario_setor')
                .join('estoque', 'estoque.setor_id', 'usuario_setor.setor_id')
                .select('usuario_setor.permissao', 'estoque.setor_id as setorId', 'estoque.produto_id as produtoId')
                .where('usuario_setor.usuario_id', userId)
                .andWhere('estoque.id', dados.estoqueId)
                .first()

            if (!permissao || permissao?.permissao === '2' || permissao?.permissao === '3') {
                throw new UnauthorizedException('Usuário sem permissão para dar entrada neste estoque', { code: 'UNAUTHORIZED', status: 401 })
            }

            let saidaId = null;
            let dadosSaida;
            if (dados.setorSaidaId) {
                let estoqueSaidaId = await db
                    .from('estoque')
                    .select('id', 'quantidade', 'qtd_min')
                    .where('produto_id', permissao.produtoId)
                    .andWhere('setor_id', dados.setorSaidaId)

                if (!estoqueSaidaId || estoqueSaidaId.length <= 0) {
                    throw new NotFoundException('Não foi encontrado estoque do produto no setor de saída informado.', {
                        code: 'E_ROW_NOT_FOUND',
                        status: 404,
                    })
                } else {
                    const estoqueSaidaQtd = estoqueSaidaId[0].quantidade;
                    const qtdPermitida = estoqueSaidaQtd - estoqueSaidaId[0].qtd_min;
                    if (qtdPermitida >= dados.quantidade) {
                        estoqueSaidaId = estoqueSaidaId[0].id;
                        await db
                            .from('estoque')
                            .where('id', estoqueSaidaId)
                            .update({ quantidade: estoqueSaidaQtd - dados.quantidade })
                    } else {
                        throw new UnauthorizedException(`Quantidade ultrapassa a quantidade permitida para retirada no setor de saída informado: ${qtdPermitida}.`, { code: 'UNAUTHORIZED', status: 401 })
                    }
                }

                dadosSaida = await Saida.create({
                    data: DateTime.fromISO(dados.data),
                    estoqueId: Number(estoqueSaidaId),
                    produtoId: permissao.produtoId,
                    setorId: permissao.setorId,
                    quantidade: dados.quantidade,
                    usuarioId: userId,
                    retiradoPor: dados.solicitadoPor,
                    observacao: dados.observacao ?? null
                })
                saidaId = (dadosSaida).toJSON().id;
            }

            const dadosEntrada = {
                data: DateTime.fromISO(dados.data),
                estoqueId: dados.estoqueId,
                produtoId: permissao.produtoId,
                setorId: permissao.setorId,
                quantidade: dados.quantidade,
                usuarioId: userId,
                solicitadoPor: dados.solicitadoPor,
                observacao: dados.observacao ?? null,
                saidaId
            }

            const info = await Entrada.create(dadosEntrada);

            if (saidaId && dadosSaida) {
                dadosSaida.merge({ entradaId: (info.toJSON()).id });
                await dadosSaida.save();
            }

            return {
                status: true,
                message: 'Registro cadastrado com sucesso',
                data: info.toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async listarSaidas(dataInicio: string, dataFim: string, setor?: number, produto?: number, usuario?: number, retiradoPor?: string) {
        try {
            let query = db.query()
                .from('saida')
                .join('produto', 'produto.id', 'saida.produto_id')
                .join('setor', 'setor.id', 'saida.setor_id')
                .join('usuario', 'usuario.id', 'saida.usuario_id')
                .select('saida.*', 'produto.nome as produto', 'setor.nome as setor', 'usuario.nome as usuario')
                .whereBetween('data', [dataInicio, dataFim])
                .orderBy('data');

            if (setor) {
                query = query.where('saida.setor_id', setor)
            }

            if (produto) {
                query = query.where('saida.produto_id', produto)
            }

            if (usuario) {
                query = query.where('saida.usuario_id', usuario)
            }

            if (retiradoPor) {
                query = query.whereILike('saida.retirado_por', `%${retiradoPor}%`)
            }

            const info = await query.exec();
            const data = info.map((saida) => ({
                ...saida,
                data: DateTime.fromJSDate(saida.data).toFormat('yyyy-MM-dd'),
            }));
            return {
                status: true,
                message: `${info.length} registro(s) encontrado(s)`,
                data,
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    public async criarSaida(dados: SaidaInterface, userId: number) {
        try {
            const permissao = await db
                .from('usuario_setor')
                .join('estoque', 'estoque.setor_id', 'usuario_setor.setor_id')
                .select('usuario_setor.permissao', 'estoque.setor_id as setorId', 'estoque.produto_id as produtoId')
                .where('usuario_setor.usuario_id', userId)
                .andWhere('estoque.id', dados.estoqueId)
                .first()

            if (!permissao || permissao?.permissao === '2' || permissao?.permissao === '3') {
                throw new UnauthorizedException('Usuário sem permissão para dar saída neste estoque', { code: 'UNAUTHORIZED', status: 401 })
            }

            let entradaId = null;
            let dadosEntrada;
            if (dados.setorEntradaId) {
                let estoqueEntradaId = await db
                    .from('estoque')
                    .select('id', 'quantidade')
                    .where('produto_id', permissao.produtoId)
                    .andWhere('setor_id', dados.setorEntradaId)

                if (!estoqueEntradaId || estoqueEntradaId.length <= 0) {
                    estoqueEntradaId = ((await Estoque.create({
                        produtoId: permissao.produtoId,
                        setorId: dados.setorEntradaId,
                        quantidade: dados.quantidade,
                        qtdMin: 0
                    })).toJSON()).id;
                } else {
                    const estoqueEntradaQtd = estoqueEntradaId[0].quantidade;
                    estoqueEntradaId = estoqueEntradaId[0].id;
                    await db
                        .from('estoque')
                        .where('id', estoqueEntradaId)
                        .update({ quantidade: estoqueEntradaQtd + dados.quantidade })
                }

                dadosEntrada = await Entrada.create({
                    data: DateTime.fromISO(dados.data),
                    estoqueId: Number(estoqueEntradaId),
                    produtoId: permissao.produtoId,
                    setorId: permissao.setorId,
                    quantidade: dados.quantidade,
                    usuarioId: userId,
                    solicitadoPor: dados.retiradoPor,
                    observacao: dados.observacao ?? null
                })
                entradaId = (dadosEntrada).toJSON().id;
            }

            const dadosSaida = {
                data: DateTime.fromISO(dados.data),
                estoqueId: dados.estoqueId,
                produtoId: permissao.produtoId,
                setorId: permissao.setorId,
                quantidade: dados.quantidade,
                usuarioId: userId,
                retiradoPor: dados.retiradoPor,
                observacao: dados.observacao ?? null,
                entradaId
            }

            const info = await Saida.create(dadosSaida);

            if (entradaId && dadosEntrada) {
                dadosEntrada.merge({ saidaId: (info.toJSON()).id });
                await dadosEntrada.save();
            }

            return {
                status: true,
                message: 'Registro cadastrado com sucesso',
                data: info.toJSON(),
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }
}