import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './style.css'
import { GoogleTranslate } from '../GoogleTranslate'
import { useRuntime } from 'vtex.render-runtime'

interface SliderItem {
  message: string
  image: string
}

interface TopBarProps {
  sliderItems?: SliderItem[]
}

export const TopBar = ({ sliderItems = [] }: TopBarProps) => {
  const { deviceInfo } = useRuntime()
  const [current, setCurrent] = useState(0)

  // Passa o slide automaticamente se houver mais de 1 item
  useEffect(() => {
    if (sliderItems.length <= 1) return

    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % sliderItems.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [sliderItems.length])

  return (
    <>
      {deviceInfo.isMobile ? (
        <div className={styles.containerTopBar}>
          <div className={styles.contentTopBar}>
            {/* Google Translate */}
            <div className={styles.flagsTopBar}>
              <GoogleTranslate />
            </div>

            {/* Só renderiza o slider se houver itens */}
            {sliderItems.length > 0 && (
              <div className={styles.carouselWrapperTopBar}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className={styles.carouselItemTopBar}
                  >
                    {sliderItems[current]?.image && (
                      <img
                        src={sliderItems[current].image}
                        alt={sliderItems[current].message}
                        className={styles.sliderImageTopBar}
                      />
                    )}
                    <span>{sliderItems[current]?.message}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.containerTopBar}>
          <div className={styles.contentTopBar}>
            {/* Links rápidos */}
            <div className={styles.linksRapidosTopBar}>
              <span className={styles.portalTopBar}>
                <a href="https://www.universalautomotive.com.br/portal-do-cliente">
                  <img
                    src="https://universalautomotive.vteximg.com.br/arquivos/icon-portal-topbar.png"
                    width={15}
                    height={15}
                    alt="Portal do Cliente"
                  />
                  Portal
                </a>
              </span>
              <span>|</span>
              <span>
                <a href="https://www.universalautomotive.com.br/organization-request">
                  Cadastre-se
                </a>
              </span>
              <span>|</span>
              <span>
                <a href="https://www.universalautomotive.com.br/quickorder">
                  Pedido Rápido
                </a>
              </span>
            </div>

            {/* Só renderiza o slider se houver itens */}
            {sliderItems.length > 0 && (
              <div className={styles.carouselWrapperTopBar}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className={styles.carouselItemTopBar}
                  >
                    {sliderItems[current]?.image && (
                      <img
                        src={sliderItems[current].image}
                        alt={sliderItems[current].message}
                        className={styles.sliderImageTopBar}
                      />
                    )}
                    <span>{sliderItems[current]?.message}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* Google Translate */}
            <div className={styles.flagsTopBar}>
              <GoogleTranslate />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

TopBar.schema = {
  title: 'TopBar',
  description: 'Componente de barra superior com slider dinâmico vindo do Site Editor',
  type: 'object',
  properties: {
    sliderItems: {
      title: 'Itens do Slider',
      type: 'array',
      minItems: 0,
      items: {
        type: 'object',
        title: 'Item do Slider',
        properties: {
          message: {
            title: 'Mensagem do slider',
            type: 'string'
          },
          image: {
            title: 'Imagem do slider',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader'
            }
          }
        }
      }
    }
  }
}
