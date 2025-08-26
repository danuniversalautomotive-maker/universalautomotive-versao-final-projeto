import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import json from '../../defaultPropsDesktop.json'
import MenuFirstLevel from './menuFirstLevel/MenuFirstLevel'
import MenuItemsBottom from './menuBottom/MenuItemsBottom'

const CSS_HANDLES = [
  'menuCustom',
  'menuCustomContent',
  'container',
  'menuCustomBottom',
]

const MenuHeaderDesktop = (props) => {
  const { menuFirstLevel, menuItemsBottom, menuItemsBottomVisible } = props

  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <div>
      <nav className={handles.menuCustom}>
        {menuFirstLevel && (
          <div className={handles.menuCustomContent}>
            <div className={handles.container}>
              <MenuFirstLevel menuFirstLevel={menuFirstLevel} />
            </div>
          </div>
        )}
      </nav>
      {menuItemsBottom && menuItemsBottomVisible && (
        <div className={handles.menuCustomBottom}>
          <div className={handles.container}>
            <MenuItemsBottom menuBottom={menuItemsBottom} />
          </div>
        </div>
      )}
    </div>
  )
}

MenuHeaderDesktop.defaultProps = json

MenuHeaderDesktop.schema = {
  title: 'Custom Menu Header',
  description: 'Gerenciador de Menu Header',
  type: 'object',
  properties: {
    menuFirstLevel: {
      title: 'Menu primeiro nível',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          posicaoDireita: {
            title: 'Menu item fica posicionado na direita?',
            type: 'boolean',
          },
          text: {
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
          hasSecondLevelLista: {
            title: 'Tem Submenu de lista?',
            type: 'boolean',
            default: false,
          },
          menuSecondLevel: {
            title: 'Menu segundo nível',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                botaoVerTodos: {
                  title: 'Link botão ver tudo',
                  type: 'string',
                },
                text: {
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
                hasTirdLevel: {
                  title: 'Tem terceiro nível? ',
                  type: 'boolean',
                },
                menuTirdLevel: {
                  title: 'Menu terceiro nível',
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      text: {
                        title: 'Menu item texto',
                        type: 'string',
                      },
                      href: {
                        title: 'Menu item link',
                        type: 'string',
                      },
                      hasTirdLevel: {
                        title: 'Tem quarto nível?',
                        type: 'boolean',
                      },
                      menuTirdLevel: {
                        title: 'Menu quarto nível',
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            text: {
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
                banner1: {
                  title: 'Banner terceiro nível 1',
                  type: 'string',
                  widget: {
                    'ui:widget': 'image-uploader',
                  },
                },
                banner2: {
                  title: 'Banner terceiro nível 2',
                  type: 'string',
                  widget: {
                    'ui:widget': 'image-uploader',
                  },
                },
              },
            },
          },
          hasSecondLevelBanners: {
            title: 'Tem Submenu de banners?',
            type: 'boolean',
            default: false,
          },
          menuOnlyBannersLevel: {
            title: 'Menu somente de banners',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                banner: {
                  title: 'Menu banner item',
                  type: 'string',
                  widget: {
                    'ui:widget': 'image-uploader',
                  },
                },
                text: {
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
    menuItemsBottomVisible: {
      title: 'Menu items bottom visible',
      type: 'boolean',
      default: true,
    },
    menuItemsBottom: {
      title: 'Menu items bottom',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: {
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
}

export default MenuHeaderDesktop
