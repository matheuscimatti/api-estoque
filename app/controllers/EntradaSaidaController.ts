import EntradaSaidaService from '#services/EntradaSaidaService';
import ProdutoService from '#services/ProdutoService';
import { entradaValidator, saidaValidator } from '#validators/EntradaSaidaValidator';
import type { HttpContext } from '@adonisjs/core/http'

export default class EntradaController {
    private entradaSaidaService = new EntradaSaidaService()
    private produtoService = new ProdutoService()

    public async listarEntrada({ request, response }: HttpContext) {
        const { estoque, produto, usuario } = request.qs()
        const result = await this.entradaSaidaService.listarEntradas(estoque, produto, usuario)
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async listarSaida({ request, response }: HttpContext) {
        const { estoque, produto, usuario, unidade, setor } = request.qs()
        const result = await this.entradaSaidaService.listarSaidas(estoque, produto, usuario, unidade, setor)
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async criarEntrada({ request, response }: HttpContext) {
        const dados = await entradaValidator.validate(request.all());

        const produto = await this.produtoService.mostrarProduto(dados.produtoId);
        const qtdProduto = produto.data.quantidade;

        await this.produtoService.atualizarProduto(dados.produtoId, { quantidade: qtdProduto + dados.quantidade });

        const result = await this.entradaSaidaService.criarEntrada(dados);
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async criarSaida({ request, response }: HttpContext) {
        const dados = await saidaValidator.validate(request.all());

        const produto = await this.produtoService.mostrarProduto(dados.produtoId);
        const qtdProduto = produto.data.quantidade;
        const qtdMinProduto = produto.data.qtdMin;
        const qtdPermitida = qtdProduto - qtdMinProduto;

        if (dados.quantidade > qtdPermitida) {
            return response.status(400).send({
                status: false,
                message: `Quantidade máxima permitida para retirada é de ${qtdPermitida}`
            })
        }

        await this.produtoService.atualizarProduto(dados.produtoId, { quantidade: qtdProduto - dados.quantidade });

        const result = await this.entradaSaidaService.criarSaida(dados)
        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async mostrarEntrada({ params, response }: HttpContext) {
        const result = await this.entradaSaidaService.mostrarEntrada(params.id)
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async mostrarSaida({ params, response }: HttpContext) {
        const result = await this.entradaSaidaService.mostrarSaida(params.id)
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    // public async relatorioMovimentacoes({ params, response }: HttpContext) {

    // }

    // public async relatorioUnidades({ params, response }: HttpContext) {

    // }
}