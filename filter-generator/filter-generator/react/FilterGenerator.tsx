/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import type { MouseEventHandler } from 'react'
import { useLazyQuery } from 'react-apollo'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'
import { useRuntime, Loading, NoSSR } from 'vtex.render-runtime'

import Select from './components/Select'
import type { Facet, Option } from './interfaces'
import FACETS from './graphql/facets.gql'
import './styles.css'
import './fonts.global.css'
import { ordination } from './utils/ordination'
import IconArrow from './icons/IconArrow'
import getYearList from './utils/getYearList'

export const CSS_HANDLES = [
  'filterGeneratorContainer',
  'filterSelector',
  'filterGeneratorButton',
  'filterGeneratorLink',
  'selectTooltip',
  'selectTooltipText',
  'filterStickyWrapper',
  'loadingCcontainer',
  'loading',
] as const

interface ApplicationTableResponseItem {
  assembler: string
  models: string
  dateFrom: Date
  dateUntil: Date
}

export type ApplicationTableResponse = ApplicationTableResponseItem[]

const FilterGenerator = () => {
  const { navigate, route } = useRuntime()
  const { params, queryString } = route

  const keysArray = queryString?.map?.split(',') as string[] | undefined
  const getValueByIndex = (index: number) => {
    return params[Object.keys(params)[index + 1]]
  }

  const defaultValues = keysArray?.reduce(
    (
      acc: Record<string, Option>,
      curr: string,
      index: number
    ): Record<string, Option> => {
      acc[curr] = {
        key: curr,
        value: getValueByIndex(index),
        name: curr,
      }

      return acc
    },
    {}
  )

  const handles = useCssHandles(CSS_HANDLES)
  const [selectedAutomaker, setSelectedAutomaker] = useState<Option | null>(defaultValues?.montadora ?? null)
  const [selectedModel, setSelectedModel] = useState<Option | null>(defaultValues?.modelo ?? null)
  const [selectedYear, setSelectedYear] = useState<Option | null>(defaultValues?.ano ?? null)
  const [optionsAutomaker, setOptionsMontadora] = useState<Option[]>()
  const [optionsModel, setOptionsModel] = useState<Option[]>()
  const [optionsYear, setOptionsYear] = useState<Option[]>()
  const [message, setMessage] = useState(false)

  const [
    callfacetsQuery,
    { data: facetData, loading: facetLoading, error: facetError },
  ] = useLazyQuery<{ facets: { facets: Facet[] } }>(FACETS, {
    ssr: true,
  })

  const getApplicationTableFromMasterData = async (assembler: string, models?: string) => {
    const queryString = models ? `assembler=${assembler}&models=${models}` : `assembler=${assembler}`

    try {
      const response: ApplicationTableResponse = await fetch(`/_v/application-table?${queryString}`).then((res) => res.json())
      return response
    } catch (e) {
      console.error('Error: ', e?.message)
      return []
    }
  }

  useEffect(() => {
    if (selectedAutomaker) {
      callfacetsQuery({
        variables: {
          fullText: selectedAutomaker?.value,
        },
      })

      const getModelsFromAssembler = async () => {
        const assembler = selectedAutomaker?.name
        const data = await getApplicationTableFromMasterData(assembler)
        const uniqueModels = await Array.from(new Set(data?.map(i => i?.models)))

        const models = uniqueModels?.map(model => {
          return {
            key: 'modelo',
            value: model,
            name: model,
          }
        })

        setOptionsModel(models)
      }

      getModelsFromAssembler();
      return
    }

    callfacetsQuery({
      variables: {
        fullText: "fiat" // gambiarra para pegar valor inicial do dropdown montadora
      },
    })
  }, [selectedAutomaker, callfacetsQuery])

  useEffect(() => {
    if (!facetData) {
      return
    }

    const montadoraData = facetData.facets.facets
      .find((facet) => facet.name.toLowerCase() === 'montadora')
      ?.values.map((value) => ({
        value: value.name,
        key: value.key,
        name: value.name,
      }))

    if (!montadoraData) {
      setOptionsMontadora(undefined)
      return
    }

    setOptionsMontadora(montadoraData)
  }, [facetData])

  useEffect(() => {
    if (!facetData || !selectedAutomaker) {
      return
    }

    const modeloData = facetData.facets.facets
      .find((facet) => facet.name.toLowerCase() === 'modelo')
      ?.values.map((value) => ({
        value: value.name,
        key: value.key,
        name: value.name,
      }))

    if (!modeloData) {
      setOptionsModel(undefined)
      return
    }

    setOptionsModel(modeloData)
  }, [selectedAutomaker, facetData])

  useEffect(() => {
    if (!facetData || !selectedModel) {
      return
    }

    const getYearsFromModels = async () => {
      const assembler = selectedAutomaker?.name ?? ""
      const model = selectedModel?.name
      const data = await getApplicationTableFromMasterData(assembler, model)
      const yearList = getYearList(data)

      const yearsData = yearList?.map((year: number) => {
        return {
          key: 'ano',
          value: year?.toString(),
          name: year?.toString(),
        }
      })

      setOptionsYear(yearsData)
    }

    getYearsFromModels()
  }, [selectedModel, facetData])

  const filterURl =
    selectedYear?.name ?
      `/${selectedAutomaker?.name}/${selectedModel?.name}/${selectedYear?.name}?map=montadora,modelo,ano` :
      `/${selectedAutomaker?.name}/${selectedModel?.name}?map=montadora,modelo`

  const isLoading = facetLoading

  const handleFilter: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()

    setMessage(true)

    setTimeout(() => {
      navigate({
        to: filterURl,
      })
    }, 1000)
  }

  if (facetError) {
    console.error(facetError)

    return null
  }

  const tooltipManufaturer = () => {
    if (selectedModel) {
      return
    }

    return (
      <div className={`${handles.selectTooltip} t-body`}>
        <div className={`${handles.selectTooltipText} t-body `}>
          Selecione o anterior
        </div>
      </div>
    )
  }

  const tooltipModel = () => {
    if (selectedAutomaker) {
      return
    }

    return (
      <div className={`${handles.selectTooltip} t-body`}>
        <div className={`${handles.selectTooltipText} t-body `}>
          Selecione o anterior
        </div>
      </div>
    )
  }

  return (
    <NoSSR onSSR={<Loading />}>
      <div id="fixElement" style={{ padding: '0px' }}>
        <div className={handles.filterStickyWrapper}>
          <div
            className={applyModifiers(
              handles.filterGeneratorContainer,
              defaultValues ? 'category' : ''
            )}
          >
            {message ? (
              <div className={handles.loadingCcontainer}>
                <div className={handles.loading} />

                <p>Pesquisando...</p>
              </div>
            ) : (
              <>
                <div className={handles.filterSelector}>
                  <p>Montadora:</p>

                  <Select
                    placeholder="Escolha uma Montadora"
                    selected={selectedAutomaker}
                    options={
                      ordination(optionsAutomaker, 'ASC') as unknown as Option[]
                    }
                    onChange={(selection: Option) => {
                      setSelectedAutomaker(selection)
                      setSelectedModel(null)
                      setSelectedYear(null)
                    }}
                    loading={isLoading}
                  />
                  {/*{tooltipManufaturer()}*/}
                </div>

                <div className={handles.filterSelector}>
                  <p>Modelo:</p>

                  <Select
                    placeholder="Escolha um Modelo"
                    selected={selectedModel}
                    options={
                      ordination(optionsModel, 'ASC') as unknown as Option[]
                    }
                    onChange={(selection: Option) =>
                      setSelectedModel(selection)
                    }
                    loading={isLoading}
                  />
                  {tooltipModel()}
                </div>

                <div className={handles.filterSelector}>
                  <p>Ano:</p>

                  <Select
                    placeholder="Escolha um Ano"
                    selected={selectedYear}
                    options={
                      ordination(optionsYear, 'ASC') as unknown as Option[]
                    }
                    onChange={(selection: Option) => setSelectedYear(selection)}
                    loading={isLoading}
                  />
                  {tooltipManufaturer()}
                </div>

                <button
                  disabled={!selectedAutomaker || !selectedModel}
                  className={handles.filterGeneratorButton}
                  onClick={(e) => handleFilter(e)}
                >
                  Buscar peças
                  <IconArrow />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </NoSSR>
  )
}

export default FilterGenerator
