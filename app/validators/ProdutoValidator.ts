import vine from "@vinejs/vine";
import { cnpjRule } from "../rules/cnpj.js";
import { formatarNumero } from "../utils/format.js";

export const produtoCreateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(255),
        quantidade: vine.number(),
        unidadeMedida: vine.string(),
        fornecedorId: vine.number().exists(async (db, value) => {
            const fornecedor = await db.from('public.fornecedor').where('id', value).first()
            return fornecedor != undefined
        }),
        categoriaId: vine.number().exists(async (db, value) => {
            const categoria = await db.from('public.categoria').where('id', value).first()
            return categoria != undefined
        }),
        estoqueId: vine.number().exists(async (db, value) => {
            const estoque = await db.from('public.estoque').where('id', value).first()
            return estoque != undefined
        }),
        qtdMin: vine.number(),
        anexo: vine.string().nullable().optional()
    })
);

export const produtoUpdateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(255).optional(),
        quantidade: vine.number().optional(),
        unidadeMedida: vine.string().optional(),
        fornecedorId: vine.number().exists(async (db, value) => {
            const fornecedor = await db.from('public.fornecedor').where('id', value).first()
            return fornecedor != undefined
        }).optional(),
        categoriaId: vine.number().exists(async (db, value) => {
            const categoria = await db.from('public.categoria').where('id', value).first()
            return categoria != undefined
        }).optional(),
        estoqueId: vine.number().exists(async (db, value) => {
            const estoque = await db.from('public.estoque').where('id', value).first()
            return estoque != undefined
        }).optional(),
        qtdMin: vine.number().optional(),
        anexo: vine.string().nullable().optional()
    })
);

export const fornecedorCreateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(255),
        cnpj: vine
            .string()
            .use(cnpjRule({}))
            .minLength(14)
            .maxLength(18)
            .transform((value) => {
                return formatarNumero(value)
            }),
        telefone: vine
            .string()
            .minLength(10)
            .maxLength(16)
            .transform((value) => {
                return formatarNumero(value)
            }),
        estoqueId: vine.number().exists(async (db, value) => {
            const estoque = await db.from('public.estoque').where('id', value).first()
            return estoque != undefined
        }),
    })
);

export const fornecedorUpdateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(255).optional(),
        cnpj: vine
            .string()
            .use(cnpjRule({}))
            .minLength(14)
            .maxLength(18)
            .transform((value) => {
                return formatarNumero(value)
            }).optional(),
        telefone: vine
            .string()
            .minLength(10)
            .maxLength(16)
            .transform((value) => {
                return formatarNumero(value)
            }).optional(),
        estoqueId: vine.number().exists(async (db, value) => {
            const estoque = await db.from('public.estoque').where('id', value).first()
            return estoque != undefined
        }).optional(),
    })
);

export const categoriaCreateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(255),
        estoqueId: vine.number().exists(async (db, value) => {
            const estoque = await db.from('public.estoque').where('id', value).first()
            return estoque != undefined
        }),
    })
);

export const categoriaUpdateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(255).optional(),
        estoqueId: vine.number().exists(async (db, value) => {
            const estoque = await db.from('public.estoque').where('id', value).first()
            return estoque != undefined
        }).optional(),
    })
);