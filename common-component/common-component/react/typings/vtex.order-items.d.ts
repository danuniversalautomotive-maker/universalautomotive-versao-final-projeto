declare module 'vtex.order-items/OrderItems' {
  interface ItemToAdd {
    id: string
    quantity: number
    seller: string
  }

  interface UseOrderItems {
    addItem: (items: ItemToAdd[]) => Promise<void>
  }

  export function useOrderItems(): UseOrderItems
}
