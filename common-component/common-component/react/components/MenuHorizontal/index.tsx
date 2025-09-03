import React from 'react'
import styles from './styles.css'

interface MenuItem {
  text: string
  href: string
}

interface MenuHorizontalProps {
  menuItems?: MenuItem[]
}

export default function MenuHorizontal({ menuItems = [] }: MenuHorizontalProps) {
  return (
    <div className={styles.containerMenuHorizontal}>
      <div className={styles.contentMenuHorizontal}>
        <div className={styles.itensMenuHorizontal}>
            {/* Itens dinâmicos via Site Editor */}
            {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                <span className={styles.destaqueMenuHorizontal}>
                    <a href={item.href}>{item.text}</a>
                </span>
                <div className={styles.hrMenuHorizontal}></div>
                </React.Fragment>
            ))}
          {/* Itens fixos */}
          <span className={styles.destaqueMenuHorizontal}>
            <a href='mais-vendidos'>Mais vendidos</a>
          </span>
          <div className={styles.hrMenuHorizontal}></div>
          <span className={styles.destaqueMenuHorizontal}>
            <a href='lancamentos'>Lançamentos</a>
          </span>
        </div>
      </div>
    </div>
  )
}


MenuHorizontal.schema = {
  title: 'Menu Horizontal',
  description: 'Menu horizontal com links fixos e personalizados via Site Editor',
  type: 'object',
  properties: {
    menuItems: {
      title: 'Links Personalizados',
      type: 'array',
      items: {
        title: 'Item do menu',
        type: 'object',
        properties: {
          text: {
            title: 'Texto do link',
            type: 'string'
          },
          href: {
            title: 'URL do link',
            type: 'string'
          }
        }
      }
    }
  }
}
