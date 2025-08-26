import * as React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'
import { Image } from 'vtex.store-image'

import json from './defaultPropsDesktop.json'

const CSS_HANDLES = [
  'level',
  'newMenuCustom',
  'menuCustomContent',
  'container',
  'arrowFirstLevel',
  'textFirstLevel',
  'iconImage',
]

const Item = ({
  level,
  hasLevel,
  menuLevel,
  __editorItemTitle,
  href,
  icon,
  iconWidth,
  hasLevelBanners = false,
  banner,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <>
      <Link to={href} className={`${handles.level}-link`}>
        {icon && (
          <div className={`${handles.iconImage} ${handles.iconImage}-${level}`}>
            <Image
              src={icon}
              loading={level === 0 ? 'eager' : 'lazy'}
              fetchpriority={level === 0 ? 'high' : 'low'}
              width={iconWidth || ''}
            />
          </div>
        )}
        <span className={handles.textFirstLevel}>
          {__editorItemTitle}
          {hasLevel && level > 0 && menuLevel && menuLevel.length > 0 && (
            <div className={handles.arrowFirstLevel} />
          )}
        </span>
      </Link>
      {hasLevel && menuLevel && menuLevel.length > 0 && (
        <div className={`${handles.level}-container-${level}`}>
          <div className={`${handles.level}-container-${level}--wrapper`}>
            {level !== 0 && (
              <div className={`${handles.level}-top-header`}>
                <p className={`${handles.level}-top-header-text`}>
                  <Link
                    to={href}
                    className={`${handles.level}-top-header-text-link`}
                  >
                    {__editorItemTitle}
                  </Link>
                </p>
              </div>
            )}
            <div className={`${handles.level}-${level}--wrapper`}>
              <div className={`${handles.level}-${level}--list`}>
                <ul className={`${handles.level}-${level}`}>
                  {menuLevel.map((el, index) => (
                    <li
                      key={`level-${level}-${index}`}
                      className={`${handles.level}-item-${level} ${handles.level}-item`}
                    >
                      <Item level={level + 1} {...el} />
                    </li>
                  ))}
                </ul>
                {level > 0 && (
                  <Link
                    to={href}
                    className={`${handles.level}-top-header-text-todo`}
                  >
                    Ver todos
                  </Link>
                )}
              </div>
              {hasLevelBanners && banner && (
                <Image
                  src={banner}
                  loading={level === 0 ? 'eager' : 'lazy'}
                  fetchpriority={level === 0 ? 'high' : 'low'}
                  width={347}
                  height={334}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )

}

const MenuHeader = (props) => {
  const { menuFirstLevel } = props

  const { handles } = useCssHandles(CSS_HANDLES)

  const items = menuFirstLevel
    ? menuFirstLevel.filter((el) => el.__editorItemTitle !== '')
    : []

  return (
    items &&
    items.length > 0 && (
      <nav className={handles.newMenuCustom}>
        <div className={handles.container}>
          {items.map((el, index) => (
            <div
              key={index}
              className={`${handles.level}-index ${
                el.highlight ? `${handles.level}-highlight` : ''
              }`}
            >
              <Item level={0} {...el} />
            </div>
          ))}
        </div>
      </nav>
    )
  )
}

MenuHeader.defaultProps = json

MenuHeader.schema = {
  title: 'Custom Menu Header',
  description: 'Gerenciador de Menu Header',
  type: 'object',
  properties: {
    menuFirstLevel: {
      title: 'Menu primeiro nível',
      type: 'array',
      default: MenuHeader.defaultProps.menuFirstLevel,
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
                hasLevelBanners: {
                  title: 'Tem banner no subMenu?',
                  type: 'boolean',
                  default: false,
                },
                banner: {
                  title: 'SubMenu banner',
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
  },
}

export default MenuHeader
