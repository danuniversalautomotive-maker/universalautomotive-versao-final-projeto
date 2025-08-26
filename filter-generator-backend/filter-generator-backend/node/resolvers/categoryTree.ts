export const queries = {
  getCategories: async (_: any, params: any, ctx: Context) => {
    const { categoryLevels } = params

    const {
      clients: { getCategories },
    } = ctx

    const result: any = await getCategories.getCategories(categoryLevels)

    return result
  },
  getFacets: async (_: any, params: any, ctx: Context) => {
    const { CategoryName, Key, Name, Key2, Name2, Key3, Name3 } = params

    const {
      clients: { getFacets },
    } = ctx

    const result: any = await getFacets.getFacets(
      CategoryName,
      Key,
      Name,
      Key2,
      Name2,
      Key3,
      Name3
    )

    return result
  },
}
