import React from 'react'
import { useRuntime } from 'vtex.render-runtime'

export function EnglishFlag() {
  const { deviceInfo } = useRuntime()

  return (
    <>
      {deviceInfo.isMobile ? (
        <img
          src="https://universalautomotive.vteximg.com.br/arquivos/en.png"
          width={40}
          height={40}
        />
      ) : (
        <img
          src="https://universalautomotive.vteximg.com.br/arquivos/en.png"
          width={25}
          height={25}
        />
      )}
    </>
  )
}
