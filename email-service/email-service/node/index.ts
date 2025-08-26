import type { ClientsConfig, ServiceContext, RecorderState } from "@vtex/api";
import { LRUCache, method, Service } from "@vtex/api";

import { Clients } from "./clients";

import { sendEmail } from "./middlewares/sendEmail";
import { configureMailTemplate } from "./events/configureMailTemplate";

const TIMEOUT_MS = 10000;
const CONCURRENCY = 10;

const memoryCache = new LRUCache<string, any>({ max: 5000 });

metrics.trackCache("status", memoryCache);

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 3,
      timeout: TIMEOUT_MS
    },
    events: {
      exponentialTimeoutCoefficient: 2,
      exponentialBackoffCoefficient: 2,
      initialBackoffDelay: 50,
      retries: 1,
      timeout: TIMEOUT_MS,
      concurrency: CONCURRENCY,
    },
    status: {
      memoryCache,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    payload: any;
    code: number
  }
}

export default new Service({
  clients,
  events: {
    configureMailTemplate,
  },
  routes: {
    sendEmail: method({
      POST: [sendEmail]
    })
  },
})
