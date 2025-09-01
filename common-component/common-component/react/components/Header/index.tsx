import React, { useState } from 'react'
import axios from 'axios'
import { ExtensionPoint } from 'vtex.render-runtime'
import styles from './style.css'

export const Header = () => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Abre o minicart oficial da VTEX
  const handleOpenMinicart = () => {
    const minicartToggle = new CustomEvent('vtex:cart');
    window.dispatchEvent(minicartToggle);
  };

  // Atualiza o termo e busca sugestões
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.length < 3) {
      setSuggestions([])
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.get(
        `/api/catalog_system/pub/products/search/${encodeURIComponent(value)}`
      )
      setSuggestions(data)
    } catch (err) {
      console.error('Erro ao buscar produtos:', err)
    } finally {
      setLoading(false)
    }
  }

  // Redireciona ao pressionar Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      window.location.href = `/busca/${encodeURIComponent(query.trim())}`
    }
  }

  // Redireciona ao clicar em uma sugestão
  const handleSuggestionClick = (product: any) => {
    window.location.href = `/${product.linkText}/p`
  }

  return (
    <div className={styles.containerHeaderTop}>
      <div className={styles.logoMenu}>
        <img
          src="https://universalautomotive.vteximg.com.br/arquivos/logo-versao-final.png"
          className={styles.logo}
          alt="Universal Automotive"
        />
        <div className={styles.iconMenu}>
          <img src="https://universalautomotive.vteximg.com.br/arquivos/menu-icon-header.png" />
          <span>Menu</span>
        </div>
      </div>

      {/* Barra de busca */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
        />

        {/* Loader */}
        {loading && <p className={styles.loading}>Carregando...</p>}

        {/* Lista de sugestões */}
        {suggestions.length > 0 && (
          <ul className={styles.suggestionList}>
            {suggestions.map((product) => (
              <li
                key={product.productId}
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(product)}
              >
                <img
                  src={product.items[0].images[0].imageUrl}
                  alt={product.productName}
                  className={styles.suggestionImage}
                />
                <span>{product.productName}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.icons}>
        <div>
          <img src="https://universalautomotive.vteximg.com.br/arquivos/login-header-icon.png" />
          <span>login</span>
        </div>

        <div>
          <img src="https://universalautomotive.vteximg.com.br/arquivos/sac-header-icon.png" />
          <span>SAC</span>
        </div>

        {/* Ícone personalizado do carrinho */}
        <div className={styles.cart} onClick={handleOpenMinicart}>
          <img
            src="https://universalautomotive.vteximg.com.br/arquivos/carrinho-header-icon.png"
            alt="Carrinho"
          />
          <span>Carrinho</span>
        </div>
      </div>

      {/* Minicart carregado escondido — não exibe botão nativo */}
      <div style={{ display: 'none' }}>
        <ExtensionPoint id="minicart.v2" />
      </div>
    </div>
  )
}

Header.schema = {
  title: 'Header',
}
