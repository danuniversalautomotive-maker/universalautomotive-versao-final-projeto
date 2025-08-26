interface APIEntitiesRetunProps {
  name: string
}

type OrderOptions = 'ASC' | 'DESC'

export function ordination(
  data?: APIEntitiesRetunProps[],
  order: OrderOptions = 'ASC'
) {
  const _order = order === 'ASC' ? 1 : -1

  const sortedArray = data?.sort((current, next) => {
    if (current.name < next.name) {
      return -_order
    }

    if (current.name > next.name) {
      return _order
    }

    return 0
  })

  return sortedArray
}
