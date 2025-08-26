import { IOClients } from '@vtex/api';
import CheckoutClient from './checkout';

export class Clients extends IOClients {
  public get checkoutClient() {
    return this.getOrSet('checkoutClient', CheckoutClient);
  }
}
