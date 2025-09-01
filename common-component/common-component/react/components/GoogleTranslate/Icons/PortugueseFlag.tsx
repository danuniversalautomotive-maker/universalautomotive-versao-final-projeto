import React from 'react'
import { useRuntime } from 'vtex.render-runtime'

export function PortugueseFlag() {
  const { deviceInfo } = useRuntime()
  return (
    <>
      {deviceInfo.isMobile ? (
        <img
          src="https://universalautomotive.vteximg.com.br/arquivos/pt-BR.png"
          width={30}
          height={30}
        />
      ) : (
        <img
          src="https://universalautomotive.vteximg.com.br/arquivos/pt-BR.png"
          width={25}
          height={25}
        />
      )}
    </>
  )
}
