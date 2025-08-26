import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'

import NavBarItem from './NavBarItem'

const CSS_HANDLES = [
  'menuFirstLevelContent',
  'menuFirstLevel',
  'menuFirstLevelListLinkRight',
  'icon',
]

const NavBar = ({
  menuFirstLevel,
  device,
  handleOpenSecondLevel,
  handleBackFirstLevel,
  openMenuLevel,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <>
      {menuFirstLevel && (
        <div className={handles.menuFirstLevelContent}>
          <ul className={handles.menuFirstLevel}>
            {menuFirstLevel.map((first, index) => {
              return (
                <NavBarItem
                  item={first}
                  index={index}
                  key={index}
                  handleOpenSecondLevel={handleOpenSecondLevel}
                  device={device}
                  handleBackFirstLevel={handleBackFirstLevel}
                  openMenuLevel={openMenuLevel}
                />
              )
            })}
          </ul>
          {/* posiciona menu item na direita */}
          {device === 'desktop' && (
            <ul className={handles.menuFirstLevel}>
              {menuFirstLevel.map((first, index) => {
                return (
                  <>
                    {first.posicaoDireita && (
                      <Link
                        to={first.href}
                        className={`${handles.menuFirstLevelListLinkRight}`}
                        id={index}
                      >
                        {first.icon && (
                          <img
                            src={first.icon}
                            alt="icon menu"
                            className={handles.icon}
                          />
                        )}
                        {first.text}
                      </Link>
                    )}
                  </>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </>
  )
}

export default NavBar
