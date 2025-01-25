export interface UsuarioInterface {
    id?: number
    nome?: string
    cpf?: string
    senha?: string
    tipo?: number
    estoqueId?: number[] | null
}

export interface EstoqueInterface {
    id?: number
    nome?: string
}