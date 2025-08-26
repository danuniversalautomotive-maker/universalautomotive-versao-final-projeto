import { IOClients } from '@vtex/api'
import { TokenClient } from './tokenClient'


// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {

  public get tokenClient() {
    return this.getOrSet('tokenClient', TokenClient)
  }
}
