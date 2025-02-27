import vine from "@vinejs/vine";
import { cnpjRule } from "../rules/cnpj.js";
import { formatarNumero } from "../utils/format.js";

export const produtoCreateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(100),
        categoriaId: vine.number().exists(async (db, value) => {
            const categoria = await db.from('public.categoria').where('id', value).first()
            return categoria != undefined
        }),
        fornecedorId: vine.number().exists(async (db, value) => {
            const fornecedor = await db.from('public.fornecedor').where('id', value).first()
            return fornecedor != undefined
        }),
        valor: vine.number(),
        anexo: vine.string().nullable().optional()
    })
);

export const produtoUpdateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(100).optional(),
        categoriaId: vine.number().exists(async (db, value) => {
            const categoria = await db.from('public.categoria').where('id', value).first()
            return categoria != undefined
        }).optional(),
        fornecedorId: vine.number().exists(async (db, value) => {
            const fornecedor = await db.from('public.fornecedor').where('id', value).first()
            return fornecedor != undefined
        }).optional(),
        valor: vine.number().optional(),
        anexo: vine.string().nullable().optional()
    })
);

export const fornecedorCreateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(100),
        cnpj: vine
            .string()
            .use(cnpjRule({}))
            .minLength(14)
            .maxLength(18)
            .unique(async (db, value) => {
                const fornecedor = await db.from('public.fornecedor').where('cnpj', value.replace(/\D/g, '')).first()
                return !fornecedor
            })
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
    })
);

export const fornecedorUpdateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(100).optional(),
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
    })
);

export const categoriaValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(50),
    })
);