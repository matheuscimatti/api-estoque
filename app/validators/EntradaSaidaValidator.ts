import vine from "@vinejs/vine";

export const entradaValidator = vine.compile(
    vine.object({
        data: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        estoqueId: vine.number().exists(async (db, value) => {
            const estoque = await db.from('public.estoque').where('id', value).first()
            return estoque != undefined
        }),
        quantidade: vine.number(),
        solicitadoPor: vine.string().minLength(3).maxLength(50),
        observacao: vine.string().nullable().optional(),
        setorSaidaId: vine.number().exists(async (db, value) => {
            const setor = await db.from('public.setor').where('id', value).first()
            return setor != undefined
        }).nullable().optional(),
    })
);

export const saidaValidator = vine.compile(
    vine.object({
        data: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        estoqueId: vine.number().exists(async (db, value) => {
            const estoque = await db.from('public.estoque').where('id', value).first()
            return estoque != undefined
        }),
        quantidade: vine.number(),
        retiradoPor: vine.string().minLength(3).maxLength(50),
        observacao: vine.string().nullable().optional(),
        setorEntradaId: vine.number().exists(async (db, value) => {
            const setor = await db.from('public.setor').where('id', value).first()
            return setor != undefined
        }).nullable().optional(),
    })
);