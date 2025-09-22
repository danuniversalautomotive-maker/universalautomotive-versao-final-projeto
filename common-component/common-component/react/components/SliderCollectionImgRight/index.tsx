import React, { useEffect, useState, useRef } from 'react'
import styles from './style.css'

interface Props {
  collectionId: string
  title?: string
  titleIcon?: string
  leftImage?: string
  itemsPerViewDesktop?: number
  collectionQuery?: string
}

const SCROLL_STEP = 1

const normalizeCents = (value: number): number => {
  return Math.round((value ?? 0) * 100)
}

const fromCents = (cents: number): number => cents / 100

const formatBRL = (cents: number): string =>
  fromCents(cents).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

const SliderCollectionImgRight: StorefrontFunctionComponent<Props> = ({
  collectionId,
  title = 'Lançamentos',
  titleIcon = 'https://universalautomotive.vteximg.com.br/arquivos/icone-lancamentos-home-collection.png',
  leftImage = 'https://universalautomotive.vteximg.com.br/arquivos/image-left-container-slider.png',
  itemsPerViewDesktop = 3,
  collectionQuery = 'H:156',
}) => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [itemsPerView, setItemsPerView] = useState(itemsPerViewDesktop)
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const isMobile = (breakpoint: number = 768) => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < breakpoint
  }

  useEffect(() => {
    const updateItemsPerView = () => {
      setItemsPerView(isMobile() ? 1 : itemsPerViewDesktop)
    }
    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [itemsPerViewDesktop])

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/sessions?items=*')
        const data = await res.json()
        const email = data?.namespaces?.profile?.email?.value
        setIsLoggedIn(!!email)
      } catch {
        setIsLoggedIn(false)
      }
    }
    checkSession()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/catalog_system/pub/products/search?fq=${collectionQuery}`)
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [collectionQuery, collectionId])

  const handleNext = () => {
    if (!sliderRef.current) return
    const scrollAmount = (sliderRef.current.offsetWidth / itemsPerView) * SCROLL_STEP
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    if (isMobile()) {
      setCurrentIndex((prev) => (prev + 1 >= products.length ? prev : prev + 1))
    }
  }

  const handlePrev = () => {
    if (!sliderRef.current) return
    const scrollAmount = (sliderRef.current.offsetWidth / itemsPerView) * SCROLL_STEP
    sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    if (isMobile()) {
      setCurrentIndex((prev) => (prev - 1 < 0 ? 0 : prev - 1))
    }
  }

  if (loading) return <div>Carregando…</div>

  return (
    <>
      <div className={styles.containerTitle}>
        {titleIcon && <img className={styles.imgCollectionTitle} src={titleIcon} alt={title} />}
        <h2>{title}</h2>
      </div>

      <div className={styles.containerCollectionBannerRight}>
        <div className={styles.sliderWrapper}>
          <button className={styles.arrowLeft} onClick={handlePrev}>‹</button>

          <div className={styles.sliderViewport} ref={sliderRef}>
            <div className={styles.sliderTrack}>
              {products.length > 0 ? (
                products.map((product: any) => {
                  const firstItem = product.items?.[0]
                  const seller =
                    firstItem?.sellers?.find((s: any) => s.sellerDefault) ||
                    firstItem?.sellers?.[0]
                  const offer = seller?.commertialOffer

                  const priceCents = normalizeCents(offer?.Price ?? 0)
                  const listPriceCents = normalizeCents(offer?.ListPrice ?? 0)

                  const hasDiscount = listPriceCents > priceCents
                  const discountPercent = hasDiscount
                    ? Math.floor(((listPriceCents - priceCents) / listPriceCents) * 100)
                    : 0

                  return (
                    <div
                      key={product.productId}
                      className={`${styles.productCard} ${
                        isLoggedIn ? styles.productCardLoggedIn : styles.productCardNotLoggedIn
                      }`}
                    >
                      {hasDiscount && isLoggedIn && (
                        <div className={styles.containerDiscountTag}>
                          <span className={styles.discountTag}>-{discountPercent}% OFF</span>
                        </div>
                      )}

                      <a href={`/${product.linkText}/p`}>
                        <div className={isLoggedIn ? styles.containerLoggedIn : styles.containerCtaLogin}>
                          <img
                            src={firstItem?.images?.[0]?.imageUrl}
                            alt={product.productName}
                            className={isLoggedIn ? styles.imgProductCard : styles.imgProductCardNotLogged}
                          />
                        </div>
                      </a>

                      <div className={styles.containerRef}>
                        <span className={styles.codRef}>
                          Ref.: {firstItem?.referenceId?.[0]?.Value}
                        </span>
                      </div>

                      <a href={`/${product.linkText}/p`}>
                        <h3>{product.productName}</h3>
                      </a>

                      {!isLoggedIn ? (
                        <div className={styles.containerCtaLogin}>
                          <a href="https://www.universalautomotive.com.br/organization-request">
                            <button className={styles.ctaLogin}>
                              <strong>Cadastre-se</strong> <br />
                              e veja o preço
                            </button>
                          </a>
                        </div>
                      ) : (
                        <>
                          {hasDiscount && (
                            <span className={styles.discountValue}>
                              <del>{formatBRL(listPriceCents)}</del>
                            </span>
                          )}
                          <span className={styles.price}>{formatBRL(priceCents)}</span>
                          {hasDiscount && (
                            <span className={styles.saveValue}>
                              Você economiza {formatBRL(listPriceCents - priceCents)}
                            </span>
                          )}
                          <a className={styles.btnVerProduto} href={`/${product.linkText}/p`}>
                            <span> Ver produto </span>
                          </a>
                        </>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className={styles.emptySliderMessage}>Nenhum produto encontrado.</div>
              )}
            </div>
          </div>

          <button className={styles.arrowRight} onClick={handleNext}>›</button>

          {isMobile() && (
            <div className={styles.dotsContainer}>
              {products.map((_, i) => (
                <span
                  key={i}
                  className={`${styles.dot} ${currentIndex === i ? styles.activeDot : ''}`}
                ></span>
              ))}
            </div>
          )}
        </div>

        <div className={isLoggedIn ? styles.containerLoggedIn : styles.containerCtaLogin}>
          {leftImage && (
            <img
              src={leftImage}
              className={isLoggedIn ? styles.imgLeft : styles.imgLeftNotLogged}
              alt=""
            />
          )}
        </div>
      </div>
    </>
  )
}

// --- VTEX Site Editor Config ---
SliderCollectionImgRight.schema = {
  title: 'Slider de Coleção com Imagem à Direita',
  description: 'Exibe uma coleção de produtos com controle de layout',
  type: 'object',
  properties: {
    collectionId: {
      type: 'string',
      title: 'ID da coleção (legacy)',
      default: '156',
    },
    collectionQuery: {
      type: 'string',
      title: 'Filtro da coleção (fq)',
      default: 'H:156',
    },
    title: {
      type: 'string',
      title: 'Título da coleção',
      default: 'Lançamentos',
    },
    titleIcon: {
      type: 'string',
      title: 'Ícone da coleção',
      widget: {
        'ui:widget': 'image-uploader',
      },
      default: 'https://universalautomotive.vteximg.com.br/arquivos/icone-lancamentos-home-collection.png',
    },
    leftImage: {
      type: 'string',
      title: 'Imagem à esquerda (logado ou não)',
      widget: {
        'ui:widget': 'image-uploader',
      },
      default: 'https://universalautomotive.vteximg.com.br/arquivos/image-left-container-slider.png',
    },
    itemsPerViewDesktop: {
      type: 'number',
      title: 'Itens por vez (desktop)',
      default: 3,
    },
  },
}

export default SliderCollectionImgRight
