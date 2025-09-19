declare module 'vtex.add-to-cart-button' {
  import { ComponentType } from 'react'

  export interface SkuItem {
    id: string
    quantity: number
    seller: string
  }

  export interface AddToCartButtonProps {
    skuItems: SkuItem[]
    text?: string
    onClickBehavior?: 'add-to-cart'
    addToCartFeedback?: 'toast' | 'customEvent'
    disabled?: boolean
  }

  export const AddToCartButton: ComponentType<AddToCartButtonProps>
}
