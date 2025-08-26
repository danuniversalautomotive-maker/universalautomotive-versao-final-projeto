import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export class Facets extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.vtexcommercestable.com.br/api`, context, {
      ...(options ?? {}),
      headers: {
        ...(options?.headers ?? {}),
        'Content-Type': 'application/json',
        VtexIdclientAutCookie: context.authToken,
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public async getFacets(
    CategoryName: string,
    Key: string,
    Name: string,
    Key2: string,
    Name2: string,
    Key3: string,
    Name3: string
  ) {
    const facets = await this.http
      .get(
        `/io/_v/api/intelligent-search/facets/category-1/${CategoryName}/${Key}/${Name}/${Key2}/${Name2}/${Key3}/${Name3}`
      )
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        console.log('Deu certo 2')
      })

    return facets
  }
}
