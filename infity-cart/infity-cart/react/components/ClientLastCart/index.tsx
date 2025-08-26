import React from "react";
import { useRuntime } from 'vtex.render-runtime'
import { useRenderSession } from 'vtex.session-client'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { ModalInfinityCart } from "./Modal";

type IProps = {
  modalTitle?: string
  modalText?: string
}

export const ClientLastCart = ({modalTitle, modalText}: IProps) => {
  const { page } = useRuntime();
  const { loading: loadingSession, session } = useRenderSession() as any
  const { loading: loadingOrderForm, orderForm } = useOrderForm()

  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [clientLastCart, setCliendLastCart] = React.useState<[]>([]);

  const getClientLastCart = async (email:string) => {
    try {
      const response = await fetch(`/_v/client-last-cart?email=${email}`).then((res) => res.json())
      const lastCart = response?.[0]?.lastCart ? JSON.parse(response?.[0]?.lastCart) : [];
      if (!lastCart || lastCart.length === 0) {
        return
      }
      setCliendLastCart(lastCart)
      setIsOpen(true)
    } catch (e) {
      console.error('Error: ', e?.message)
    }
  }

  React.useEffect(() => {
    if (loadingSession || loadingOrderForm || !session || !session?.namespaces?.profile?.email?.value) {
      return
    }

    if (page === 'store.orderplaced' ) {
      return
    }

    const optionSelected = window?.sessionStorage?.getItem('lastCartSelectedOption')
    const sessionEmail = session?.namespaces?.profile?.email?.value;
    if (orderForm.items.length > 0 || (optionSelected && optionSelected === sessionEmail)) {
      return
    }

    getClientLastCart(sessionEmail)
  }, [loadingSession, loadingOrderForm, session?.namespaces?.profile?.email?.value, page])

  return <>
    <ModalInfinityCart email={session?.namespaces?.profile?.email?.value} title={modalTitle} text={modalText} isOpen={isOpen} setIsOpen={setIsOpen} lastCartItems={clientLastCart} />
  </>
}

ClientLastCart.schema = {
  title: "Configurações Modal de Retomar Carrinho",
  type: "object",
  properties:{
    modalTitle: {
      type: 'string',
      title: 'Título modal'
    },
    modalText: {
      type: 'string',
      title: 'Texto modal'
    }
  }
}
