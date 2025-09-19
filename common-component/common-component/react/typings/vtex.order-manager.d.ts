// vtex.order-manager.d.ts
declare module 'vtex.order-manager/OrderItems' {
  export interface AddItemInput {
    /** SKU ID do item */
    id: string
    /** Quantidade a adicionar */
    quantity: number
    /** Seller ID */
    seller: string
  }

  export interface UseOrderItems {
    /** Adiciona item(s) ao carrinho */
    addItem: (items: AddItemInput[]) => Promise<void>
    // Se você usar outros métodos (removeItem, updateItem) pode declarar aqui também
  }

  export function useOrderItems(): UseOrderItems
}

declare module 'vtex.order-manager/OrderManager' {
  import React from 'react'
  export const OrderManagerProvider: React.FC<{ children: React.ReactNode }>
}