export type Option = {
  value: string
  key: string
  name: string
}

export type Facet = {
  name: string
  values: FacetValues[]
}

export type FacetValues = {
  name: string
  key: string
}
