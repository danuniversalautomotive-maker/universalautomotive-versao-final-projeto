import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import styles from './styles.css'
import { EnglishFlag } from './Icons/EnglishFlag'
import { SpanishFlag } from './Icons/SpanishFlag'
import { PortugueseFlag } from './Icons/PortugueseFlag'

declare global {
  interface Window {
    google: any
  }
}

const changeLanguage = (langCode: string) => {
  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
  if (select) {
    const validLanguages = ['pt', 'en', 'es']
    if (validLanguages.includes(langCode)) {
      select.value = langCode
      select.dispatchEvent(new Event('change'))

      // Validação extra para garantir que o idioma foi selecionado corretamente
      setTimeout(() => {
        if (select.value !== langCode) {
          console.error(
            `Failed to select the correct language: ${langCode}. Retrying...`
          )
          select.value = langCode
          select.dispatchEvent(new Event('change'))
        }
      }, 500)
    } else {
      console.error('Invalid language code:', langCode)
    }
  }
}

const translateToPortuguese = () => changeLanguage('pt')
const translateToEnglish = () => changeLanguage('en')
const translateToSpanish = () => changeLanguage('es')

export const GoogleTranslate = () => {
  useEffect(() => {
    translateToEnglish()
  }, [])

  setTimeout(() => {
    new window.google.translate.TranslateElement(
      { pageLanguage: 'en' },
      'google_translate_element'
    )
  }, 3000)

  return (
    <>
      <Helmet>
        <script
          type="text/javascript"
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        ></script>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement(
                  {
                    pageLanguage: 'en',
                    includedLanguages: 'en,pt,es'
                  },
                  'google_translate_element'
                );
              }
            `,
          }}
        ></script>
      </Helmet>
      <div
        id="google_translate_element"
        className={styles.google_translate_element}
      ></div>

      <div className={styles.ChooseLanguageWrapper}>
        <button onClick={translateToPortuguese}>
          <PortugueseFlag />
        </button>
        <button onClick={translateToEnglish}>
          <EnglishFlag />
        </button>
        <button onClick={translateToSpanish}>
          <SpanishFlag />
        </button>
      </div>
    </>
  )
}

GoogleTranslate.schema = {
  title: 'GoogleTranslate',
}
