import { queries as categoryQueries } from './categoryTree'

const resolvers = {
  Query: {
    catalog: categoryQueries.getCategories,
    Allfacets: categoryQueries.getFacets,
  },
}

export default resolvers
