import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'

const CSS_HANDLES = ['footerMobile', 'footerMobileItems']

const FooterMenuMobile = ({ device, mobileFooter }) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <>
      {device !== 'desktop' && mobileFooter && (
        <div className={handles.footerMobile}>
          {mobileFooter.map((footerItem) => {
            return (
              <Link
                key={footerItem.text}
                to={footerItem.href}
                className={`${handles.footerMobileItems}`}
              >
                {footerItem.text}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}

export default FooterMenuMobile
