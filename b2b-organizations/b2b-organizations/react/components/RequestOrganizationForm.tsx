import React, { useState, useContext, useEffect, Fragment } from 'react'
import {
  Input,
  Button,
  ToastContext,
  Layout,
  PageHeader,
  PageBlock,
  Alert,
  Spinner,
  Dropdown,
  Checkbox,
} from 'vtex.styleguide'
import {
  AddressRules,
  AddressContainer,
  PostalCodeGetter,
  CountrySelector,
  AddressForm,
} from 'vtex.address-form'
import { StyleguideInput } from 'vtex.address-form/inputs'
import { addValidation } from 'vtex.address-form/helpers'
import { useCssHandles } from 'vtex.css-handles'
import { useQuery, useMutation } from 'react-apollo'
import { useIntl, FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import 'vtex.country-codes/locales'

import { organizationRequestMessages as messages } from './utils/messages'
import storageFactory from '../utils/storage'
import { getSession } from '../modules/session'
import { validateEmail, validatePhoneNumber } from '../modules/formValidators'
import { getEmptyAddress, isValidAddress } from '../utils/addresses'
import CREATE_ORGANIZATION_REQUEST from '../graphql/createOrganizationRequest.graphql'
import GET_ORGANIZATION_REQUEST from '../graphql/getOrganizationRequest.graphql'
import GET_LOGISTICS from '../graphql/getLogistics.graphql'
import GET_B2B_CUSTOM_FIELDS from '../graphql/getB2BCustomFields.graphql'
import IMPERSONATE_USER from '../graphql/impersonateUser.graphql'

const localStore = storageFactory(() => localStorage)
let requestId = localStore.getItem('b2b-organizations_orgRequestId') ?? ''

const useSessionResponse = () => {
  const [session, setSession] = useState<any>()
  const sessionPromise = getSession()

  useEffect(() => {
    if (!sessionPromise) {
      return
    }

    sessionPromise.then(sessionResponse => {
      const { response } = sessionResponse

      setSession(response)
    })
  }, [sessionPromise])

  return session
}

const isAuthenticated = true

const CSS_HANDLES = [
  'newOrganizationContainer',
  'newOrganizationInput',
  'newOrganizationRequired',
  'newOrganizationTitle',
  'newOrganizationSubTitle',
  'newOrganizationAddressForm',
  'newOrganizationButtonsContainer',
  'newOrganizationButtonSubmit',
  'newOrganizationSection',
  'textArea',
  'newOrganizationRow'
] as const

const CreateNewOrganizationRequest = (props: any) => {
  return (
    <Fragment>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variation="primary" {...props}>
          <FormattedMessage id="store/b2b-organizations.request-new-organization.submit-button.create-new-request" />
        </Button>
      </div>
    </Fragment>
  )
}

const RequestOrganizationForm = (props: any) => {
  const {
    dadosCadastraisTitle,
    dadosCadastraisSubTitle,
    shippingTitle,
    shippingSubTitle,
    userAdminTitle,
    userAdminSubTitle,
    addressTitle,
    addressSubTitle,
    contactTitle,
    contactSubTitle
  } = props
  const { formatMessage, formatDate } = useIntl()
  const {
    culture: { country },
  } = useRuntime()

  const { showToast } = useContext(ToastContext)
  const sessionResponse: any = useSessionResponse()
  const handles = useCssHandles(CSS_HANDLES)
  const { data } = useQuery(GET_LOGISTICS, { ssr: false })
  const { data: existingRequestData, refetch, loading } = useQuery(
    GET_ORGANIZATION_REQUEST,
    {
      variables: { id: requestId },
      skip: !requestId,
    }
  )
  const putPlaceHolder = (selector: string, placeholder: string) => {
    const intervalPlaceHolder = setInterval(() => {
      const input = document.querySelector(selector);
      if (input) {
        input.setAttribute('placeholder', placeholder);
        clearInterval(intervalPlaceHolder);
      }
    }, 100);
  }

  useEffect(() => {
    putPlaceHolder('input[name="postalCode"]', 'XX.XXX-XXX')
    putPlaceHolder('input[name="street"]', 'Digite aqui')
    putPlaceHolder('input[name="number"]', 'Digite aqui')
    putPlaceHolder('input[name="state"]', 'Selecione um Estado')
    putPlaceHolder('input[name="city"]', 'Selecione uma Cidade')
    putPlaceHolder('input[name="neighborhood"]', 'Selecione uma Cidade')
  }, []);

  const [createOrganizationRequest] = useMutation(CREATE_ORGANIZATION_REQUEST)

  const [addressState, setAddressState] = useState(() =>
    addValidation(getEmptyAddress(country))
  )

  const formStateModel = {
    organizationName: '',
    tradeName: '',
    firstName: '',
    lastName: '',
    email: '',
    defaultCostCenterName: '',
    phoneNumber: '',
    businessDocument: '',
    stateRegistration: '',
    isSubmitting: false,
    submitted: true,
  }

  const [formState, setFormState] = useState(formStateModel)

  const [hasProfile, setHasProfile] = useState(false)

  const [impersonateUser] = useMutation(IMPERSONATE_USER)

  useEffect(() => {
    if (!sessionResponse || hasProfile) return

    if (sessionResponse.namespaces?.profile?.isAuthenticated?.value) {
      setFormState({
        ...formState,
        firstName: sessionResponse.namespaces.profile.firstName?.value,
        lastName: sessionResponse.namespaces.profile.lastName?.value,
        email: sessionResponse.namespaces.profile.email?.value,
      })
      setHasProfile(true)
    }
  }, [sessionResponse])

  const translateMessage = (message: MessageDescriptor) => {
    return formatMessage(message)
  }

  const toastMessage = (message: MessageDescriptor) => {
    const translatedMessage = translateMessage(message)
    const action = undefined

    showToast({ message: translatedMessage, action })
  }

  const translateCountries = () => {
    const { shipsTo = [] } = data?.logistics ?? []

    return shipsTo.map((code: string) => ({
      label: formatMessage({ id: `country.${code}` }),
      value: code,
    }))
  }

  const handleAddressChange = (changedAddress: AddressFormFields) => {
    const curAddress = addressState

    const newAddress = { ...curAddress, ...changedAddress }

    setAddressState(newAddress)
  }

  const handleNewOrganizationRequest = () => {
    localStore.removeItem('b2b-organizations_orgRequestId')
    setFormState({
      ...formStateModel,
      submitted: false,
    })
    setAddressState(() => addValidation(getEmptyAddress(country)))
  }

  //! CUSTOM FIELDS
  const {
    data: defaultCustomFieldsData,
    loading: defaultCustomFieldsDataLoading,
  } = useQuery(GET_B2B_CUSTOM_FIELDS, {
    ssr: false,
  })

  const [orgCustomFieldsState, setOrgCustomFieldsState] = useState<
    CustomField[]
  >([{
    name: 'receiveOffers',
    type: 'text',
    value: 'false',
    useOnRegistration: true
  }])

  const [
    costCenterCustomFieldsState,
    setCostCenterCustomFieldsState,
  ] = useState<CustomField[]>([])

  useEffect(() => {
    if (defaultCustomFieldsDataLoading) return

    const organizationFieldsToDisplay = defaultCustomFieldsData?.getB2BSettings.organizationCustomFields.filter(
      (item: CustomField) => item.useOnRegistration
    )

    const costCenterFieldsToDisplay = defaultCustomFieldsData?.getB2BSettings.costCenterCustomFields.filter(
      (item: CustomField) => item.useOnRegistration
    )

    setOrgCustomFieldsState(organizationFieldsToDisplay)
    setCostCenterCustomFieldsState(costCenterFieldsToDisplay)
  }, [defaultCustomFieldsData])

  //! CUSTOM FIELDS

  const handleImpersonation = () => {
    impersonateUser({
      variables: { userId: '' },
    })
      .then(result => {
        if (result?.data?.impersonateUser?.status === 'error') {
          console.error(
            'Impersonation error:',
            result.data.impersonateUser.message
          )
          toastMessage(messages.toastFailure)
        } else {
          window.location.reload()
        }
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleSubmit = () => {
    setFormState({
      ...formState,
      isSubmitting: true,
      submitted: true,
    })

    const organizationRequest = {
      name: formState.organizationName,
      tradeName: formState.tradeName,
      b2bCustomerAdmin: {
        firstName: formState.firstName,
        lastName: formState.lastName,
        email: formState.email,
      },
      defaultCostCenter: {
        name: formState.defaultCostCenterName,
        address: {
          addressId: addressState.addressId.value,
          addressType: addressState.addressType.value,
          city: addressState.city.value,
          complement: addressState.complement.value,
          country: addressState.country.value,
          receiverName: addressState.receiverName.value,
          geoCoordinates: addressState.geoCoordinates.value,
          neighborhood: addressState.neighborhood.value,
          number: addressState.number.value,
          postalCode: addressState.postalCode.value,
          reference: addressState.reference.value,
          state: addressState.state.value,
          street: addressState.street.value,
          addressQuery: addressState.addressQuery.value,
        },
        phoneNumber: formState.phoneNumber,
        businessDocument: formState.businessDocument,
        customFields: costCenterCustomFieldsState,
        stateRegistration: formState.stateRegistration,
      },
      customFields: orgCustomFieldsState,
    }

    createOrganizationRequest({
      variables: {
        input: organizationRequest,
      },
    })
      .then(response => {
        const statusRequest = response.data.createOrganizationRequest.status

        if (statusRequest === 'approved') {
          toastMessage(messages.toastApproved)
          setFormState({
            ...formState,
            isSubmitting: false,
          })
        } else {
          requestId = response.data.createOrganizationRequest.id
          localStore.setItem('b2b-organizations_orgRequestId', requestId)
          toastMessage(messages.toastSuccess)
          refetch({ id: requestId }).then(res => {
            if (
              res.data?.getOrganizationRequestById.status !== 'pending' &&
              sessionResponse.namespaces?.profile?.isAuthenticated?.value ===
              'true'
            ) {
              handleImpersonation()
            }
          })
          window.scrollTo({ top: 0, behavior: 'smooth' })
          setFormState({
            ...formState,
            isSubmitting: false,
            submitted: true,
          })
        }
      })
      .catch(error => {
        console.error(error)
        toastMessage(messages.toastFailure)
        setFormState({
          ...formState,
          isSubmitting: false,
        })
      })
  }

  if (!data) return null

  const handleCustomFieldChange = (setState: any, state: any, value: string, field: string) => {
    const newFields = [...state];

    const fieldIndex = newFields.findIndex(newField => newField.name === field);

    if (fieldIndex !== -1) {
      newFields[fieldIndex] = {
        name: field,
        type: 'text',
        value: value,
        useOnRegistration: true
      };
    } else {
      newFields.push({
        name: field,
        type: 'text',
        value: value,
        useOnRegistration: true
      });
    }
    setState(newFields);
  }

  const getCustomFieldValue = (fieldName: string, state: any) => {
    const value = state.find((field: { name: string }) => field.name === fieldName)

    return value?.value ?? ""
  }

  const renderIfSubmitted =
    formState.submitted &&
      existingRequestData?.getOrganizationRequestById?.status ? (
      <PageBlock>
        {existingRequestData.getOrganizationRequestById.status ===
          'pending' && (
            <Fragment>
              <div className="mb5">
                <Alert type="warning">
                  <FormattedMessage
                    id="store/b2b-organizations.request-new-organization.pending-request"
                    values={{
                      created: formatDate(
                        existingRequestData.getOrganizationRequestById.created,
                        {
                          day: 'numeric',
                          month: 'numeric',
                          year: 'numeric',
                        }
                      ),
                    }}
                  />
                </Alert>
              </div>
              <CreateNewOrganizationRequest
                onClick={handleNewOrganizationRequest}
              />
            </Fragment>
          )}
        {existingRequestData.getOrganizationRequestById.status ===
          'approved' && (
            <Fragment>
              <div className="mb5">
                <Alert type="success">
                  <FormattedMessage id="store/b2b-organizations.request-new-organization.approved-request" />
                </Alert>
              </div>
              <CreateNewOrganizationRequest
                onClick={handleNewOrganizationRequest}
              />
            </Fragment>
          )}
        {existingRequestData.getOrganizationRequestById.status ===
          'declined' && (
            <Fragment>
              <div className="mb5">
                <Alert type="error">
                  <FormattedMessage
                    id="store/b2b-organizations.request-new-organization.declined-request"
                    values={{
                      created: formatDate(
                        existingRequestData.getOrganizationRequestById.created,
                        {
                          day: 'numeric',
                          month: 'numeric',
                          year: 'numeric',
                        }
                      ),
                    }}
                  />
                </Alert>
              </div>
              <CreateNewOrganizationRequest
                onClick={handleNewOrganizationRequest}
              />
            </Fragment>
          )}
      </PageBlock>
    ) : (
      <Fragment>
        <PageBlock>
          <div
            className={`${handles.newOrganizationInput} mb5 flex flex-column`}
          >
            <div className={handles.newOrganizationSection}>
              <h3 className={handles.newOrganizationTitle}>
                {dadosCadastraisTitle}
              </h3>
              <span className={handles.newOrganizationSubTitle}>
                {dadosCadastraisSubTitle}
              </span>
              <div className={handles.newOrganizationRequired}>
                <Input
                  autocomplete="off"
                  size="large"
                  value={formState.businessDocument}
                  label="CNPJ"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormState({
                      ...formState,
                      businessDocument: e.target.value,
                    })
                  }}
                  placeholder="XX.XXX.XXX/0001-XX"
                  required
                />
              </div>
              <div className={handles.newOrganizationRow}>
                <div className={`${handles.newOrganizationRequired} w-100 mr5-ns`}>
                  <Input
                    autocomplete="off"
                    size="large"
                    label={translateMessage(messages.organizationName)}
                    value={formState.organizationName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFormState({
                        ...formState,
                        organizationName: e.target.value,
                      })
                    }}
                    required
                    placeholder="Digite aqui"
                  />
                </div>
                <div className={`${handles.newOrganizationRequired} w-100`}>
                  <Input
                    autocomplete="off"
                    size="large"
                    label={translateMessage(messages.tradeName)}
                    value={formState.tradeName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFormState({
                        ...formState,
                        tradeName: e.target.value,
                      })
                    }}
                    required
                    placeholder="Digite aqui"
                  />
                </div>
              </div>
              <div className={handles.newOrganizationRequired}>
                <Input
                  autocomplete="off"
                  size="large"
                  value={formState.stateRegistration}
                  label={translateMessage(messages.stateRegistration)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormState({
                      ...formState,
                      stateRegistration: e.target.value,
                    })
                  }}
                  required
                  placeholder="Digite aqui"
                />
              </div>
              <Input
                autocomplete="off"
                size="large"
                value={getCustomFieldValue("tare", orgCustomFieldsState)}
                label="Regime Especial (Tare)"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleCustomFieldChange(setOrgCustomFieldsState, orgCustomFieldsState, e.target.value, "tare")
                }}
                placeholder="Digite aqui"
              />
              <div className={handles.newOrganizationRequired}>
                <Input
                  autocomplete="off"
                  size="large"
                  value={getCustomFieldValue("emailNfe", orgCustomFieldsState)}
                  label="Email NF-e"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleCustomFieldChange(setOrgCustomFieldsState, orgCustomFieldsState, e.target.value, "emailNfe")
                  }}
                  placeholder="Digite aqui"
                />
              </div>
            </div>
            <div className={`${handles.newOrganizationSection} mt7-ns`}>
              <h3 className={handles.newOrganizationTitle}>
                {shippingTitle}
              </h3>
              <span className={handles.newOrganizationSubTitle}>
                {shippingSubTitle}
              </span>
              <div className={handles.newOrganizationRequired}>
                <Input
                  autocomplete="off"
                  size="large"
                  value={getCustomFieldValue("nameTransportadora", orgCustomFieldsState)}
                  label="Nome"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleCustomFieldChange(setOrgCustomFieldsState, orgCustomFieldsState, e.target.value, "nameTransportadora")
                  }}
                  required
                  placeholder="Digite aqui"
                />

                <Input
                  autocomplete="off"
                  size="large"
                  value={getCustomFieldValue("cnpjTransportadora", orgCustomFieldsState)}
                  label="CNPJ"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleCustomFieldChange(setOrgCustomFieldsState, orgCustomFieldsState, e.target.value, "cnpjTransportadora")
                  }}
                  placeholder="XX.XXX.XXX/0001-XX"
                  required
                />
              </div>
            </div>

            <div className={`${handles.newOrganizationSection} mt7-ns`}>
              <h3 className={handles.newOrganizationTitle}>
                {userAdminTitle}
              </h3>
              <span className={handles.newOrganizationSubTitle}>
                {userAdminSubTitle}
              </span>
              <div className={handles.newOrganizationRequired}>
                <div className={handles.newOrganizationRow}>
                  <div className={`${handles.newOrganizationRequired} w-100 mr5-ns`}>
                    <Input
                      size="large"
                      label={translateMessage(messages.firstName)}
                      value={formState.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFormState({
                          ...formState,
                          firstName: e.target.value,
                        })
                      }}
                      placeholder="Digite aqui"
                    />
                  </div>
                  <div className={`${handles.newOrganizationRequired} w-100 mr5-ns`}>
                    <Input
                      size="large"
                      label={translateMessage(messages.lastName)}
                      value={formState.lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFormState({
                          ...formState,
                          lastName: e.target.value,
                        })
                      }}
                      placeholder="Digite aqui"
                    />
                  </div>
                </div>
                <Input
                  size="large"
                  label={translateMessage(messages.email)}
                  value={formState.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormState({
                      ...formState,
                      email: e.target.value,
                    })
                  }}
                  placeholder="Digite aqui"
                />
              </div>
            </div>
          </div>
        </PageBlock>
        <PageBlock
          variation="full"
          title={translateMessage(messages.defaultCostCenter)}
          subtitle={translateMessage(messages.defaultCostCenterHelpText)}
        >
          <div
            className={`${handles.newOrganizationInput} mb5 flex flex-column`}
          >
            <h3 className={handles.newOrganizationTitle}>
              {addressTitle}
            </h3>
            <span className={handles.newOrganizationSubTitle}>
              {addressSubTitle}
            </span>
            <div
              className={`${handles.newOrganizationAddressForm} ${handles.newOrganizationRequired} mb5 flex flex-column`}
            >
              <AddressRules
                country={addressState?.country?.value}
                shouldUseIOFetching
                useGeolocation={false}
              >
                <AddressContainer
                  address={addressState}
                  Input={StyleguideInput}
                  onChangeAddress={handleAddressChange}
                  autoCompletePostalCode
                >
                  <div style={{ display: 'none' }}>
                    <CountrySelector shipsTo={translateCountries()} />
                  </div>

                  <div className={handles.newOrganizationRequired}>
                    <PostalCodeGetter />
                  </div>

                  <AddressForm
                    Input={StyleguideInput}
                    omitAutoCompletedFields={false}
                    omitPostalCodeFields
                  />
                </AddressContainer>
              </AddressRules>
            </div>
            <div
              className={`${handles.newOrganizationInput} mb5 ${handles.newOrganizationRow}`}
            >
              <div className='mr5-ns w-100'>
                <Input
                  autocomplete="off"
                  size="large"
                  label={translateMessage(messages.phoneNumber)}
                  value={formState.phoneNumber}
                  error={
                    formState.phoneNumber &&
                    !validatePhoneNumber(formState.phoneNumber)
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormState({
                      ...formState,
                      phoneNumber: e.target.value,
                    })
                  }}
                  placeholder="Digite aqui"
                />
              </div>
              <Input
                autocomplete="off"
                size="large"
                label='Ramal'
                value={getCustomFieldValue("ramal", costCenterCustomFieldsState)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleCustomFieldChange(setCostCenterCustomFieldsState, costCenterCustomFieldsState, e.target.value, "ramal")
                }}
                placeholder="Digite aqui"
              />
            </div>

            <h3 className={handles.newOrganizationTitle}>
              {contactTitle}
            </h3>
            <span className={handles.newOrganizationSubTitle}>
              {contactSubTitle}
            </span>
            <Dropdown
              label="Eu sou"
              size="large"
              options={[
                { value: 'Distribuidor', label: 'Distribuidor' },
                { value: 'Aplicador', label: 'Aplicador' },
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleCustomFieldChange(setCostCenterCustomFieldsState, costCenterCustomFieldsState, e.target.value, "euSouContato")
              }}
              value={getCustomFieldValue("euSouContato", costCenterCustomFieldsState)}
              placeholder="Selecione uma opção"
            />
            <div className={handles.newOrganizationRow}>
              <div className={`${handles.newOrganizationRequired} w-100 mr5-ns`}>
                <Input
                  autocomplete="off"
                  size="large"
                  value={getCustomFieldValue("nameContato", orgCustomFieldsState)}
                  label="Nome"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleCustomFieldChange(setOrgCustomFieldsState, orgCustomFieldsState, e.target.value, "nameContato"),
                      setFormState({
                        ...formState,
                        defaultCostCenterName: e.target.value,
                      })
                    addressState.receiverName = {
                      'geolocationAutoCompleted': undefined,
                      'postalCodeAutoCompleted': undefined,
                      'reason': undefined,
                      'valid': true,
                      'value': e.target.value,
                      'visited': true
                    }
                  }}
                  required
                  placeholder="Digite aqui"
                />
              </div>
              <div className={`${handles.newOrganizationRequired} w-100 mr5-ns`}>
                <Input
                  autocomplete="off"
                  size="large"
                  value={getCustomFieldValue("lastNameContato", orgCustomFieldsState)}
                  label="Sobrenome"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleCustomFieldChange(setOrgCustomFieldsState, orgCustomFieldsState, e.target.value, "lastNameContato")
                  }}
                  required
                  placeholder="Digite aqui"
                />
              </div>
            </div>
            <div className={`${handles.textArea}`}>
              <Input
                autocomplete="off"
                size="large"
                value={getCustomFieldValue("observacoesContato", costCenterCustomFieldsState)}
                label="Observações"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleCustomFieldChange(setCostCenterCustomFieldsState, costCenterCustomFieldsState, e.target.value, "observacoesContato")
                }}
                required
                placeholder="Digite aqui suas observações"
              />
            </div>
            <Checkbox
              checked={getCustomFieldValue("receiveOffers", orgCustomFieldsState) === 'true'}
              label="Desejo receber boletins com ofertas, promoções e informações da Universal Automotive"
              onChange={() => {
                handleCustomFieldChange(setOrgCustomFieldsState, orgCustomFieldsState, getCustomFieldValue("receiveOffers", orgCustomFieldsState) === 'true' ? 'false' : 'true', "receiveOffers")
              }}
              value={getCustomFieldValue("receiveOffers", orgCustomFieldsState) === 'true'}
            />
          </div>
          <div
            className={`${handles.newOrganizationButtonsContainer} mb5 flex flex-column items-end pt6`}
          >
            <div className="flex justify-content flex-row">
              <div className={`no-wrap ${handles.newOrganizationButtonSubmit}`}>
                <Button
                  variation="primary"
                  isLoading={formState.isSubmitting}
                  onClick={() => {
                    handleSubmit()
                  }}
                  disabled={
                    !formState.organizationName ||
                    !formState.defaultCostCenterName ||
                    !formState.firstName ||
                    !formState.lastName ||
                    !formState.businessDocument ||
                    !formState.tradeName ||
                    !formState.email ||
                    !validateEmail(formState.email) ||
                    !isValidAddress(addressState) ||
                    (formState.phoneNumber &&
                      !validatePhoneNumber(formState.phoneNumber)) ||
                    !formState.stateRegistration ||
                    !getCustomFieldValue("emailNfe", orgCustomFieldsState) ||
                    !getCustomFieldValue("nameTransportadora", orgCustomFieldsState) ||
                    !getCustomFieldValue("cnpjTransportadora", orgCustomFieldsState) ||
                    !getCustomFieldValue("euSouContato", costCenterCustomFieldsState) ||
                    !getCustomFieldValue("lastNameContato", orgCustomFieldsState) ||
                    !getCustomFieldValue("nameContato", orgCustomFieldsState)
                  }
                >
                  <FormattedMessage id="store/b2b-organizations.request-new-organization.submit-button.label" />
                </Button>
              </div>
            </div>
          </div>
        </PageBlock>
      </Fragment>
    )

  const renderIfAuthenticated = !isAuthenticated ? (
    <PageBlock>
      <div>
        <FormattedMessage id="store/b2b-organizations.not-authenticated" />
      </div>
    </PageBlock>
  ) : (
    renderIfSubmitted
  )

  return (
    <div className={`${handles.newOrganizationContainer} pv6 ph4 mw9 center`}>
      <Layout
        fullWidth
        pageHeader={
          <PageHeader
            title={translateMessage(messages.pageTitle)}
            subtitle={translateMessage(messages.helpText)}
          />
        }
      >
        {loading ? (
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <Spinner size={40} />
          </span>
        ) : (
          <Fragment>{renderIfAuthenticated}</Fragment>
        )}
      </Layout>
    </div>
  )
}

