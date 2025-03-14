import db from "@adonisjs/lucid/services/db";

export default class DashboardService {
    public async buscarInformacoes(setorId?: number) {
        try {
            const cards = await db.rawQuery(
                `
                SELECT
                    COUNT(DISTINCT (p.nome, p.categoria_id, p.fornecedor_id)) AS total_produtos,
                    SUM(e.quantidade) AS total_itens_produto,
	                SUM(p.valor * e.quantidade) AS valor_total,
	                (select count(*) from entrada ${setorId ? 'WHERE setor_id = ' + setorId : ''}) AS qtd_entradas,
	                (select count(*) from saida ${setorId ? 'WHERE setor_id = ' + setorId : ''}) AS qtd_saidas
                FROM
                    produto p
                    INNER JOIN estoque e ON e.produto_id = p.id
                    INNER JOIN setor s ON e.setor_id = s.id
                ${setorId ?
                    'WHERE s.id = ' + setorId
                    : ''}
                `
            ).exec();

            const transacoesSetor = await db.rawQuery(
                `
                SELECT
                    s.nome AS setor_nome,
                    u.nome AS unidade_nome,
                    COUNT(*)::integer AS total_movimentacoes
                FROM (
                    SELECT setor_id FROM entrada
                    UNION ALL
                    SELECT setor_id FROM saida
                ) AS m
                    INNER JOIN setor s ON s.id = m.setor_id
                    INNER JOIN unidade u ON u.id = s.unidade_id
                GROUP BY s.nome, u.nome
                ORDER BY total_movimentacoes DESC
                `
            ).exec();

            const saidasPorCategoria = await db.rawQuery(
                `
                SELECT 
                    c.nome AS categoria,
                    SUM(s.quantidade) AS total_saida
                FROM
                    saida s
                    JOIN produto p ON s.produto_id = p.id
                    JOIN categoria c ON p.categoria_id = c.id
                    ${setorId ? `
                    JOIN setor ON s.setor_id = setor.id
                WHERE
                    setor.id = ${setorId}` :''}
                GROUP BY c.nome
                ORDER BY total_saida DESC
                `
            ).exec();

            const rowCards = cards.rows[0];

            const result = [
                { totalProdutos: Number(rowCards.total_produtos), tipo: 1 },
                { totalItens: Number(rowCards.total_itens_produto), tipo: 1 },
                { valorTotal: Number(rowCards.valor_total), tipo: 1 },
                { totalEntradas: Number(rowCards.qtd_entradas), tipo: 1 },
                { totalSaidas: Number(rowCards.qtd_saidas), tipo: 1 },
                { movimentacoesSetor: transacoesSetor.rows, tipo: 2 },
                { saidasCategoria: saidasPorCategoria.rows, tipo: 3 }
            ];

            return {
                status: true,
                data: result
            }

        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }
}