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

// --- Utils de preço em centavos ---
/**
 * Converte um valor decimal em centavos de forma estável:
 * 1) limita a 3 casas (para cortar "caudas" do JSON)
 * 2) converte para centavos e ARREDONDA PARA CIMA (ceil)
 */
const toCentsUp = (value: number): number =>
  Math.ceil(Number((value ?? 0).toFixed(3)) * 100)

/** Converte centavos para decimal */
const fromCents = (cents: number): number => cents / 100

/** Formata BRL a partir de centavos */
const formatBRL = (cents: number): string =>
  fromCents(cents).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const SliderCollectionImgLeft: React.FC<Props> = ({
  collectionId,
  title = 'Lançamentos',
  titleIcon = 'https://universalautomotive.vteximg.com.br/arquivos/icone-lancamentos-home-collection.png',
  leftImage = 'https://universalautomotive.vteximg.com.br/arquivos/image-left-container-slider.png',
  itemsPerViewDesktop = 3,
  collectionQuery = 'H:156'
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

      <div className={styles.containerCollectionBannerLeft}>
        {!isLoggedIn ? (
          <div className={styles.containerCtaLogin}>
            {leftImage && <img src={leftImage} className={styles.imgLeftNotLogged} alt="" />}
          </div>
        ) : (
          <div className={styles.containerLoggedIn}>
            {leftImage && <img src={leftImage} className={styles.imgLeft} alt="" />}
          </div>
        )}

        <div className={styles.sliderWrapper}>
          <button className={styles.arrowLeft} onClick={handlePrev}>‹</button>

          <div className={styles.sliderViewport} ref={sliderRef}>
            <div className={styles.sliderTrack}>
              {products.length > 0 ? (
                products.map((product: any) => {
                  const firstItem = product.items?.[0]

                  // usa o mesmo seller da PDP
                  const seller =
                    firstItem?.sellers?.find((s: any) => s.sellerDefault) ||
                    firstItem?.sellers?.[0]
                  const offer = seller?.commertialOffer

                  // centavos com ceil
                  const rawPrice = offer?.Price ?? 0
                  const rawListPrice = offer?.ListPrice ?? 0

                  let priceCents = toCentsUp(rawPrice)
                  const listPriceCents = toCentsUp(rawListPrice)

                  // se o arredondado normal for maior, usa ele (evita +1 desnecessário)
                  const roundedCents = Math.round(Number((rawPrice ?? 0).toFixed(3)) * 100)
                  if (priceCents < roundedCents) {
                    priceCents = roundedCents
                  }

                  const hasDiscount = listPriceCents > priceCents
                  const discountPercent = hasDiscount
                    ? Math.floor(((listPriceCents - priceCents) / listPriceCents) * 100)
                    : 0

                  return (
                    <div key={product.productId} className={styles.productCard}>
                      {hasDiscount && (
                        <div className={styles.containerDiscountTag}>
                          <span className={styles.discountTag}>-{discountPercent}% OFF</span>
                        </div>
                      )}

                      <a href={`/${product.linkText}/p`}>
                        <div className={isLoggedIn ? styles.containerLoggedIn : styles.containerCtaLogin}>
                          <img
                            src={firstItem?.images?.[0]?.imageUrl}
                            alt={product.productName}
                            style={{ maxWidth: '100%', height: 'auto' }}
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
      </div>
    </>
  )
}

export default SliderCollectionImgLeft

;(SliderCollectionImgLeft as any).schema = {
  title: 'Slider de coleção com imagem à esquerda',
  description: 'Componente de slider de produtos com imagem lateral e props editáveis',
  type: 'object',
  properties: {
    title: {
      title: 'Título da seção',
      type: 'string',
      default: 'Lançamentos'
    },
    titleIcon: {
      title: 'Ícone do título',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader'
      },
      default: 'https://universalautomotive.vteximg.com.br/arquivos/icone-lancamentos-home-collection.png'
    },
    leftImage: {
      title: 'Imagem lateral',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader'
      },
      default: 'https://www.universalautomotive.com.br/arquivos/image-left-container-slider.png'
    },
    itemsPerViewDesktop: {
      title: 'Itens por vez no Desktop',
      type: 'number',
      default: 3
    },
    collectionQuery: {
      title: 'Query da coleção (FQ)',
      type: 'string',
      default: 'H:156'
    }
  }
}
