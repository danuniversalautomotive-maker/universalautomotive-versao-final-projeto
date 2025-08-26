import { ApplicationTableResponse } from "../FilterGenerator"

export default function getYearList(list: ApplicationTableResponse) {

  const getYear = (datetime: Date) => {
    if (!datetime) return 0
    return new Date(datetime)?.getFullYear()
  }

  const parsedInterval = list.map(({dateFrom, dateUntil}) => {
    return {
      from: dateFrom ? getYear(dateFrom) : null,
      until: dateUntil ?getYear(dateUntil) : null,
    }
  }).filter(i => i.from !== null || i.until !== null)

  const years = new Set<number>()

  parsedInterval.forEach(({from, until}) => {
    if (!until && from) years.add(from)
    if (!from && until) years.add(until)


    if (until && from) {
      const min = Math.min(from, until)
      const max = Math.max(from, until)

      for (let y = min; y <= max; y++) {
        years.add(y);
      }
    }
  })

  const sorted = [...years].sort((a, b) => a - b)
  return sorted
}
