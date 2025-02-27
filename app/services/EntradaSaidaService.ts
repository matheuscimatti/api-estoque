import NotFoundException from "#exceptions/notfound_exception";
import UnauthorizedException from "#exceptions/unauthorized_exception";
import Entrada from "#models/entrada";
import Estoque from "#models/estoque";
import Saida from "#models/saida";
import db from "@adonisjs/lucid/services/db";
import { EntradaInterface, SaidaInterface } from "app/interfaces/EntradaSaidaInterface.js";
import { DateTime } from "luxon";

export default class EntradaSaidaService {

    public async listarEntradas(dataInicio?: string, dataFim?: string, estoque?: number, setor?: number, produto?: number, categoria?: number, usuario?: number, solicitadoPor?: string) {
        try {
            let query = db.query()
                .from('entrada')
                .join('produto', 'produto.id', 'entrada.produto_id')
                .join('setor', 'setor.id', 'entrada.setor_id')
                .join('usuario', 'usuario.id', 'entrada.usuario_id')
                .select('entrada.*', 'produto.nome as produto', 'setor.nome as setor', 'usuario.nome as usuario')
                .orderByRaw('data, created_at');

            if (dataInicio && dataFim) {
                query = query.whereBetween('data', [dataInicio, dataFim])
            }

            if (estoque) {
                query = query.where('entrada.estoque_id', estoque)
            }

            if (setor) {
                query = query.where('entrada.setor_id', setor)
            }

            if (produto) {
                query = query.where('entrada.produto_id', produto)
            }

            if (categoria) {
                query = query.where('produto.categoria_id', categoria)
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
                .join('produto', 'produto.id', 'estoque.produto_id')
                .select('usuario_setor.permissao', 'estoque.setor_id as setorId', 'estoque.produto_id as produtoId', 'produto.valor as valorProduto')
                .where('usuario_setor.usuario_id', userId)
                .andWhere('estoque.id', dados.estoqueId)
                .first()

            if (!permissao || permissao?.permissao === '2' || permissao?.permissao === '3') {
                throw new UnauthorizedException('Usuário sem permissão para dar entrada neste estoque', { code: 'UNAUTHORIZED', status: 401 })
            }

            let saidaId = null;
            let dadosSaida;
            const dataAtual = DateTime.local({ zone: 'America/Cuiaba' });

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
                    data: dataAtual,
                    hora: dataAtual.toFormat('HH:mm:ss'),
                    estoqueId: Number(estoqueSaidaId),
                    produtoId: permissao.produtoId,
                    setorId: permissao.setorId,
                    quantidade: dados.quantidade,
                    valorProduto: permissao.valorProduto,
                    usuarioId: userId,
                    retiradoPor: dados.solicitadoPor,
                    observacao: dados.observacao ?? null
                })
                saidaId = (dadosSaida).toJSON().id;
            }

