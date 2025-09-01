import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import IcoArrowClose from '../../../assets/arrow-close.png'

const CSS_HANDLES = ['backButton', 'icon']

const HeaderBackLevel = ({ backFirstLevel, setOpen }) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <div
      className={handles.backButton}
      onClick={() => {
        backFirstLevel()
        setOpen(false)
      }}
      aria-hidden="true"
    >
      <img className={handles.icon} src={IcoArrowClose} alt="close" />
      Menu Principal
    </div>
  )
}

export default HeaderBackLevel
