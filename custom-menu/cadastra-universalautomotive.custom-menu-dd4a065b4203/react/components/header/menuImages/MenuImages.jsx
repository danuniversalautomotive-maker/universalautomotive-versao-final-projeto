import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'

import HeaderBackLevel from '../headerBackLevel/HeaderBackLevel'

const CSS_HANDLES = [
  'menuImages',
  'menuImagesContainer',
  'menuImagesContainerTitle',
  'menuImagesContent',
  'menuImagesContentList',
  'menuImagesContentListItem',
]

const MenuImages = ({
  bannerItem,
  title,
  device,
  backFirstLevel,
  open,
  setOpen,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <div
      className={handles.menuImages}
      style={{ display: open ? 'block' : 'none' }}
    >
      {device !== 'desktop' && (
        <HeaderBackLevel backFirstLevel={backFirstLevel} setOpen={setOpen} />
      )}
      <div className={handles.menuImagesContainer}>
        <h2 className={handles.menuImagesContainerTitle}>{title}</h2>
        <ul className={handles.menuImagesContent}>
          {bannerItem && (
            <>
              {bannerItem.map((item, index) => {
                return (
                  <li key={index} className={handles.menuImagesContentList}>
                    <Link
                      to={item.href}
                      className={handles.menuImagesContentListItem}
                    >
                      <img src={item.banner} alt={item.text} />
                      <p>{item.text}</p>
                    </Link>
                  </li>
                )
              })}
            </>
          )}
        </ul>
      </div>
    </div>
  )
}

export default MenuImages
