import React from 'react'
import type { ReactChild, ReactNode } from 'react'
import {
  ButtonLink as OriginalButtonLink,
  AdditionalInfo as OriginalAdditionalInfo,
  FormattedPrice as OriginalFormattedPrice,
} from 'vtex.order-details'

interface ButtonLinkProps {
  to: string
  icon?: ReactNode
  fullWidth?: boolean
  openNewWindow?: boolean
  variation: string
  children: ReactChild
}

interface AdditionalInfoProps {
  paymentId: string
  transactionId: string
  showTooltip?: boolean
}

interface FormattedPriceProps {
  value: number
  currency: string
}

export const ButtonLink: React.FC<ButtonLinkProps> = (props) => (
  <OriginalButtonLink {...props} />
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Qualquer = OriginalAdditionalInfo as any

export const AdditionalInfo: React.FC<AdditionalInfoProps> = (props) => (
  <Qualquer {...props} />
)

export const FormattedPrice: React.FC<FormattedPriceProps> = ({
  value,
  currency,
}) => <OriginalFormattedPrice value={value} currency={currency} />
