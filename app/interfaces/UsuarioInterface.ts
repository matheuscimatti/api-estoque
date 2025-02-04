export interface UsuarioInterface {
    id?: number
    nome?: string
    cpf?: string
    senha?: string
    tipo?: number
    permissoes?: {setorId: number, permissao: number}[] | null
}

export interface EstoqueInterface {
    id?: number
    nome?: string
}