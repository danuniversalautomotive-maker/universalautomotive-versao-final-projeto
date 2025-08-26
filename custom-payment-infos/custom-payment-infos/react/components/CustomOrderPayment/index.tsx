/* eslint-disable no-console */
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useOrder } from 'vtex.order-placed/OrderContext'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import GET_ORDER_GROUP from '../../graphql/getOrderGroup.graphql'
import PaymentMethod from '../PaymentMethod'

const CSS_HANDLES = ['orderPaymentWrapper', 'orderPaymentItem']

const CustomOrderPayment = () => {
  const order = useOrder()
  const runtime = useRuntime()
  const handles = useCssHandles(CSS_HANDLES)

  const { data } = useQuery(GET_ORDER_GROUP, {
    variables: {
      orderGroup: runtime.query?.og,
    },
  })

  const [{ payments, transactionId }] = order.paymentData.transactions

  if (!data?.orderGroup?.orders) {
    return <></>
  }

  const currentOrder = data.orderGroup.orders.find(
    ({ orderId }: { orderId: string }) => orderId === order.orderId
  )

  const currentCustomPaymentData = currentOrder?.customData?.customApps?.find(
    ({ id }: { id: string }) => id === 'mz-custom-options'
  )?.fields

  return (
    <div
      className={`${handles.orderPaymentWrapper} flex flex-column flex-row-m`}
    >
      {payments.map((payment: any, idx: number) => {
        return (
          <div key={idx} className={`${handles.orderPaymentItem} pb8-s mr9-m`}>
            <PaymentMethod
              payment={payment}
              transactionId={transactionId}
              currency="BRL"
              customPaymentData={currentCustomPaymentData ?? null}
            />
          </div>
        )
      })}
    </div>
  )
}

export default CustomOrderPayment
