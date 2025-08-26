/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import NavSecondLevel from './components/NavSecondLevel'
import HeaderBackLevel from '../headerBackLevel/HeaderBackLevel'

const CSS_HANDLES = ['menuSecondLevel']

const MenuSecondLevel = ({
  menuSecondLevel,
  device,
  backFirstLevel,
  titleHeaderTirdLevel,
  setOpen,
  open,
}) => {
  const secondLevel = menuSecondLevel
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <div
      className={handles.menuSecondLevel}
      style={{ display: open ? 'block' : 'none' }}
    >
      {device !== 'desktop' && (
        <HeaderBackLevel backFirstLevel={backFirstLevel} setOpen={setOpen} />
      )}
      <NavSecondLevel
        secondLevel={secondLevel}
        device={device}
        titleHeaderTirdLevel={titleHeaderTirdLevel}
      />
    </div>
  )
}

export default MenuSecondLevel
