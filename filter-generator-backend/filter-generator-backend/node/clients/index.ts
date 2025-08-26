import { IOClients } from '@vtex/api'

import { CategoryTree } from './CategoryTree'
import { Facets } from './Facets'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get getCategories() {
    return this.getOrSet('getCategories', CategoryTree)
  }

  public get getFacets() {
    return this.getOrSet('getFacets', Facets)
  }
}
