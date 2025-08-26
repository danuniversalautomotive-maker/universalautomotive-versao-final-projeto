/* eslint-disable react/no-deprecated */

import React, { useEffect, useState } from 'react'
import { ApolloProvider, useApolloClient } from 'react-apollo'
import ReactDOM from 'react-dom'

import MyOrders from './components/MyOrders'

const Helmet = () => {
  const client = useApolloClient()
  const [hash, setHash] = useState('')
  const [targetElement, setTargetElement] = useState<Element | null>(null)
  const regex = /#\/orders(?:-history)?\/(.*?)-01/

  const orderIdentificator = hash.match(regex)

  useEffect(() => {
    setHash(window.location.hash)

    const handleHashChange = () => {
      setHash(window.location.hash)
      if (
        !(
          window.location?.hash?.includes('#/orders/') ||
          window.location?.hash?.includes('#/orders-history/')
        )
      ) {
        setTargetElement(null)
      } else {
        let breaker = 0
        const interval = setInterval(() => {
          breaker++
          if (breaker > 20) {
            clearInterval(interval)
          }

          const tgt = document.querySelector('.dib.ma0.pa0.f6.lh-copy')

          if (tgt) {
            setTargetElement(tgt)
            clearInterval(interval)
          }
        }, 500)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  if (!targetElement) {
    return null
  }

  const clonedTargetElement = targetElement.cloneNode(true) as HTMLDivElement

  const container = document.createElement('div')

  targetElement.appendChild(container)

  targetElement.classList.add('flex', 'flex-column-reverse')

  const sectionElement = targetElement.querySelector('section')

  if (sectionElement) {
    // Remover o <section> do DOM e salvá-lo
    sectionElement.remove()
  }

  ReactDOM.render(
    <ApolloProvider client={client}>
      <MyOrders
        orderIdentificator={orderIdentificator?.[1] ?? ''}
        targetElement={clonedTargetElement}
      />
    </ApolloProvider>,
    targetElement
  )

  if (sectionElement && !container.contains(sectionElement)) {
    targetElement.appendChild(sectionElement)
  }

  return null
}

export default Helmet
