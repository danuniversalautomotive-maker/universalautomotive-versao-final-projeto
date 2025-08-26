import React from "react";
import { useRuntime } from 'vtex.render-runtime'
import { useRenderSession } from 'vtex.session-client'
import { OrderGroupContext } from 'vtex.order-placed'

const ClearLastCart = () => {
  const { page } = useRuntime();
  const { loading: loadingSession, session } = useRenderSession() as any

  const orderGroup = OrderGroupContext.useOrderGroup();
  const orderPlacedProfile = orderGroup?.orders?.[0]?.clientProfileData


  const deleteClientLastCart = async (email:string) => {
    await fetch('/_v/client-last-cart', {
      method: 'DELETE',
      body:JSON.stringify({email: email})
    })
  }

  React.useEffect(() => {
    if (loadingSession || !session || !session?.namespaces?.profile?.email?.value) {
      return
    }

    const sessionEmail = session?.namespaces?.profile?.email?.value
    if (page === 'store.orderplaced' && orderPlacedProfile?.email === sessionEmail) {
      deleteClientLastCart(sessionEmail)
      return
    }

  }, [loadingSession, session?.namespaces?.profile?.email?.value, page, orderPlacedProfile?.email])

  return <></>
}

export default ClearLastCart
