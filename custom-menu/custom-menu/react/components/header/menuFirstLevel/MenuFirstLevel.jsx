/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react'
import { useDevice } from 'vtex.device-detector'

import NavBar from './components/NavBar'
import FooterMenuMobile from './components/FooterMenuMobile'

const MenuFirstLevel = ({ menuFirstLevel, mobileFooter }) => {
  const { device } = useDevice()

  const [openMenuLevel, setOpenMenuLevel] = useState(null)

  const handleOpenSecondLevel = (id) => {
    setOpenMenuLevel(id)

    if (id === openMenuLevel) {
      setOpenMenuLevel(null)
    }
  }

  const handleBackFirstLevel = () => {
    setOpenMenuLevel(null)
  }

  return (
    <>
      <NavBar
        menuFirstLevel={menuFirstLevel}
        device={device}
        handleOpenSecondLevel={handleOpenSecondLevel}
        handleBackFirstLevel={handleBackFirstLevel}
        openMenuLevel={openMenuLevel}
      />
      <FooterMenuMobile mobileFooter={mobileFooter} device={device} />
    </>
  )
}

export default MenuFirstLevel
