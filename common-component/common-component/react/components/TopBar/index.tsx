import React from 'react'
import styles from './style.css';

export const TopBar = () => {
  
  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
            <span>
                Portal
            </span>
            <span>
                |
            </span>
            <span>
                Cadastre-se
            </span>
            <span>
                |
            </span>
            <span>
                Pedido Rápido
            </span>
            <div className={styles.flags}>
                aa
            </div>
        </div>
      </div>
    </>
  )
}

TopBar.schema = {
  title: 'TopBar',
}
