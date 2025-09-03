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
}

const SliderNossasMarcas: StorefrontFunctionComponent<Props> = ({ logos = [] }) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { deviceInfo } = useRuntime()

  const visibleItems = useMemo(() => (deviceInfo.isMobile ? 2 : 5), [deviceInfo])
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
    <h3 className={Styles.tituloNossasMarcas}><img src="https://universalautomotive.vteximg.com.br/arquivos/icon-nossas-marcas.png" className={Styles.iconNossasMarcas} /> Nossas Marcas</h3>
    <div className={Styles.sliderWrapperNossasMarcas}>
      <div ref={sliderRef} className={Styles.sliderContainerNossasMarcas}>
        {logos.map((logo, index) => (
          <div key={index} className={Styles.sliderItemNossasMarcas}>
            <a href={logo.link} target="_self" rel="noopener noreferrer">
              <img src={logo.image} alt={logo.alt || `Marca ${index + 1}`} />
            </a>
          </div>
        ))}
      </div>

      <div className={Styles.sliderDots}>
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`${Styles.dot} ${idx === currentIndex ? Styles.active : ""}`}
          />
        ))}
      </div>
    </div>
    </>
    
  )
}

SliderNossasMarcas.schema = {
  title: "Slider Nossas Marcas",
  description: "Slider com logos e links personalizados via Site Editor",
  type: "object",
  properties: {
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

export default SliderNossasMarcas
