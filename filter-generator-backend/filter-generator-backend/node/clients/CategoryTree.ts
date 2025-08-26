import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export class CategoryTree extends ExternalClient {
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

  public async getCategories(categoryLevels: number) {
    const categories = await this.http
      .get(`/catalog_system/pvt/category/tree/${categoryLevels}`)
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        console.log('Deu certo')
      })

    console.log(categories, 'categories')

    return categories
  }
}
