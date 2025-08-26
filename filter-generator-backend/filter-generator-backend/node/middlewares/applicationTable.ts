import { UserInputError } from '@vtex/api'


type ApplicationTableSearch = {
  assembler: string
  models: string
  dateFrom: string
  dateUntil: string
}

export async function getApplicationTableFromMasterData(ctx: Context, next: () => Promise<any>) {
  const { clients: { masterdata }, query } = ctx

  try {
    const { assembler, models } = query

    if (!assembler && !models) {
      throw new UserInputError('Missing query param assembler or models in request!')
    }

    const queryString = models ? `models="${models}"` : `assembler="${assembler}"`
    const fields = models ? ['assembler', 'models', 'dateFrom', 'dateUntil'] : ['assembler', 'models']

    const response: ApplicationTableSearch[] = await masterdata.searchDocuments({
      dataEntity: 'AT',
      fields,
      where: queryString,
      pagination: {
        page: 1,
        pageSize: 500,
      }
    })

    ctx.status = 200
    ctx.body = response
    return await next()
  } catch (e) {
    console.error(e)
    ctx.status = 500
    ctx.body = {
      error: e?.message
    }
  }
  await next();
}
