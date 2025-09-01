import * as React from 'react'

import { useCssHandles } from 'vtex.css-handles'

import json from './defaultPropsMobile.json'
import { Link } from 'vtex.render-runtime'

import { Image } from 'vtex.store-image'

const CSS_HANDLES = [
  'level',
  'newMenuCustomMobile',
  'menuCustomContent',
  'container',
  'arrowFirstLevel',
  'wrapperTextDirect',
  'labelMenuItem',
  'backText',
  'iconWrapper',
  'linkMobileWrapper',
]

const Item = ({
  level,
  hasLevel,
  menuLevel,
  __editorItemTitle,
  href,
  icon,
  hasLevelBanners,
  menuOnlyBannersLevel,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  return (
    <>
      {hasLevel && menuLevel && menuLevel.length ? (
        <>
          <div
            className={`${handles['level']}-container-text ${handles['level']}-container-text-${level}`}
          >
            <label className={`${handles.labelMenuItem}`}>
              {icon ? (
                <div className={`${handles.iconWrapper}`}>
                  <Image
                    src={icon}
                    loading={level === 0 ? 'eager' : 'lazy'}
                    fetchpriority={level === 0 ? 'high' : 'low'}
                    maxWidth={64}
                  />
                </div>
              ) : (
                <></>
              )}
              {__editorItemTitle}
              <input
                type="radio"
                name={`${handles['level']}-item-${level}-radio`}
                className={`${handles['level']}-radio  ${handles['level']}-item-${level}-radio`}
              />
            </label>
          </div>
          <div className={`${handles['level']}-container-${level}`}>
            <div className={handles.wrapperTextDirect}>
              <label
                className={`${handles['level']}-container-text-closet ${handles['level']}-container-text-${level}`}
                htmlFor={`${handles['level']}-container-text-closet-${level}`}
              >
                <div className={handles.arrowFirstLevel}>Voltar</div>
                <div className={handles.backText}>
                  <Link to={href} className={`${handles.linkMobileWrapper}`}>
                    {icon ? (
                      <div className={`${handles.iconWrapper}`}>
                        <Image
                          src={icon}
                          loading={level === 0 ? 'eager' : 'lazy'}
                          fetchpriority={level === 0 ? 'high' : 'low'}
                          maxWidth={64}
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                    {__editorItemTitle}
                  </Link>
                  <input
                    type="radio"
                    name={`${handles['level']}-item-${level}-radio`}
                    id={`${handles['level']}-container-text-closet-${level}`}
                    className={`${handles['level']}-radio  ${handles['level']}-item-${level}-radio`}
                  ></input>
                </div>
              </label>
              {level > 0 ? (
                <li
                  key={'level-' + level + '-null'}
                  className={`${handles['level']}-direct ${handles['level']}-item-${level} ${handles['level']}-item`}
                >
                  <Link to={href} className={`${handles['level']}-link `}>
                    Ver tudo
                  </Link>{' '}
                </li>
              ) : (
                <></>
              )}
            </div>
            <ul className={`${handles['level'] + '-' + level}`}>
              {menuLevel.map((el, index) => (
                <li
                  key={'level-' + level + '-' + index}
                  className={`${handles['level']}-item-${level} ${handles['level']}-item`}
                >
                  <Item level={level + 1} {...el} />
                </li>
              ))}
            </ul>{' '}
          </div>
        </>
      ) : hasLevelBanners &&
        menuOnlyBannersLevel &&
        menuOnlyBannersLevel.length ? (
        <div className={`${handles['level']}-container-${level}`}>
          <label
            className={`${handles['level']}-container-text-closet ${handles['level']}-container-text-${level}`}
            htmlFor={`${handles['level']}-container-text-closet-${level}`}
          >
            <div className={handles.arrowFirstLevel}>
              <input
                type="radio"
                name={`${handles['level']}-item-${level}-radio`}
                id={`${handles['level']}-container-text-closet-${level}`}
                className={`${handles['level']}-radio  ${handles['level']}-item-${level}-radio`}
              ></input>
            </div>
            {__editorItemTitle}
          </label>
          {level > 0 ? (
            <li
              key={'level-' + level + '-null'}
              className={`${handles['level']}-direct ${handles['level']}-item-${level} ${handles['level']}-item`}
            >
              <Link to={href} className={`${handles['level']}-link `}>
                Ir para {__editorItemTitle}
              </Link>{' '}
            </li>
          ) : (
            <></>
          )}
          <ul
            className={`${handles['level'] + '-' + level} ${handles['level']
              }-banner`}
          >
            {menuOnlyBannersLevel &&
              menuOnlyBannersLevel.map((el, index) => (
                <li
                  key={'level-' + level + '-' + index}
                  className={`${handles['level']}-banner-item ${handles['level']}-item-${level} ${handles['level']}-item`}
                >
                  <Link to={el.href} className={`${handles['level']}-link `}>
                    <Image
                      src={el.banner}
                      loading={level === 0 ? 'eager' : 'lazy'}
                      fetchpriority={level === 0 ? 'high' : 'low'}
                      width={138}
                      height={95}
                    />
                    {el.__editorItemTitle}
                  </Link>
                </li>
              ))}
          </ul>{' '}
        </div>
      ) : (
        <>
          <Link
            to={href}
            className={`${handles['level']}-link ${handles['level']}-link-${level}`}
          >
            {icon ? (
              <div className={`${handles.iconWrapper}`}>
                <Image
                  src={icon}
                  loading={level === 0 ? 'eager' : 'lazy'}
                  fetchpriority={level === 0 ? 'high' : 'low'}
                  maxWidth={64}
                />
              </div>
            ) : (
              <></>
            )}
            {__editorItemTitle}
          </Link>
        </>
      )}
    </>
  )
}

const MenuHeaderM = (props) => {
  const { menuFirstLevel, mobileFooter } = props

  const { handles } = useCssHandles(CSS_HANDLES)

  const items = menuFirstLevel?.filter((el) => el.__editorItemTitle !== '')
  return items.length > 0 ? (
    <nav className={handles.newMenuCustomMobile}>
      <div className={handles.container}>
        {items.map((el, index) => (
          <div
            className={`${handles['level']}-index ${handles['level']} ${el.highlight ? `${handles['level']}-highlight` : ''
              }`}
          >
            <Item level={0} {...el} key={index} />
          </div>
        ))}
      </div>

      <div className={`${handles['level']}-footer`}>
        {mobileFooter.length > 0 &&
          mobileFooter?.map(
            ({ href, __editorItemTitle: elText, highlight = false }, index) => {
              if (elText.indexOf('http')) {
                return (
                  <a
                    key={index}
                    className={`${handles['level']}-footer-link ${highlight
                        ? `${handles['level']}-footer-link-highlight`
                        : ''
                      }`}
                    href={href}
                  >
                    {elText}
                  </a>
                )
              } else {
                return (
                  <Link
                    to={href}
                    key={index}
                    className={`${handles['level']}-footer-link ${highlight
                        ? `${handles['level']}-footer-link-highlight`
                        : ''
                      }`}
                  >
                    {__editorItemTitle}
                  </Link>
                )
              }
            }
          )}
      </div>
    </nav>
  ) : (
    <></>
  )
}

MenuHeaderM.defaultProps = json

MenuHeaderM.schema = {
  title: 'Custom Menu Header',
  description: 'Gerenciador de Menu Header',
  type: 'object',
  properties: {
    menuFirstLevel: {
      title: 'Menu primeiro nível',
      type: 'array',
      default: MenuHeaderM.defaultProps.menuFirstLevel,
      items: {
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Menu item texto',
            type: 'string',
          },
          href: {
            title: 'Menu item link',
            type: 'string',
          },
          icon: {
            title: 'Menu item icone',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          hasLevel: {
            title: 'Tem Submenu de lista?',
            type: 'boolean',
            default: false,
          },
          menuLevel: {
            title: 'Menu segundo nível',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                __editorItemTitle: {
                  title: 'Menu item texto',
                  type: 'string',
                },
                href: {
                  title: 'Menu item link',
                  type: 'string',
                },
                icon: {
                  title: 'Menu item icone',
                  type: 'string',
                  widget: {
                    'ui:widget': 'image-uploader',
                  },
                },
                hasLevel: {
                  title: 'Tem Submenu de lista?',
                  type: 'boolean',
                  default: false,
                },
                menuLevel: {
                  title: 'Menu terceiro nível',
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      __editorItemTitle: {
                        title: 'Menu item texto',
                        type: 'string',
                      },
                      href: {
                        title: 'Menu item link',
                        type: 'string',
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
    mobileFooter: {
      title: 'Menu footer',
      type: 'array',
      default: MenuHeaderM.defaultProps.mobileFooter,
      items: {
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Texto do Item',
            type: 'string',
          },
          href: {
            title: 'Menu item link',
            type: 'string',
          },
          highlight: {
            title: 'Item em destaque? ',
            type: 'boolean',
          },
        },
      },
    },
  },
}

export default MenuHeaderM
