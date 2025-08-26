export default function IsSqlInjectionSafe(value: string): boolean {
  const blackList = [' LIKE ', ' OR ', ' AND ', '*', '(', ')', '=']

  const invalid = blackList.filter((val) => {
    return value.includes(val)
  })

  return invalid.length == 0
}
