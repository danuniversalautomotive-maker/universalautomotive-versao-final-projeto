export async function getUserGroup(ctx: Context, next: () => Promise<any>) {
  // get post body
  const email = ctx.query.email as string
  const { account } = ctx.vtex
  const response = await ctx.clients.userGroup.getUserGroup(email, account)

  ctx.status = 200
  ctx.body = response

  await next()
}

export async function getCCOptions(ctx: Context, next: () => Promise<any>) {
  // get post body
  const authGroup = ctx.query.authorizationGroup as string
  const { account } = ctx.vtex
  const response = await ctx.clients.userGroup.getCcOptions(authGroup, account)

  ctx.status = 200
  ctx.body = response

  await next()
}

export async function getCPOptions(ctx: Context, next: () => Promise<any>) {
  // get post body
  const authGroup = ctx.query.authorizationGroup as string
  const { account } = ctx.vtex
  const response = await ctx.clients.userGroup.getCpOptions(authGroup, account)

  ctx.status = 200
  ctx.body = response

  await next()
}

export async function addInterests(ctx: Context, next: () => Promise<any>) {
  const { orderFormId, interest } = ctx.req as any

  await ctx.clients.userGroup.addInterests(orderFormId, interest)

  ctx.status = 200

  await next()
}

export async function removeInterests(ctx: Context, next: () => Promise<any>) {
  const { orderFormId } = ctx.req as any

  await ctx.clients.userGroup.removeInterests(orderFormId)

  ctx.status = 200

  await next()
}
