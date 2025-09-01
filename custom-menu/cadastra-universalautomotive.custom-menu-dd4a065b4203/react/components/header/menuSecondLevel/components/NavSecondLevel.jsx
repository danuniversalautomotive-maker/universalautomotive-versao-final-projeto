/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'

import IcoArrowRightWhite from '../../../../assets/ico-arrow-right-white.png'
import IcoArrowRight from '../../../../assets/icon-arrow-right.png'
import MenuTirdLevel from '../../menuTirdLevel/MenuTirdLevel'

const CSS_HANDLES = [
  'menuSecondLevelContent',
  'menuSecondLevelList',
  'activeLevel',
  'menuSecondLevelListLink',
  'menuseccondLevelLink',
  'menuseccondLevelLinkPhone',
  'icon',
]

const NavSecondLevel = ({ secondLevel, titleHeaderTirdLevel, device }) => {
  const [openMenuTirdLevel, setOpenMenuTirdLevel] = useState(null)
  const { handles } = useCssHandles(CSS_HANDLES)

  const handleOpenTirdLevel = (idIndex) => {
    setOpenMenuTirdLevel(idIndex)
    if (openMenuTirdLevel === null) {
      setOpenMenuTirdLevel(idIndex)
    }
  }

  const handleBackSecondLevel = () => {
    setOpenMenuTirdLevel(null)
  }

  return (
    <ul className={handles.menuSecondLevelContent}>
      {secondLevel && (
        <>
          {secondLevel.map((second, index) => {
            return (
              <>
                {second.hasTirdLevel === true ? (
                  <>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                    <li
                      key={index}
                      className={`${handles.menuSecondLevelList} ${
                        index === openMenuTirdLevel
                          ? `${handles.activeLevel}`
                          : 'inactive-level'
                      }`}
                      id={index}
                      onMouseEnter={() => handleOpenTirdLevel(index)}
                    >
                      <button
                        onClick={() => handleOpenTirdLevel(index)}
                        className={`${handles.menuSecondLevelListLink}`}
                      >
                        <Link
                          to={second.href}
                          className={`${
                            device === 'desktop'
                              ? handles.menuseccondLevelLink
                              : handles.menuseccondLevelLinkPhone
                          }`}
                        >
                          <span>
                            {second.icon && (
                              <img
                                src={second.icon}
                                alt="icon menu"
                                className={handles.icon}
                              />
                            )}
                            {second.text}
                          </span>
                          <span>
                            {device === 'desktop' ? (
                              <img src={IcoArrowRightWhite} alt="" />
                            ) : (
                              <img src={IcoArrowRight} alt="" />
                            )}
                          </span>
                        </Link>
                      </button>
                      {openMenuTirdLevel === index && (
                        <MenuTirdLevel
                          menuTirdLevel={second.menuTirdLevel}
                          title={second.text}
                          banner1={second.banner1}
                          banner2={second.banner2}
                          titleHeaderTirdLevel={titleHeaderTirdLevel}
                          backSecondLevel={() => handleBackSecondLevel()}
                          device={device}
                          IcoArrowRight={IcoArrowRight}
                          verTudo={second.href}
                        />
                      )}
                    </li>
                  </>
                ) : (
                  <li
                    key={index}
                    className={`${handles.menuSecondLevelList}`}
                    id={index}
                  >
                    <Link
                      to={second.href}
                      className={`${handles.menuSecondLevelListLink}`}
                    >
                      {second.icon && (
                        <img
                          src={second.icon}
                          alt="icon menu"
                          className={handles.icon}
                        />
                      )}
                      {second.text}
                    </Link>
                  </li>
                )}
              </>
            )
          })}
        </>
      )}
    </ul>
  )
}

export default NavSecondLevel
