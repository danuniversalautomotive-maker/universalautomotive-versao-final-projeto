import React, { useEffect, useRef, useState, useMemo } from "react"
import { useRuntime } from "vtex.render-runtime"
import Styles from "./style.css"

interface Logo {
  image: string
  link: string
  alt?: string
}

interface Props {
  logos: Logo[]
  title?: string
  icon?: string
}

const ComprePorCategoria: StorefrontFunctionComponent<Props> = ({
  logos = [],
  title = "Nossas Marcas",
  icon = "https://universalautomotive.vteximg.com.br/arquivos/icon-nossas-marcas.png"
}) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { deviceInfo } = useRuntime()

  const visibleItems = useMemo(() => (deviceInfo.isMobile ? 1 : 5), [deviceInfo])
  const totalSlides = Math.max(1, logos.length - visibleItems + 1)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, 3000)

    return () => clearInterval(interval)
  }, [totalSlides])

  useEffect(() => {
    const container = sliderRef.current
    if (container) {
      const scrollAmount = container.offsetWidth / visibleItems
      container.scrollTo({
        left: scrollAmount * currentIndex,
        behavior: "smooth",
      })
    }
  }, [currentIndex, visibleItems])

  return (
    <>
      <h2 className={Styles.tituloPorCategoria}>
        <img src={icon} className={Styles.iconPorCategoria} alt="Ícone" />
        {title}
      </h2>
      <div className={Styles.sliderWrapperPorCategoria}>
        <div ref={sliderRef} className={Styles.sliderContainerPorCategoria}>
          {logos.map((logo, index) => ( 
            <div key={index} className={Styles.sliderItemPorCategoria}>
              <a href={logo.link} target="_self" rel="noopener noreferrer">
                <img src={logo.image} alt={logo.alt || `Marca ${index + 1}`} />
              </a>
            </div>
          ))}
        </div>

        {/** Sempre mostra os dots se houver mais de 1 slide */}
        {totalSlides > 1 && (
          <div className={Styles.sliderDots}>
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`${Styles.dot} ${idx === currentIndex ? Styles.active : ""}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

ComprePorCategoria.schema = {
  title: "Slider Nossas Marcas",
  description: "Slider com logos e links personalizados via Site Editor",
  type: "object",
  properties: {
    title: {
      type: "string",
      title: "Título do slider",
      default: "Nossas Marcas"
    },
    icon: {
      type: "string",
      title: "Ícone",
      widget: {
        "ui:widget": "image-uploader"
      },
      default: "https://universalautomotive.vteximg.com.br/arquivos/icon-nossas-marcas.png"
    },
    logos: {
      type: "array",
      title: "Logos",
      items: {
        title: "Logo",
        type: "object",
        properties: {
          image: {
            type: "string",
            title: "URL da imagem",
            widget: {
              "ui:widget": "image-uploader"
            }
          },
          link: {
            type: "string",
            title: "URL de redirecionamento"
          },
          alt: {
            type: "string",
            title: "Texto alternativo"
          }
        }
      }
    }
  }
}

export default ComprePorCategoria
