/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'

import MenuSecondLevel from '../../menuSecondLevel/MenuSecondLevel'
import MenuImages from '../../menuImages/MenuImages'

const CSS_HANDLES = [
  'menuFirstLevelList',
  'menuFirstLevelListLinkFirst',
  'icon',
  'menuFirstLevelListSubmenu',
  'menuFirstLevelListLink',
  'menuFirstLevelListLinkItem',
  'arrowFirstLevel',
]

const NavBarItem = ({ item, index, device, handleBackFirstLevel }) => {
  const [openMenu, setOpenMenu] = useState(false)
  const { handles } = useCssHandles(CSS_HANDLES)

  const enter = () => {
    document.body.style.overflow = 'hidden'
  }

  const close = () => {
    document.body.style.overflow = 'auto'
  }

  return (
    <>
      {!item.hasSecondLevelLista && !item.hasSecondLevelBanners ? (
        <>
          {!item.posicaoDireita && (
            <li className={`${handles.menuFirstLevelList}`} key={index}>
              <Link
                to={item.href}
                className={`${handles.menuFirstLevelListLinkFirst} a`}
                id={index}
              >
                {item.icon && (
                  <img
                    src={item.icon}
                    alt="icon menu"
                    className={handles.icon}
                  />
                )}
                {item.text}
              </Link>
            </li>
          )}
        </>
      ) : (
        <li
          className={`${handles.menuFirstLevelListSubmenu}`}
          onMouseEnter={enter}
          onMouseLeave={close}
          key={index}
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <span
            className={`${handles.menuFirstLevelListLink}`}
            onClick={() => setOpenMenu(true)}
            id={index}
          >
            <div className={`${handles.menuFirstLevelListLinkItem}`}>
              {item.icon && (
                <img src={item.icon} alt="icon menu" className={handles.icon} />
              )}
              {item.text}
            </div>
            <div className={handles.arrowFirstLevel} />
          </span>
          {item.hasSecondLevelLista && (
            <MenuSecondLevel
              menuSecondLevel={item.menuSecondLevel}
              device={device}
              backFirstLevel={() => handleBackFirstLevel()}
              titleHeaderTirdLevel={item.text}
              setOpen={setOpenMenu}
              open={openMenu}
            />
          )}

          {item.hasSecondLevelBanners && (
            <MenuImages
              bannerItem={item.menuOnlyBannersLevel}
              title={item.text}
              device={device}
              open={openMenu}
              setOpen={setOpenMenu}
              backFirstLevel={() => handleBackFirstLevel()}
            />
          )}
        </li>
      )}
    </>
  )
}

export default NavBarItem
