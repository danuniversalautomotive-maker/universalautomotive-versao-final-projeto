import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

import { API_KEY, API_TOKEN } from '../const'

export default class UserGroup extends JanusClient {
  private routes = {
    userGroup: (account: string, email: string) =>
      `https://${account}.vtexcommercestable.com.br/api/dataentities/CL/search?email=${encodeURIComponent(
        email
      )}&_fields=authorizationGroup`,
    ccOptions: (account: string, authorizationGroup: string) =>
      `https://${account}.vtexcommercestable.com.br/api/dataentities/CC/search?_where=ativo=true AND authorizationGroup="${encodeURIComponent(
        authorizationGroup
      )}"&_fields=ativo,authorizationGroup,classificacaoUniWEB,descricao,minInstallmentValue,minOrderValue,repeticao,taxa,tipoNegociacao`,
    cpOtions: (account: string, authorizationGroup: string) =>
      `https://${account}.vtexcommercestable.com.br/api/dataentities/CP/search?_where=ativo=true AND authorizationGroup="${encodeURIComponent(
        authorizationGroup
      )}"&_fields=ativo,authorizationGroup,classificacaoUniWEB,descricao,minInstallmentValue,minOrderValue,repeticao,taxa,tipoNegociacao`,
  }

  private headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Vtex-Use-Https': 'true',
    'X-VTEX-API-AppKey': API_KEY,
    'X-VTEX-API-AppToken': API_TOKEN,
    'REST-Range': 'resources=0-100',
  }

  private headersManualPrice = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Vtex-Use-Https': 'true',
    VtexIdclientAutCookie:
      'eyJhbGciOiJFUzI1NiIsImtpZCI6IjdCQkJFMDdDRTcwOTE2OTI0RjY3OUMzQzgwOENBMkU2OUI0NUEzM0MiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJyYWZhZWwub2xpdmVpcmFAbWFlenRyYS5jb20iLCJhY2NvdW50IjoidW5pdmVyc2FsYXV0b21vdGl2ZSIsImF1ZGllbmNlIjoiYWRtaW4iLCJzZXNzIjoiNzY5NmVhN2EtNzljOS00YzcwLTgwNWItNjgxN2M4MDBlNjI5IiwiZXhwIjoxNzE3Njk3ODA3LCJ0eXBlIjoidXNlciIsInVzZXJJZCI6IjU0NWQzMjI1LTUwZmUtNDVhNC05MGE0LTdlZTJlZjE5MmQ5YiIsImlhdCI6MTcxNzYxMTQwNywiaXNzIjoidG9rZW4tZW1pdHRlciIsImp0aSI6IjdlMTQzYzVmLWRjZjItNGMxYi04MDc1LTYxNjgyMzgyMTE4OSJ9.N8eCQKGQN0y8JYOVUfi422G7PSjIGBfqCB8au49HpzF3bJ-z5vd4jlAhlD-iTNVUM2NYBtUBtSItWBVPBqIlSg',
    // 'X-VTEX-API-AppKey': API_KEY_MANUAL_PRICE,
    // 'X-VTEX-API-AppToken': API_TOKEN_MANUAL_PRICE,
  }

  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      retries: 3,
    })
  }

  public async getUserGroup(email: string, account: string): Promise<string> {
    return this.http.get(this.routes.userGroup(account, email), {
      metric: 'get-user-group',
      headers: this.headers,
    })
  }

  public async getCcOptions(
    authorizationGroup: string,
    account: string
  ): Promise<string> {
    return this.http.get(this.routes.ccOptions(account, authorizationGroup), {
      metric: 'get-cc-options',
      headers: this.headers,
    })
  }

  public async getCpOptions(
    authorizationGroup: string,
    account: string
  ): Promise<string> {
    return this.http.get(this.routes.cpOtions(account, authorizationGroup), {
      metric: 'get-cp-options',
      headers: this.headers,
    })
  }

  private async getCartItems(orderFormId: string) {
    const resp = await this.http.get(
      `https://universalautomotive.vtexcommercestable.com.br/api/checkout/pub/orderForm/${orderFormId}`
    )

    return resp.items
  }

  private async changeItemPrice(
    orderFormId: string,
    itemIndex: number,
    newPrice: number
  ) {
    return this.http.put(
      `https://universalautomotive.vtexcommercestable.com.br/api/checkout/pub/orderForm/${orderFormId}/items/${itemIndex}/price`,
      {
        price: newPrice,
      },
      {
        headers: this.headersManualPrice,
      }
    )
  }

  public async removeManualPrice(orderFormId: string, itemIndex: number) {
    return this.http.delete(
      `https://universalautomotive.vtexcommercestable.com.br/api/checkout/pub/orderForm/${orderFormId}/items/${itemIndex}/price`,
      {
        headers: this.headersManualPrice,
      }
    )
  }

  public async addInterests(
    orderFormId: string,
    interest: number
  ): Promise<any> {
    const items = await this.getCartItems(orderFormId)

    items.forEach(async (item: any, index: number) => {
      const listPrice = Number(item.listPrice) / 100
      const interestAmount = listPrice * (interest / 100)
      const newPrice = Math.round((listPrice + interestAmount) * 100)

      await this.changeItemPrice(orderFormId, index, newPrice)
    })
  }

  public async removeInterests(orderFormId: string): Promise<any> {
    const items = await this.getCartItems(orderFormId)

    items.forEach(async (index: number) => {
      await this.removeManualPrice(orderFormId, index)
    })
  }
}
