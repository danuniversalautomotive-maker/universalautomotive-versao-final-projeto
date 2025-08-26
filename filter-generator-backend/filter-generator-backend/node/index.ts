import type { ClientsConfig, ServiceContext, IOContext } from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'

import { Clients } from './clients'
import type { CategoryTree } from './clients/CategoryTree'
import type { Facets } from './clients/Facets'
import resolvers from './resolvers/index'
import { getApplicationTableFromMasterData } from './middlewares/applicationTable'

const TIMEOUT_MS = 10000

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    status: {
      memoryCache,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients>
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  graphql: {
    resolvers,
  },
  routes: {
    applicationTable: method({
      GET: [getApplicationTableFromMasterData]
    }),
    keepAlive: [async function keepAlive(ctx, next) {
      ctx.body = "Ok";
      ctx.status = 200;
      await next()
    }],
  }
})

export interface AppContext {
  vtex: IOContext
  clients: {
    CategoryTree: CategoryTree
    Facets: Facets
  }
}
