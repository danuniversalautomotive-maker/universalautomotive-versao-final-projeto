import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Button } from 'vtex.styleguide'

const CSS_HANDLES = ['cleanCacheButtonWrapper', 'cleanCacheButton']

const CleanCartCache = () => {
  const handles = useCssHandles(CSS_HANDLES)

  const handleClick = async () => {
    await fetch('/api/checkout/pub/orderForm?forceNewCart=true')
    window.location.reload()
  }

  return (
    <div className={handles.cleanCacheButtonWrapper}>
      <Button variation="primary" onClick={handleClick}>
        Limpar Cache
      </Button>
    </div>
  )
}

export default CleanCartCache
