export interface ProdutoInterface {
    id?: number
    nome?: string
    quantidade?: number
    unidadeMedida?: string
    fornecedorId?: number
    categoriaId?: number
    estoqueId?: number
    qtdMin?: number
    anexo?: string | null
}

export interface FornecedorInterface {
    id?: number
    nome?: string
    cnpj?: string
    telefone?: string
    estoqueId?: number
}

export interface CategoriaInterface {
    id?: number
    nome?: string
    estoqueId?: number
}