export default RequestOrganizationForm

RequestOrganizationForm.schema = {
  title: 'Formulário de Organização',
  "type": "object",
  "properties": {
    "dadosCadastraisTitle": {
      "title": "Título da seção Dados cadastrais",
      "type": "string",
      "default": "Dados cadastrais"
    },
    "dadosCadastraisSubTitle": {
      "title": "Subtítulo da seção Dados cadastrais",
      "type": "string",
      "default": "Lorem ipsum dolor sit amet consectetur. Tristique sit sagittis augue tellus nunc sem platea cursus."
    },
    "shippingTitle": {
      "title": "Título da seção informações de sua transportadora",
      "type": "string",
      "default": "Informações de sua transportadora conveniada"
    },
    "shippingSubTitle": {
      "title": "Subtítulo da seção informações de sua transportadora",
      "type": "string",
      "default": "Lorem ipsum dolor sit amet consectetur. Tristique sit sagittis augue tellus nunc sem platea cursus."
    },
    "userAdminTitle": {
      "title": "Título da seção Usuário admin",
      "type": "string",
      "default": "Informações de sua transportadora conveniada"
    },
    "userAdminSubTitle": {
      "title": "Subtítulo da seção Dados cadastrais Dados cadastrais",
      "type": "string",
      "default": "O usuário abaixo será designado como o Admin da nova organização. Ele será notificado por email quando a organização for aprovada e criada. Usuários adicionais poderão ser designados à organização por este usuário depois que a organização for criada."
    },
    "addressTitle": {
      "title": "Título da seção de Endereços",
      "type": "string",
      "default": "Informações de sua transportadora conveniada"
    },
    "addressSubTitle": {
      "title": "Subtítulo da seção de Endereços",
      "type": "string",
      "default": "O usuário abaixo será designado como o Admin da nova organização. Ele será notificado por email quando a organização for aprovada e criada. Usuários adicionais poderão ser designados à organização por este usuário depois que a organização for criada."
    },
    "contactTitle": {
      "title": "Título da seção de contato",
      "type": "string",
      "default": "Informações de sua transportadora conveniada"
    },
    "contactSubTitle": {
      "title": "Subtítulo da seção de contato",
      "type": "string",
      "default": "O usuário abaixo será designado como o Admin da nova organização. Ele será notificado por email quando a organização for aprovada e criada. Usuários adicionais poderão ser designados à organização por este usuário depois que a organização for criada."
    }
  }
}
