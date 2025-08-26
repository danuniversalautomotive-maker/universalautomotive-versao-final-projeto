interface CartItem {
  detailUrl: string
  id: string
  ean: string
  imageUrl: string
  index?: number
  listPrice: number
  measurementUnit: string
  name: string
  price: number
  productId: string
  quantity: number
  seller: string
  sellerName: string
  sellingPrice: number
  productRefId: string
  brand: string
  variant: string
  category: string
  skuName: string
  skuSpecifications: any[]
  uniqueId: string
  sellingPriceWithAssemblies: number
  options: any[]
  assemblyOptions: any
  referenceId: Array<{
    Key: string
    Value: string
  }> | null
}
