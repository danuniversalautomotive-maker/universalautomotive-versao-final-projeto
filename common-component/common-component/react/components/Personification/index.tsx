import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { useIntl } from 'react-intl'
import { Button, Spinner } from 'vtex.styleguide'

import { B2B_CHECKOUT_SESSION_KEY } from '../../utils/constants'
import storageFactory from '../../utils/storage'
import { userWidgetMessages as messages } from '../utils/messages'
import { useSessionResponse } from '../../modules/session'
import STOP_IMPERSONATION from '../../graphql/impersonateUser.graphql'
import USER_WIDGET_QUERY from '../../graphql/userWidgetQuery.graphql'
import styles from './styles.css'

const localStore = storageFactory(() => localStorage)
let isAuthenticated =
  JSON.parse(String(localStore.getItem('b2b-organizations_isAuthenticated'))) ??
  false

const Personification = () => {
  const [stopImpersonation] = useMutation(STOP_IMPERSONATION)
  const { formatMessage } = useIntl()
  const [loadingState, setLoadingState] = useState(false)
  const sessionResponse: any = useSessionResponse()

  if (sessionResponse) {
    isAuthenticated =
      sessionResponse?.namespaces?.profile?.isAuthenticated?.value === 'true'

    localStore.setItem(
      'b2b-organizations_isAuthenticated',
      JSON.stringify(isAuthenticated)
    )
  }

  const { data: userWidgetData, loading: userWidgetLoading } = useQuery(
    USER_WIDGET_QUERY,
    {
      ssr: false,
      skip: !isAuthenticated,
    }
  ) as any

  if (userWidgetLoading) {
    return (
      <div>
        <Spinner color="#fff" />
      </div>
    )
  }

  if (
    !isAuthenticated ||
    !userWidgetData?.checkUserPermission ||
    !userWidgetData?.getOrganizationByIdStorefront ||
    !userWidgetData?.getCostCenterByIdStorefront
  ) {
    return null
  }

  const handleStopImpersonation = async () => {
    setLoadingState(true)
    stopImpersonation()
      .then(() => {
        if (sessionStorage.getItem(B2B_CHECKOUT_SESSION_KEY)) {
          sessionStorage.removeItem(B2B_CHECKOUT_SESSION_KEY)
        }

        window.location.reload()
      })
      .catch((error) => {
        console.error(error)
        setLoadingState(false)
      })
  }

  return (
    <>
      {userWidgetData?.checkImpersonation?.email && (
        <div className={styles.personificationContainer}>
          <p>
            {`${formatMessage(messages.impersonating)} ${
              userWidgetData?.checkImpersonation.email
            }`}
          </p>
          <Button
            variation="danger"
            size="small"
            onClick={() => handleStopImpersonation()}
            isLoading={loadingState}
          >
            {formatMessage(messages.stopImpersonation)}
          </Button>
        </div>
      )}
    </>
  )
}

export default Personification
