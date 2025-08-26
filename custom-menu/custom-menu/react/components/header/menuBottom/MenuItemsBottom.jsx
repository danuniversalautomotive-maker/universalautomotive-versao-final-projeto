import React from 'react'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['menuItemBottomList', 'menuItemBottomItem']

const MenuItemsBottom = ({ menuBottom }) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.menuItemBottomList}>
      {menuBottom && (
        <>
          {menuBottom.map((item, index) => {
            return (
              <Link
                key={index}
                to={item.href}
                className={handles.menuItemBottomItem}
              >
                {item.text}
              </Link>
            )
          })}
        </>
      )}
    </div>
  )
}

export default MenuItemsBottom
