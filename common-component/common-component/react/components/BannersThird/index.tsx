import React, { useState, useEffect, useRef } from 'react'
import styles from './style.css'

interface Props {
  image1?: string
  link1?: string
  image2?: string
  link2?: string
  image3?: string
  link3?: string
}

const BannersThird: StorefrontFunctionComponent<Props> = ({
  image1,
  link1 = '#',
  image2,
  link2 = '#',
  image3,
  link3 = '#'
}) => {
  const banners = [
    { img: image1, link: link1, alt: 'Banner 1' },
    { img: image2, link: link2, alt: 'Banner 2' },
    { img: image3, link: link3, alt: 'Banner 3' },
  ].filter(b => b.img)

  const [isMobile, setIsMobile] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: index * sliderRef.current.offsetWidth,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className={styles.containerBannersThird}>
      {isMobile ? (
        <>
          <div className={styles.sliderViewport} ref={sliderRef}>
            <div className={styles.sliderTrack}>
              {banners.map((b, i) => (
                <div key={i} className={styles.slide}>
                  <a href={b.link}>
                    <img src={b.img} alt={b.alt} />
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.dotsContainer}>
            {banners.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${currentIndex === i ? styles.activeDot : ''}`}
                onClick={() => handleDotClick(i)}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div>
            {image1 && (
              <a href={link1}>
                <img src={image1} className={styles.img1} alt="Banner 1 Home" />
              </a>
            )}
          </div>
          <div className={styles.columnBanners}>
            {image2 && (
              <a href={link2}>
                <img src={image2} alt="Banner 2 Home" />
              </a>
            )}
            {image3 && (
              <a href={link3}>
                <img src={image3} alt="Banner 3 Home" />
              </a>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default BannersThird

BannersThird.schema = {
  title: 'Banners',
  description: 'Bloco para três banners configuráveis com links',
  type: 'object',
  properties: {
    image1: {
      title: 'Imagem Banner 1',
      type: 'string',
      widget: { 'ui:widget': 'image-uploader' }
    },
    link1: {
      title: 'Link Banner 1',
      type: 'string',
      default: '#'
    },
    image2: {
      title: 'Imagem Banner 2',
      type: 'string',
      widget: { 'ui:widget': 'image-uploader' }
    },
    link2: {
      title: 'Link Banner 2',
      type: 'string',
      default: '#'
    },
    image3: {
      title: 'Imagem Banner 3',
      type: 'string',
      widget: { 'ui:widget': 'image-uploader' }
    },
    link3: {
      title: 'Link Banner 3',
      type: 'string',
      default: '#'
    }
  }
}
