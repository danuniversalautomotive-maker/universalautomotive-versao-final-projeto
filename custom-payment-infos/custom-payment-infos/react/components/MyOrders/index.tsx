/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'

import GET_ORDER_GROUP from '../../graphql/getOrderGroup.graphql'

type MyOrdersProps = {
  orderIdentificator: string
  targetElement: HTMLDivElement | null
}

const MyOrders = ({ orderIdentificator, targetElement }: MyOrdersProps) => {
  const [orderData, setOrderData] = useState(null) as any
  const { data } = useQuery(GET_ORDER_GROUP, {
    variables: {
      orderGroup: orderIdentificator,
    },
  })

  useEffect(() => {
    if (targetElement) {
      // Verificar se o targetElement contém o sectionElement e removê-lo se necessário
      const sectionElement = targetElement.querySelector('section')

      if (sectionElement) {
        sectionElement.remove()
      }
    }
  }, [targetElement])

  const getPaymentSystemName = (systemName: string) => {
    switch (systemName) {
      case 'Promissory':
        return 'Antecipado'

      case 'Customer Credit':
        return 'Parcelado'

      default:
        return systemName
    }
  }

  useEffect(() => {
    if (data) {
      setOrderData(data)
    }
  }, [data])

  const currentOrder = orderData?.orderGroup?.orders.find(
    ({ orderId }: { orderId: string }) => orderId === `${orderIdentificator}-01`
  )

  const currentCustomPaymentData = currentOrder?.customData?.customApps?.find(
    ({ id }: { id: string }) => id === 'mz-custom-options'
  )?.fields

  if (!currentOrder) {
    return null
  }

  const [{ payments }] = currentOrder?.paymentData.transactions

  return (
    <div>
      <div>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {payments.map((payment: any, index: number) => {
          if (
            !(
              payment.paymentSystemName === 'Promissory' ||
              payment.paymentSystemName === 'Customer Credit'
            )
          ) {
            return (
              <>
                {targetElement && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: targetElement.innerHTML,
                    }}
                  />
                )}
              </>
            )
          }

          return (
            <span className="f6 lh-copy" key={index}>
              <span>{getPaymentSystemName(payment.paymentSystemName)} </span>
              {Intl.NumberFormat('pt-br', {
                style: 'currency',
                currency: 'BRL',
              }).format(parseInt(currentOrder.value, 10) / 100)}{' '}
              {currentCustomPaymentData.descricao !== '-' &&
              currentCustomPaymentData.descricao !== 'ANTECIPADO'
                ? currentCustomPaymentData.descricao
                : ''}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders
