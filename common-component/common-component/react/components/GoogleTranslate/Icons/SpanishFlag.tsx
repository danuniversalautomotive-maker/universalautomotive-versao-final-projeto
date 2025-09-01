import React from 'react'
import { useRuntime } from 'vtex.render-runtime'

export function SpanishFlag() {
  const { deviceInfo } = useRuntime()

  return (
    <>
      {deviceInfo.isMobile ? (
        <img
          src="https://universalautomotive.vteximg.com.br/arquivos/es.png"
          width={30}
          height={30}
        />
      ) : (
        <img
          src="https://universalautomotive.vteximg.com.br/arquivos/es.png"
          width={25}
          height={25}
        />
      )}
    </>
  )
}
