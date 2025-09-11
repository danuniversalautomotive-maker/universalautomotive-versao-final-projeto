import React, { useEffect, useState } from 'react'
import styles from './style.css'

type SubSubCategory = {
  name: string
  link: string
  image?: string
}

type SubCategory = {
  name: string
  link: string
  children?: SubSubCategory[]
}

type Category = {
  name: string
  link: string
  image?: string
  children?: SubCategory[]
}

interface Props {
  categories: Category[]
}

function NovoMenuCustomizado({ categories }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null)
  const [activeSubIndex, setActiveSubIndex] = useState<number | null>(null)

  const [expandedCategoryIndex, setExpandedCategoryIndex] = useState<number | null>(null)
  const [expandedSubIndex, setExpandedSubIndex] = useState<number | null>(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleToggle = () => {
    if (isMobile) {
      setShowDropdown(true)
    } else {
      setShowDropdown(prev => !prev)
      setActiveCategoryIndex(null)
      setActiveSubIndex(null)
    }
  }

  const closeMobileMenu = () => {
    setShowDropdown(false)
    setExpandedCategoryIndex(null)
    setExpandedSubIndex(null)
  }

  const toggleCategoryMobile = (idx: number) => {
    setExpandedSubIndex(null)
    setExpandedCategoryIndex(prev => (prev === idx ? null : idx))
  }

  const toggleSubMobile = (idx: number) => {
    setExpandedSubIndex(prev => (prev === idx ? null : idx))
  }

  return (
    <div className="relative">
      <button
        className="bg-white c-on-base t-body ph4 pv3 pointer bn flex items-center gap-2"
        onClick={handleToggle}
      >
        <span className="f4">{showDropdown ? '✕' : '☰'}</span>
        {isMobile ? <span className="ml2" /> : <span className="ml2">MENU</span>}
      </button>

      {/* ▼▼▼ MODO MOBILE ▼▼▼ */}
      {isMobile && showDropdown && (
        <>
          <div className={styles.mobileOverlay} onClick={closeMobileMenu} />

          <div className={`${styles.mobileDrawer} ${showDropdown ? styles.open : ''}`}>
            <div className={styles.drawerHeader}>
              <button onClick={closeMobileMenu}>✕</button>
            </div>

            <ul className={`${styles.mobileList} ${styles.mobileAccordion}`}>
              {categories.map((cat, i) => {
                const isOpenCat = expandedCategoryIndex === i
                const hasSubcategories = (cat.children?.length ?? 0) > 0

                return (
                  <li key={i} className={styles.mobileAccordionItem}>
                    <button
                        className={styles.mobileAccordionHeader}
                        onClick={() => hasSubcategories && toggleCategoryMobile(i)}
                        aria-expanded={isOpenCat}
                    > 
                      <div className={styles.containerTextImageMobile}>
                        <img src="https://universalautomotive.vtexassets.com/arquivos/logo-versao-final.png" />
                        <span className={styles.mobileAccordionHeaderText}>{cat.name}</span>
                      </div>
                      {hasSubcategories && (
                        <span
                          className={`${styles.mobileAccordionChevron} ${isOpenCat ? styles.chevronOpen : ''}`}
                          aria-hidden
                        >
                          ▾
                        </span>
                      )}
                    </button>

                    {hasSubcategories && (
                      <div className={`${styles.mobileAccordionPanel} ${isOpenCat ? styles.panelOpen : ''}`}>
                        <ul className={styles.mobileSubList}>
                          {cat.children!.map((sub, j) => {
                            const isOpenSub = expandedSubIndex === j
                            const hasSubSubcategories = (sub.children?.length ?? 0) > 0

                            return (
                              <li key={j} className={styles.mobileAccordionSubItem}>
                                <button
                                  className={styles.mobileSubHeader}
                                  onClick={() => hasSubSubcategories && toggleSubMobile(j)}
                                  aria-expanded={isOpenSub}
                                >
                                  <span className={styles.mobileSubHeaderText}>{sub.name}</span>
                                  {hasSubSubcategories && (
                                    <span
                                      className={`${styles.mobileAccordionChevron} ${isOpenSub ? styles.chevronOpen : ''}`}
                                      aria-hidden
                                    >
                                      ▾
                                    </span>
                                  )}
                                </button>

                                {hasSubSubcategories && (
                                  <div className={`${styles.mobileAccordionPanel} ${isOpenSub ? styles.panelOpen : ''}`}>
                                    <ul className={styles.mobileSubSubList}>
                                      {sub.children!.map((item, k) => (
                                        <li key={k} className={styles.mobileSubSubItem}>
                                          {item.image && (
                                            <img
                                              src={item.image}
                                              className={styles.mobileImage}
                                              alt={item.name}
                                            />
                                          )}
                                          <a href={item.link} className={styles.mobileLinkItem}>
                                            {item.name}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}

      {/* ▼▼▼ MODO DESKTOP ▼▼▼ */}
      {!isMobile && showDropdown && (
        <div
          className={styles.containerNovoMenu}
          onMouseLeave={() => {
            setShowDropdown(false)
            setActiveCategoryIndex(null)
            setActiveSubIndex(null)
          }}
        >
          <ul className={styles.contentNovoMenu}>
            {categories.map((cat, i) => (
              <li
                key={i}
                className={styles.contentNovoMenu}
                onMouseEnter={() => {
                  setActiveCategoryIndex(i)
                  setActiveSubIndex(null)
                }}
              >
                <div className={styles.containerMenuItemArrow}>
                  <img
                    src={cat.image || 'https://universalautomotive.vteximg.com.br/arquivos/logo-versao-final.png'}
                    className={styles.logoMenuItem}
                    alt={cat.name}
                  />
                  <img
                    src="https://universalautomotive.vteximg.com.br/arquivos/arrow-itemMeu-header-right.png"
                    className={styles.arrowRightItemHeaderMenu}
                    alt="seta"
                  />
                </div>
                <p className={styles.nameCategoryItemMenuHeader}>{cat.name}</p>
              </li>
            ))}
          </ul>

          {activeCategoryIndex !== null && categories[activeCategoryIndex]?.children && (
            <ul className={styles.containerMenuHeaderCategoryTwo}>
              <li className={styles.currentNameHeader}>
                <h3>{categories[activeCategoryIndex].name}</h3>
                <hr className={styles.hrMenuHeader} />
              </li>
              {categories[activeCategoryIndex].children!.map((sub, j) => (
                <li key={j} className={styles.subcategory} onMouseEnter={() => setActiveSubIndex(j)}>
                  {sub.name}
                </li>
              ))}
            </ul>
          )}

          {activeCategoryIndex !== null &&
            activeSubIndex !== null &&
            categories[activeCategoryIndex].children?.[activeSubIndex]?.children && (
              <ul className={styles.containerMenuHeaderCategoryTree}>
                {categories[activeCategoryIndex].children?.[activeSubIndex]?.children!.map((item, k) => (
                  <li key={k} className="pv2 ph3 hover-bg-moon-gray pointer">
                    {item.image && (
                      <img src={item.image} className={styles.subsubcategoryImage} alt={item.name} />
                    )}
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
        </div>
      )}
    </div>
  )
}

export default NovoMenuCustomizado


// SCHEMA mantido
NovoMenuCustomizado.schema = {
  title: 'Novo Menu Customizado',
  description: 'Menu de categorias com múltiplos níveis (categoria, subcategoria e sub-subcategoria)',
  type: 'object',
  properties: {
    categories: {
      title: 'Categorias',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { title: 'Nome da Categoria', type: 'string' },
          link: { title: 'Link da Categoria', type: 'string' },
          image: {
            title: 'Imagem da Categoria',
            type: 'string',
            widget: { 'ui:widget': 'image-uploader' },
          },
          children: {
            title: 'Subcategorias',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { title: 'Nome da Subcategoria', type: 'string' },
                link: { title: 'Link da Subcategoria', type: 'string' },
                children: {
                  title: 'Sub-subcategorias',
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { title: 'Nome da Sub-subcategoria', type: 'string' },
                      link: { title: 'Link da Sub-subcategoria', type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}