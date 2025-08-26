export default async function getOrganizationInfo(ctx: Context, email: string) {
  const {
    authToken,
  } = ctx.vtex;

  const data = await ctx.clients.organizationGraphQL.getOrganizationByEmail(email, authToken!);

  return data;
}
