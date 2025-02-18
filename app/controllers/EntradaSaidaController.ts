import EntradaSaidaService from '#services/EntradaSaidaService';
import EstoqueService from '#services/EstoqueService';
import { entradaValidator, saidaValidator } from '#validators/EntradaSaidaValidator';
import type { HttpContext } from '@adonisjs/core/http'

export default class EntradaController {
    private entradaSaidaService = new EntradaSaidaService()
    private estoqueService = new EstoqueService()

    public async listarEntrada({ request, response, params }: HttpContext) {
        const { dataInicio, dataFim } = params;
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dataInicio) || !regex.test(dataFim)) {
            return response.status(400).send({
                status: false,
                message: 'dataInicio e dataFim são obrigatórios e devem estar no formato aaaa-mm-dd'
            })
        }
        const { setor, produto, usuario, solicitadoPor } = request.qs()
        const result = await this.entradaSaidaService.listarEntradas(dataInicio, dataFim, setor, produto, usuario, solicitadoPor)
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async listarSaida({ request, response, params }: HttpContext) {
        const { dataInicio, dataFim } = params;
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dataInicio) || !regex.test(dataFim)) {
            return response.status(400).send({
                status: false,
                message: 'dataInicio e dataFim são obrigatórios e devem estar no formato aaaa-mm-dd'
            })
        }
        const { setor, produto, usuario, retiradoPor } = request.qs()
        const result = await this.entradaSaidaService.listarSaidas(dataInicio, dataFim, setor, produto, usuario, retiradoPor)
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async criarEntrada({ request, response, auth }: HttpContext) {
        const dados = await entradaValidator.validate(request.all());
        const userId = (await auth.authenticate()).id;

        const result = await this.entradaSaidaService.criarEntrada(dados, userId);

        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async criarSaida({ request, response, auth }: HttpContext) {
        const dados = await saidaValidator.validate(request.all());

        const estoque = await this.estoqueService.mostrarEstoque(dados.estoqueId);
        const qtdProduto = estoque.data.quantidade;
        const qtdMinProduto = estoque.data.qtdMin;
        const qtdPermitida = qtdProduto - qtdMinProduto;

        if (dados.quantidade > qtdPermitida) {
            return response.status(400).send({
                status: false,
                message: `Quantidade máxima permitida para retirada é de ${qtdPermitida}`
            })
        }

        const userId = (await auth.authenticate()).id;

        const result = await this.entradaSaidaService.criarSaida(dados, userId)

        return response.status(201).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    public async relatorioMovimentacoes({ params, request, response }: HttpContext) {
        const { setorId, dataInicio, dataFim } = params;
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dataInicio) || !regex.test(dataFim)) {
            return response.status(400).send({
                status: false,
                message: 'dataInicio e dataFim são obrigatórios e devem estar no formato aaaa-mm-dd'
            })
        }

        const { categoria, produto} = request.qs()

        const result = await this.entradaSaidaService.listarMovimentacoes(setorId, dataInicio, dataFim, categoria, produto);
        return response.status(200).send({
            status: true,
            message: result?.message,
            data: result?.data,
        })
    }

    // public async relatorioUnidades({ params, response }: HttpContext) {

    // }
}