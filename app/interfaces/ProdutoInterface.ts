export interface ProdutoInterface {
    id?: number
    nome?: string
    categoriaId?: number
    fornecedorId?: number
    anexo?: string | null
}

export interface FornecedorInterface {
    id?: number
    nome?: string
    cnpj?: string
    telefone?: string
}

export interface CategoriaInterface {
    id?: number
    nome?: string
}