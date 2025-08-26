import { json } from 'co-body'
import { mapSkus } from '../utils/product'
import { UserInputError } from '@vtex/api'

type InfinityCartSearch = {
  email?: string
  id?: string
  lastCart?: string
}

export async function getClientLastCart(ctx: Context, next: () => Promise<any>) {
  const { clients: { masterdata }, query } = ctx

  try {
    const { email } = query

    if (!email) {
      throw new UserInputError('Missing query param email in request!')
    }

    const response: InfinityCartSearch[] = await masterdata.searchDocuments({
      dataEntity: 'IC',
      fields: ['lastCart'],
      where: `email=${email}`,
      pagination: {
        page: 1,
        pageSize: 10,
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
    await next();
  }
}

export async function updateClientLastCart(ctx: Context, next: () => Promise<any>) {
  const { clients: { masterdata } } = ctx
  const body: { skuURL: string, email: string, userId: string } = await json(ctx.req)
  const skus = mapSkus(body.skuURL)

  try {
    if (skus.length === 0) {
      return await next()
    }

    const response: InfinityCartSearch[] = await masterdata.searchDocuments({
      dataEntity: 'IC',
      fields: ['email', 'id'],
      where: `email=${body.email}`,
      pagination: {
        page: 1,
        pageSize: 500,
      }
    })

    await masterdata.createOrUpdatePartialDocument({
      dataEntity: 'IC',
      id: response?.[0]?.id,
      fields: {
        email: body.email,
        lastCart: JSON.stringify(skus),
        userId: body.userId
      }
    })
    ctx.status = 204
    return await next()
  } catch (e) {
    console.error(e)
    ctx.status = 500
    ctx.body = {
      error: e?.message
    }
    await next();
  }


}

export async function deleteClientLastCart(ctx: Context, next: () => Promise<any>) {
  const { clients: { masterdata } } = ctx

  try {
    const body: { email: string } = await json(ctx.req)
    if(!body.email) {
      throw new UserInputError('Missing query param email in request!')
    }

    const response: InfinityCartSearch[] = await masterdata.searchDocuments({
      dataEntity: 'IC',
      fields: ['email', 'id'],
      where: `email=${body.email}`,
      pagination: {
        page: 1,
        pageSize: 5,
      }
    })

    if (!response || response.length === 0) {
      ctx.status = 304;
      return await next();
    }

    await masterdata.deleteDocument({
      dataEntity: 'IC',
      id: response?.[0]?.id!,
    })

    ctx.status = 204
    return await next()
  } catch (e) {
    console.error('Deu ruim: ', e.message)
    ctx.status = 500
    ctx.body = {
      error: e?.message
    }
    await next();
  }
}
