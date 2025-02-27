export interface EntradaInterface {
    id?: number
    data?: string
    hora?: string
    estoqueId: number
    produtoId?: number
    setorId?: number
    quantidade: number
    valorProduto?: number
    usuarioId?: number
    solicitadoPor: string
    observacao?: string | null
    saidaId?: number | null
    setorSaidaId?: number | null
}

export interface SaidaInterface {
    id?: number
    data?: string
    hora?: string
    estoqueId: number
    produtoId?: number
    setorId?: number
    quantidade: number
    valorProduto?: number
    usuarioId?: number
    retiradoPor: string
    observacao?: string | null
    entradaId?: number | null
    setorEntradaId?: number | null
}