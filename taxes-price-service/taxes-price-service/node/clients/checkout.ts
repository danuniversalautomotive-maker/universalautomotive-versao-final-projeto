import { InstanceOptions, IOContext, JanusClient } from "@vtex/api";

export default class CheckoutClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdClientAutCookie: context.authToken,
      },
      retries: 10,
    })
  }

  public async getOrderForm(orderFormId: string) {
    return await this.http.get(`/api/checkout/pub/orderForm/${orderFormId}`)
  }

  public async setManualPriceForItems(orderFormId: string, index: number, price: number) {
    return this.http.put(`/api/checkout/pub/orderForm/${orderFormId}/items/${index}/price`, {
      price: price
    },
      {
        headers: {
          'X-VTEX-API-AppToken': process!.env!.APPTOKEN!,
          'X-VTEX-API-AppKey': process!.env!.APPKEY!,
        }
      }
    )
  }

  public async clearCart(orderFormId: string) {
    return this.http.post(`/api/checkout/pub/orderForm/${orderFormId}/items/removeAll`)
  }

  public async addItems(orderFormId: string, orderItems: OrderItems[]) {
    return this.http.post(`/api/checkout/pub/orderForm/${orderFormId}/items`, {
      orderItems: orderItems
    })
  }

  public async keepShippingSelected(orderFormId: string, address: Address, logisticsInfo: any) {
    return this.http.post(`/api/checkout/pub/orderForm/${orderFormId}/attachments/shippingData`, {
      "clearAddressIfPostalCodeNotFound": false,
      "selectedAddresses": [
        {
          ...address
        }
      ],
      logisticsInfo
    })
  }

  public async getProducts(skuIds: string[]) {
    const query = skuIds.join('&fq=skuId:')
    return this.http.get(`/api/catalog_system/pub/products/search?fq=skuId:${query}`)
  }
}