            const dadosEntrada = {
                data: dataAtual,
                hora: dataAtual.toFormat('HH:mm:ss'),
                estoqueId: dados.estoqueId,
                produtoId: permissao.produtoId,
                setorId: permissao.setorId,
                quantidade: dados.quantidade,
                valorProduto: permissao.valorProduto,
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

    public async listarSaidas(dataInicio?: string, dataFim?: string, estoque?: number, setor?: number, produto?: number, categoria?: number, usuario?: number, retiradoPor?: string) {
        try {
            let query = db.query()
                .from('saida')
                .join('produto', 'produto.id', 'saida.produto_id')
                .join('setor', 'setor.id', 'saida.setor_id')
                .join('usuario', 'usuario.id', 'saida.usuario_id')
                .select('saida.*', 'produto.nome as produto', 'setor.nome as setor', 'usuario.nome as usuario')
                .orderByRaw('data, created_at');

            if (dataInicio && dataFim) {
                query = query.whereBetween('data', [dataInicio, dataFim])
            }

            if (estoque) {
                query = query.where('saida.estoque_id', estoque)
            }

            if (setor) {
                query = query.where('saida.setor_id', setor)
            }

            if (produto) {
                query = query.where('saida.produto_id', produto)
            }

            if (categoria) {
                query = query.where('produto.categoria_id', categoria)
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
                .join('produto', 'produto.id', 'estoque.produto_id')
                .select('usuario_setor.permissao', 'estoque.setor_id as setorId', 'estoque.produto_id as produtoId', 'produto.valor as valorProduto')
                .where('usuario_setor.usuario_id', userId)
                .andWhere('estoque.id', dados.estoqueId)
                .first()

            if (!permissao || permissao?.permissao === '2' || permissao?.permissao === '3') {
                throw new UnauthorizedException('Usuário sem permissão para dar saída neste estoque', { code: 'UNAUTHORIZED', status: 401 })
            }

            let entradaId = null;
            let dadosEntrada;
            const dataAtual = DateTime.local({ zone: 'America/Cuiaba' });

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
                    data: dataAtual,
                    hora: dataAtual.toFormat('HH:mm:ss'),
                    estoqueId: Number(estoqueEntradaId),
                    produtoId: permissao.produtoId,
                    setorId: permissao.setorId,
                    quantidade: dados.quantidade,
                    valorProduto: permissao.valorProduto,
                    usuarioId: userId,
                    solicitadoPor: dados.retiradoPor,
                    observacao: dados.observacao ?? null
                })
                entradaId = (dadosEntrada).toJSON().id;
            }

            const dadosSaida = {
                data: dataAtual,
                hora: dataAtual.toFormat('HH:mm:ss'),
                estoqueId: dados.estoqueId,
                produtoId: permissao.produtoId,
                setorId: permissao.setorId,
                quantidade: dados.quantidade,
                valorProduto: permissao.valorProduto,
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

    public async listarMovimentacoes(setorId: number, dataInicio: string, dataFim: string, categoriaId?: number, produtoId?: number) {
        try {
            let query = db.rawQuery(`
                WITH transacoes AS (
                    SELECT estoque_id, data, quantidade, 'entrada' AS tipo
                    FROM entrada
                    WHERE setor_id = ${setorId}
                    UNION ALL
                    SELECT estoque_id, data, quantidade, 'saida' AS tipo
                    FROM saida
                    WHERE setor_id = ${setorId}
                ),
    
                qtd_ate_inicio AS (
                    SELECT
                        estoque_id,
                        COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN quantidade ELSE -quantidade END), 0) AS diff
                    FROM transacoes
                    WHERE data < '${dataInicio}'
                    GROUP BY estoque_id
                ),
    
                movimentacao_periodo AS (
                    SELECT
                        estoque_id,
                        SUM(CASE WHEN tipo = 'entrada' THEN quantidade ELSE 0 END) AS entraram,
                        SUM(CASE WHEN tipo = 'saida' THEN quantidade ELSE 0 END) AS sairam
                    FROM transacoes
                    WHERE data BETWEEN '${dataInicio}' AND '${dataFim}'
                    GROUP BY estoque_id
                )
    
                SELECT
                    e.id AS estoque_id,
                    p.id AS produto_id,
                    p.nome AS produto_nome,
                    c.id AS categoria_id,
                    c.nome AS categoria_nome,
                    (e.qtd_inicial + COALESCE(qi.diff, 0)) AS qtdInicial,
                    COALESCE(mp.entraram, 0) AS qtdEntrou,
                    COALESCE(mp.sairam, 0) AS qtdSaiu,
                    (e.qtd_inicial + COALESCE(qi.diff, 0) + COALESCE(mp.entraram, 0) - COALESCE(mp.sairam, 0)) AS qtdFinal
                FROM estoque e
                JOIN produto p ON e.produto_id = p.id
                JOIN categoria c ON p.categoria_id = c.id
                LEFT JOIN qtd_ate_inicio qi ON e.id = qi.estoque_id
                LEFT JOIN movimentacao_periodo mp ON e.id = mp.estoque_id
                WHERE e.setor_id = ${setorId}
                ${produtoId ? 'AND e.produto_id = ' + produtoId : ''}
                ${categoriaId ? 'AND p.categoria_id = ' + categoriaId : ''};
            `)

            const result = await query.exec();
            return {
                status: true,
                message: `${result.rowCount} registro(s) encontrado(s)`,
                data: result.rows,
            }
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }
}