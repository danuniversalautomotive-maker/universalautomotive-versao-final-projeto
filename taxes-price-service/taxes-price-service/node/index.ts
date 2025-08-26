import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api';
import { LRUCache, method, Service } from '@vtex/api';

import { Clients } from './clients';
import { updateCardTaxes } from './middlewares/updateCardTaxes';
import { getStockByWarehouse } from './middlewares/getStockByWarehouse';
import { getClientDiscountCluster } from './middlewares/getClientDiscountCluster';
import { validateBody } from './middlewares/validations';
import dotenv from 'dotenv';
import path from 'path';

const TIMEOUT_MS = 8000;

const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache);

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 4,
      timeout: TIMEOUT_MS,
    },
    status: {
      memoryCache,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    orderFormId: string;
    shippingValue: number;
    skuID: string;
    email: string;
  }
}

const pathToEnvFile = path.join(__dirname, 'vtex.env');
dotenv.config({ path: pathToEnvFile });

export default new Service({
  clients,
  routes: {
    checkStateTax: method({
      POST: [validateBody, updateCardTaxes],
    }),
    getStockByWarehouse: method({
      POST: [getStockByWarehouse],
    }),
    getClientDiscountCluster: method({
      POST: [getClientDiscountCluster],
    }),
  },
})
