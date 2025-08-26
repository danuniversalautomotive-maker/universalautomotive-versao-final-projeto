import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import MenuItemsBottom from './menuBottom/MenuItemsBottom'

const CSS_HANDLES = ['menuCustomBottom']

const MenuHeaderItemsBottom = ({ menuItemsBottom, menuItemsBottomVisible }) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.menuCustomBottom}>
      {menuItemsBottom && menuItemsBottomVisible && (
        <MenuItemsBottom menuBottom={menuItemsBottom} />
      )}
    </div>
  )
}

export default MenuHeaderItemsBottom

MenuHeaderItemsBottom.schema = {
  title: 'Custom Menu Header Items Bottom Mobile',
  description: 'Gerenciador de Menu Header Items Bottom',
  type: 'object',
  properties: {
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
