import React, { useState } from "react";
import { EXPERIMENTAL_Modal as Modal, Spinner } from 'vtex.styleguide'
import { usePixel } from 'vtex.pixel-manager'
import useMarketingSessionParams from "../../hooks/useMarketingSessionParams"
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { useCssHandles } from 'vtex.css-handles'
type IProps = {
  title?: string
  text?: string
  isOpen: boolean
  setIsOpen: Function
  lastCartItems: []
  email?: string
}

const mapSkuItemForPixelEvent = (skuItem: CartItem) => {
  const category = skuItem.category ? skuItem.category.slice(1, -1) : ''
  return {
    skuId: skuItem.id,
    ean: skuItem.ean,
    variant: skuItem.variant,
    price: skuItem.price,
    sellingPrice: skuItem.sellingPrice,
    priceIsInt: true,
    name: skuItem.name,
    quantity: skuItem.quantity,
    productId: skuItem.productId,
    productRefId: skuItem.productRefId,
    brand: skuItem.brand,
    category,
    detailUrl: skuItem.detailUrl,
    imageUrl: skuItem.imageUrl,
    referenceId: skuItem?.referenceId?.[0]?.Value,
    seller: skuItem.seller,
    sellerName: skuItem.sellerName,
  }
}

export const ModalInfinityCart = ({ email, title, text, isOpen, setIsOpen, lastCartItems }: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { addItems } = useOrderItems()
  const { utmParams, utmiParams } = useMarketingSessionParams()
  const { push } = usePixel()
  const { handles, withModifiers } = useCssHandles(['modal', 'modal__content', 'modal__title', 'modal__text', 'modal__options', 'modal__button'])

  const options = {
    allowedOutdatedData: ['paymentData'],
  }

  const getClientLastCart = async () => {
    setLoading(true)
    try {
      const formatedSkus = lastCartItems?.map((item: { id: string, qty: string, seller: string, sc: string }) => {
        return {
          id: item.id,
          quantity: Number(item.qty),
          seller: item.seller
        }
      })

      await addItems(formatedSkus, {
        marketingData: { ...utmParams, ...utmiParams },
        ...options,
      })

      const pixelEventItems = lastCartItems?.map(mapSkuItemForPixelEvent)
      push({
        event: 'addToCart',
        items: pixelEventItems,
      })
      window?.sessionStorage?.setItem('lastCartSelectedOption', `${email}`)
    } catch (e) {
      console.error('Error: ', e?.message)
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  }

  const handleClickCancel = () => {
    window?.sessionStorage?.setItem('lastCartSelectedOption', `${email}`)
    setIsOpen(false)
  }

  return <>
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className={handles.modal__content}>
        <h2 className={handles.modal__title}>{title ?? 'Parece que você já tem um carrinho montado.'}</h2>
        <p className={handles.modal__text}>{text ?? 'Gostaria de retomar a compra?'}</p>
        <div className={handles.modal__options}>
          <button className={withModifiers('modal__button', 'cancel')} onClick={handleClickCancel}>Cancelar</button>
          <button className={withModifiers('modal__button', 'continue')} onClick={() => getClientLastCart()} disabled={loading}>{loading ? <Spinner color={'#3c4043'} /> : 'Continuar'}</button>
        </div>
      </div>
    </Modal>
  </>
}
