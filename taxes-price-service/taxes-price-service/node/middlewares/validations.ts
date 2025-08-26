import { UserInputError } from '@vtex/api'
import { json } from 'co-body'

export async function validateBody(ctx: Context, next: () => Promise<any>) {
  const body: {orderFormId: string, shippingValue: number} = await json(ctx.req)
  try {

    if (!body || !body.orderFormId) {
      throw new UserInputError('"orderFormId" and "shippingValue" is required in body request')
    }

    ctx.state.orderFormId = String(body.orderFormId)
    ctx.state.shippingValue = Number(body.shippingValue)
    await next()
  } catch(e) {
    ctx.status = 500
    ctx.body = {
      error: e.message
    }
  }
}
