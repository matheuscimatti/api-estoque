import vine from "@vinejs/vine";

export const entradaValidator = vine.compile(
    vine.object({
        data: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        produtoId: vine.number().exists(async (db, value) => {
            const produto = await db.from('public.produto').where('id', value).first()
            return produto != undefined
        }),
        quantidade: vine.number(),
        usuarioId: vine.number().exists(async (db, value) => {
            const usuario = await db.from('public.usuario').where('id', value).first()
            return usuario != undefined
        }),
        estoqueId: vine.number().exists(async (db, value) => {
            const estoque = await db.from('public.estoque').where('id', value).first()
            return estoque != undefined
        }),
        observacao: vine.string().nullable().optional(),
    })
);

export const saidaValidator = vine.compile(
    vine.object({
        data: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        produtoId: vine.number().exists(async (db, value) => {
            const produto = await db.from('public.produto').where('id', value).first()
            return produto != undefined
        }),
        quantidade: vine.number(),
        usuarioId: vine.number().exists(async (db, value) => {
            const usuario = await db.from('public.usuario').where('id', value).first()
            return usuario != undefined
        }),
        estoqueId: vine.number().exists(async (db, value) => {
            const estoque = await db.from('public.estoque').where('id', value).first()
            return estoque != undefined
        }),
        unidadeId: vine.number().exists(async (db, value) => {
            const unidade = await db.from('public.unidade').where('id', value).first()
            return unidade != undefined
        }),
        setorId: vine.number().exists(async (db, value) => {
            const setor = await db.from('public.setor').where('id', value).first()
            return setor != undefined
        }),
        retiradoPor: vine.string(),
        observacao: vine.string().nullable().optional(),
    })
);