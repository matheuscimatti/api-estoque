import vine from "@vinejs/vine";

export const estoqueCreateValidator = vine.compile(
    vine.object({
        produtoId: vine.number().exists(async (db, value) => {
            const produto = await db.from('public.produto').where('id', value).first()
            return produto != undefined
        }),
        setorId: vine.number().exists(async (db, value) => {
            const setor = await db.from('public.setor').where('id', value).first()
            return setor != undefined
        }),
        quantidade: vine.number(),
        qtdMin: vine.number()
    })
);

export const estoqueUpdateValidator = vine.compile(
    vine.object({
        quantidade: vine.number().optional(),
        qtdMin: vine.number().optional()
    })
);