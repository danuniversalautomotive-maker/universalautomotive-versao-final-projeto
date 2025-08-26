import React from 'react'
import { useProduct } from 'vtex.product-context'
import { useQuery } from 'react-apollo'

import getProduct from './productSearch.gql'
import styles from './styles.css'

export default function Flag() {
  const currentProduct = useProduct()
  const productId = currentProduct?.product?.productId

  const { loading, data } = useQuery(getProduct, { variables: { productId }, ssr: false })

  if (loading || !data) return null

  const flag = data?.product?.productClusters?.find(
    (item: any) => item.id === '137' || item.id === '142'
  )

  return (
    <>
      {flag?.name ? (
        <p className={styles['flag-wrapper']}>{flag?.name}</p>
      ) : null}
    </>
  )
}
