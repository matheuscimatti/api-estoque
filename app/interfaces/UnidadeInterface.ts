export interface UnidadeInterface {
    id?: number
    nome?: string
    cnpj?: string
    telefone?: string
    endereco?: string
    cidadeId?: number
}

export interface CidadeInterface {
    id?: number
    nome?: string
    uf?: string
}

export interface SetorInterface {
    id?: number
    nome?: string
    unidadeId?: number
}