import vine from "@vinejs/vine";
import { cpfRule } from "../rules/cpf.js";
import { formatarNumero } from "../utils/format.js";

export const usuarioCreateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(100),
        cpf: vine
            .string()
            .use(cpfRule({}))
            .minLength(11)
            .maxLength(14)
            .unique(async (db, value) => {
                const user = await db.from('public.usuario').where('cpf', value.replace(/\D/g, '')).first()
                return !user
            })
            .transform((value) => {
                return formatarNumero(value)
            }),
        senha: vine.string().minLength(6).maxLength(20),
        tipo: vine.number().in([1, 2, 3, 4]),
        permissoes: vine.array(vine.object({
            setorId: vine.number().exists(async (db, value) => {
                const setor = await db.from('public.setor').where('id', value).first()
                return setor != undefined
            }),
            permissao: vine.number().in([1, 2, 3, 4]),
        })).nullable().optional()
    })
);

export const usuarioUpdateValidator = vine.compile(
    vine.object({
        nome: vine.string().minLength(3).maxLength(100).optional(),
        cpf: vine
            .string()
            .minLength(11)
            .maxLength(14)
            .use(cpfRule({}))
            .unique(async (db, value, field) => {
                const user = await db.from('public.usuario').where('cpf', value.replace(/\D/g, '')).whereNot('id', field.meta.usuarioId).first()
                return !user
            })
            .transform((value) => {
                return formatarNumero(value)
            })
            .optional(),
        senha: vine.string().minLength(6).maxLength(20).optional(),
        tipo: vine.number().in([1, 2, 3, 4]),
        permissoes: vine.array(vine.object({
            setorId: vine.number().exists(async (db, value) => {
                const setor = await db.from('public.setor').where('id', value).first()
                return setor != undefined
            }),
            permissao: vine.number().in([1, 2, 3, 4]),
        })).nullable().optional()
    })
);

export const usuarioLogin = vine.compile(
    vine.object({
        cpf: vine.string()
            .minLength(11)
            .use(cpfRule({}))
            .transform((value) => {
                return formatarNumero(value)
            }),

        senha: vine.string().minLength(6),
    })
);

export const estoqueValidator = vine.compile(
    vine.object({
        nome: vine.string()
            .minLength(3)
            .maxLength(255),
    })
);