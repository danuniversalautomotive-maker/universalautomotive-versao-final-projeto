import type { FunctionComponent } from 'react'
import React, { useState } from 'react'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl, defineMessages } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

import {
  ButtonLink,
  AdditionalInfo,
  FormattedPrice,
} from './OriginalOrderDetailsComponents'
import InfoIcon from './icons/Info'

function parseBankInvoiceUrl({
  url,
  rootPath = '',
}: {
  url: string
  rootPath?: string
}) {
  const isEncrypted = Boolean(url.match(/(\*.\*.)+\*\w\*/g))

  if (!isEncrypted) return url

  const encodedPath = encodeURIComponent(
    window.location.pathname + window.location.search
  )

  return `${rootPath}/login?returnUrl=${encodedPath}`
}

const messages = defineMessages({
  creditcard: { id: 'store/payments.creditcard', defaultMessage: '' },
  promissory: { id: 'store/payments.promissory', defaultMessage: '' },
  debitcard: { id: 'store/payments.debitcard', defaultMessage: '' },
  lastDigits: {
    id: 'store/payments.creditcard.lastDigits',
    defaultMessage: '',
  },
  giftCard: { id: 'store/payments.giftCard', defaultMessage: '' },
  installments: {
    id: 'store/payments.installments',
    defaultMessage: ' à vista',
  },
  print: { id: 'store/payments.bankinvoice.print', defaultMessage: '' },
})

interface Props {
  payment: any
  transactionId: string
  currency: string
}

const CSS_HANDLES = [
  'paymentGroup',
  'paymentValue',
  'paymentInstallments',
] as const

const paymentGroupSwitch = (payment: any, intl: InjectedIntlProps) => {
  switch (payment.group) {
    case 'creditCard':
      return intl.formatMessage(messages.creditcard)

    case 'bankInvoice':
      return payment.paymentSystemName

    case 'promissory':
      return ''

    case 'debitCard':
      return intl.formatMessage(messages.debitcard)

    case 'giftCard':
      return intl.formatMessage(messages.giftCard)

    case 'creditControl':
      return ''

    default:
      return payment.paymentSystemName
  }
}

const getPaymentSystemName = (systemName: string) => {
  switch (systemName) {
    case 'Promissory':
      return 'Antecipado'

    case 'Customer Credit':
      return 'Parcelado'

    default:
      return systemName
  }
}

const PaymentMethod: FunctionComponent<Props & InjectedIntlProps> = ({
  payment,
  transactionId,
  currency,
  intl,
  customPaymentData,
}) => {
  const { rootPath } = useRuntime()
  const [isOpen, setIsOpen] = useState(false)
  const hasPaymentSystemName = payment.paymentSystemName
  const hasPaymentOrigin = !!payment.paymentOrigin
  const hasLastDigits = !!payment.lastDigits
  const isBankInvoice = payment.group === 'bankInvoice'
  const handles = useCssHandles(CSS_HANDLES)

  const checkCharacters = (descriptionString: string) => {
    if (descriptionString === '-') return '' // description não preenchido.

    if (
      !descriptionString.includes('/') &&
      !descriptionString.includes('\\') &&
      !descriptionString.includes('DD') &&
      !descriptionString.includes(' ')
    ) {
      // Description não pussui nenhum caracter de parcelamento e por isso não deve ser considerado.

      return ''
    }
    // description possuí caracteres de parcelamento.

    return descriptionString
  }

  return (
    <article className="flex justify-between">
      <div className="t-body lh-solid">
        <p className={`${handles.paymentGroup} c-on-base`}>
          {paymentGroupSwitch(payment, intl)}
        </p>
        {hasPaymentSystemName && (
          <p className="c-on-base mb3">
            {getPaymentSystemName(payment.paymentSystemName)}
            {hasPaymentOrigin && <span>&nbsp;({payment.paymentOrigin})</span>}
            {` ${checkCharacters(customPaymentData?.descricao ?? '')}`}
          </p>
        )}
        {hasLastDigits && (
          <p className="c-muted-1 mt0 mb3">
            {intl.formatMessage(messages.lastDigits, {
              lastDigits: payment.lastDigits,
            })}
          </p>
        )}
        <div className="flex items-center">
          <p className={`${handles.paymentValue} c-muted-1 mv0`}>
            <FormattedPrice value={payment.value} currency={currency} />
            <span className={`${handles.paymentInstallments}`}>
              {!customPaymentData?.descricao.includes('/') &&
                ` ${intl.formatMessage(messages.installments, {
                  installments: payment.installments,
                })}`}
            </span>
          </p>
          <div
            className="ml4"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <InfoIcon colorToken="c-muted-3" />
          </div>
        </div>
        <div hidden={!isOpen} className="mt2 z-2 absolute">
          <AdditionalInfo
            paymentId={payment.id}
            transactionId={transactionId}
            showTooltip
          />
        </div>
        {isBankInvoice && payment.url && (
          <div className="mt5">
            <ButtonLink
              to={parseBankInvoiceUrl({ url: payment.url, rootPath })}
              variation="primary"
              openNewWindow
            >
              {intl.formatMessage(messages.print, {
                paymentSystemName: payment.paymentSystemName,
              })}
            </ButtonLink>
          </div>
        )}
      </div>
    </article>
  )
}

export default injectIntl(PaymentMethod)
