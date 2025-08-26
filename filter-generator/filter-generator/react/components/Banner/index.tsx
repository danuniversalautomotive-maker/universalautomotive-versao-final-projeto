/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
// import { ExtensionPoint } from 'vtex.render-runtime'

type BannerProps = {
  imageName: string
  BannerCallback?: React.ComponentType | any
}

export const CSS_HANDLES = [
  'filterbannerContainer',
  'filterbanner',
  'filterbannerCallback',
] as const

const Banner: StorefrontFunctionComponent<BannerProps> = ({
  imageName,
  BannerCallback,
}) => {
  const [isCustomBanner, setIsCustomBanner] = useState(false)

  const handles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    fetch(`https://benimports.vtexassets.com/arquivos/${imageName}`)
      .then(() => {
        setIsCustomBanner(true)
      })
      .catch(() => setIsCustomBanner(false))
  }, [imageName])

  return (
    <div className={handles.filterbannerContainer}>
      {isCustomBanner ? (
        <img
          className={handles.filterbanner}
          src={`https://benimports.vtexassets.com/arquivos/${imageName}`}
          alt={imageName}
        />
      ) : (
        <div className={handles.filterbannerCallback}>
          <BannerCallback />
        </div>
      )}
    </div>
  )
}

export default Banner
