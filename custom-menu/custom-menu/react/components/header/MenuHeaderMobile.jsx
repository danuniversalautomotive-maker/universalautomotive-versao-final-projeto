import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import MenuFirstLevel from './menuFirstLevel/MenuFirstLevel'
import json from '../../defaultPropsMobile.json'

const CSS_HANDLES = ['menuCustom']

const MenuHeaderMobile = ({ mobileHeader, menuFirstLevel, mobileFooter }) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <nav className={handles.menuCustom}>
      <MenuFirstLevel
        menuFirstLevel={menuFirstLevel}
        mobileHeader={mobileHeader}
        mobileFooter={mobileFooter}
      />
    </nav>
  )
}

MenuHeaderMobile.defaultProps = json

MenuHeaderMobile.schema = {
  title: 'Custom Menu Header Mobile',
  description: 'Gerenciador de Menu Header Mobile',
  type: 'object',
  properties: {
    mobileHeader: {
      title: 'Header menu mobile',
      type: 'array',
      default: MenuHeaderMobile.defaultProps.mobileHeader,
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
          icon: {
            title: 'Menu item icone',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
        },
      },
    },
    menuFirstLevel: {
      title: 'Menu primeiro nível',
      type: 'array',
      default: MenuHeaderMobile.defaultProps.menuFirstLevel,
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
    mobileFooter: {
      title: 'Footer menu mobile',
      type: 'array',
      default: MenuHeaderMobile.defaultProps.mobileFooter,
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

export default MenuHeaderMobile
