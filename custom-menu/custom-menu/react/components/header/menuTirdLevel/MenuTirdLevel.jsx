import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'

import IcoArrowClose from '../../../assets/arrow-close.png'
import MenuFourthLevel from '../menuFourthLevel/MenuFourthLevel'

const CSS_HANDLES = [
  'menuTirdLevel',
  'menuTirdLevelContainer',
  'menuTirdLevelContentTop',
  'menuTirdLevelItemTitle',
  'menuTirdLevelButtonVerTodos',
  'menuTirdLevelContentCol',
  'menuTirdLevelContentList',
  'menuTirdLevelList',
  'menuTirdLevelListLink',
  'menuSecondLevelList',
  'menuSecondLevelListLink',
  'menuseccondLevelLink',
  'menuseccondLevelLinkPhone',
  'backButton',
  'icon',
]

const MenuTirdLevel = ({
  menuTirdLevel,
  title,
  titleHeaderTirdLevel,
  backSecondLevel,
  device,
  verTudo,
  IcoArrowRight,
}) => {
  const tirdLevel = menuTirdLevel
  const [openMenuTirdLevel, setOpenMenuTirdLevel] = useState(null)
  const { handles } = useCssHandles(CSS_HANDLES)

  const handleOpenTirdLevel = (idIndex) => {
    if (idIndex !== null) {
      setOpenMenuTirdLevel(idIndex)
    }
  }

  const handleBackSecondLevel = () => {
    setOpenMenuTirdLevel(null)
  }

  const HeaderTirdLevel = () => {
    return (
      <div
        className={handles.backButton}
        onClick={backSecondLevel}
        aria-hidden="true"
      >
        <img className={handles.icon} src={IcoArrowClose} alt="close" />
        {titleHeaderTirdLevel}
      </div>
    )
  }

  return (
    <div className={`${handles.menuTirdLevel}`}>
      {device !== 'desktop' && <HeaderTirdLevel />}
      <div className={handles.menuTirdLevelContainer}>
        <div className={handles.menuTirdLevelContentTop}>
          <p className={handles.menuTirdLevelItemTitle}>
            <Link to={verTudo}>
              {device !== 'desktop' && 'Ir para '}
              {title}
            </Link>
          </p>
          {device === 'desktop' && (
            <Link className={handles.menuTirdLevelButtonVerTodos} to={verTudo}>
              Ver tudo
            </Link>
          )}
        </div>
        <div className={handles.menuTirdLevelContentCol}>
          <ul className={handles.menuTirdLevelContentList}>
            {tirdLevel.map((tird, index) => {
              return (
                <>
                  {!tird.menuTirdLevel ? (
                    <li key={index} className={handles.menuTirdLevelList}>
                      <Link
                        to={tird.href}
                        className={`${handles.menuTirdLevelList}Link`}
                      >
                        {tird.text}
                      </Link>
                    </li>
                  ) : (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                    <li
                      key={index}
                      className={`${handles.menuSecondLevelList}`}
                      id={index}
                      onClick={() => handleOpenTirdLevel(index)}
                      onMouseEnter={() => handleOpenTirdLevel(index)}
                    >
                      <div className={`${handles.menuSecondLevelListLink}`}>
                        <Link
                          to={tird.href}
                          className={`${
                            device === 'desktop'
                              ? handles.menuseccondLevelLink
                              : handles.menuseccondLevelLinkPhone
                          }`}
                        >
                          <span>{tird.text}</span>
                          <span>
                            <img src={IcoArrowRight} alt="" />
                          </span>
                        </Link>
                      </div>
                    </li>
                  )}
                </>
              )
            })}
          </ul>
        </div>
      </div>

      {openMenuTirdLevel !== null &&
        tirdLevel[openMenuTirdLevel].hasTirdLevel && (
          <MenuFourthLevel
            menuTirdLevel={tirdLevel[openMenuTirdLevel]}
            backSecondLevel={() => handleBackSecondLevel()}
            device={device}
            titleHeaderTirdLevel={title}
            IcoArrowRight={IcoArrowRight}
          />
        )}
    </div>
  )
}

export default MenuTirdLevel
