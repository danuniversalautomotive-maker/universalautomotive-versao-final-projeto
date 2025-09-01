import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'

import IcoArrowClose from '../../../assets/arrow-close.png'

const CSS_HANDLES = [
  'backButton',
  'icon',
  'menuTirdLevel',
  'menuTirdLevelContainer',
  'menuTirdLevelContentTop',
  'menuTirdLevelItemTitle',
  'menuTirdLevelContentCol',
  'menuTirdLevelContentList',
  'menuTirdLevelList',
  'menuTirdLevelListLink',
  'menuTirdLevelButtonVerTodos',
]

const MenuFourthLevel = ({
  menuTirdLevel,
  backSecondLevel,
  titleHeaderTirdLevel,
  device,
}) => {
  const tirdLevel = menuTirdLevel
  const { handles } = useCssHandles(CSS_HANDLES)

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
      <div className={`${handles.menuTirdLevelContainer}`}>
        <div className={handles.menuTirdLevelContentTop}>
          <p className={handles.menuTirdLevelItemTitle}>
            <Link to={tirdLevel.href}>{tirdLevel.text}</Link>
          </p>
          <Link
            className={handles.menuTirdLevelButtonVerTodos}
            to={tirdLevel.href}
          >
            Ver tudo
          </Link>
        </div>
        <div className={handles.menuTirdLevelContentCol}>
          <ul className={handles.menuTirdLevelContentList}>
            {tirdLevel.menuTirdLevel.map((tird, index) => {
              return (
                <li key={index} className={`${handles.menuTirdLevelList}`}>
                  <Link
                    to={tird.href}
                    className={`${handles.menuTirdLevelListLink}`}
                  >
                    {tird.text}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MenuFourthLevel
