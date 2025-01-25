import vine from "@vinejs/vine";
import { cnpjRule } from "../rules/cnpj.js";
import { formatarNumero } from "../utils/format.js";


export const unidadeCreateValidator = vine.compile(
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
        endereco: vine.string().minLength(3).maxLength(255),
        cidadeId: vine.number().exists(async (db, value) => {
            const cidade = await db.from('public.cidade').where('id', value).first()
            return cidade != undefined
        })
    })
);

export const unidadeUpdateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(255).optional(),
        cnpj: vine
            .string()
            .use(cnpjRule({}))
            .minLength(14)
            .maxLength(18)
            .transform((value) => {
                return formatarNumero(value)
            })
            .optional(),

        telefone: vine
            .string()
            .minLength(10)
            .maxLength(16)
            .transform((value) => {
                return formatarNumero(value)
            }).optional(),
        endereco: vine.string().minLength(3).maxLength(255).optional(),
        cidadeId: vine.number().exists(async (db, value) => {
            const cidade = await db.from('public.cidade').where('id', value).first()
            return cidade != undefined
        }).optional()
    })
);

export const cidadeCreateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(255),
        uf: vine.string()
    })
);

export const cidadeUpdateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(255).optional(),
        uf: vine.string().optional()
    })
);

export const setorCreateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(255),
        unidadeId: vine.number().exists(async (db, value) => {
            const unidade = await db.from('public.unidade').where('id', value).first()
            return unidade != undefined
        }),
    })
);

export const setorUpdateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(255).optional(),
        unidadeId: vine.number().exists(async (db, value) => {
            const unidade = await db.from('public.unidade').where('id', value).first()
            return unidade != undefined
        }).optional(),
    })
);