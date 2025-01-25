export interface EntradaSaidaInterface {
    id?: number
    produtoId?: number
    quantidade?: number
    usuarioId?: number
    observacao?: string | null
    origem?: string
    destino?: string
}

export interface EntradaInterface {
    id?: number
    data?: string
    produtoId?: number
    quantidade?: number
    usuarioId?: number
    estoqueId?: number
    observacao?: string | null
}

export interface SaidaInterface {
    id?: number
    data?: string
    produtoId?: number
    quantidade?: number
    usuarioId?: number
    estoqueId?: number
    unidadeId?: number
    setorId?: number
    retiradoPor?: string
    observacao?: string | null
}