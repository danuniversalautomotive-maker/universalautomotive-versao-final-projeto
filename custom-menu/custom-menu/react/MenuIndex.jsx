import React from 'react'
import { useRuntime } from 'vtex.render-runtime'

import MenuHeaderMobile from './components/header/MenuHeaderMobile'
import MenuHeaderDesktop from './components/header/MenuHeaderDesktop'

function MenuIndex(props) {
  const { deviceInfo } = useRuntime()

  return deviceInfo.isMobile ? (
    <MenuHeaderMobile {...props} />
  ) : (
    <MenuHeaderDesktop {...props} />
  )
}

export default MenuIndex

MenuIndex.schema = {
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
              },
            },
          },
        },
      },
    },
  },
}
