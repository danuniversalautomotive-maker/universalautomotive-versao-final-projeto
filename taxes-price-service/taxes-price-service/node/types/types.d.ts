type OrderForm = {
  orderFormId: string
  shippingData: ShippingData
  items: OrderFormItems[]
}

type ShippingData = {
  address: Address
  logisticsInfo: LogisticsInfo[]
}

type Address = {
  postalCode: string
  city: string
  state: string
}

type LogisticsInfo = {
  selectedSla: string
  slas: Slas[]
}

type Slas = {
  id: string
  deliveryChannel: string
  price: number
}

type OrderFormItems = {
  id: string
  productId: string
  name: string
  price: number
  manualPrice: number | null
  manualPriceAppliedBy: string | null
  sellingPrice: number
  quantity: number
  seller: string
}

type UFTax = {
  active: boolean
  minValue: number
  tax: number
  state: string
}

type OrderItems = {
  quantity: number
  seller: string
  id: string
  index?: number
}
