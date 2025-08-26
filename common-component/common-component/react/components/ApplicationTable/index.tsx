import React, { useEffect, useState } from 'react'
import { useProduct } from 'vtex.product-context'
import styles from './styles.css'

interface TableInformation {
  assembler: string;
  category: string;
  dateFrom: string | null;
  dateUntil: string | null;
  fase: string;
  models: string;
}
export function ApplicationTable() {
  const [tableInformation, setTableInformation] = useState<TableInformation[]>([])
  const { selectedItem } = useProduct() ?? {}

  const getTableInformation = async (skuId: string) => {
    const response = await fetch(`/api/dataentities/AT/search?skuId=${skuId}&_fields=assembler,category,dateFrom,dateUntil,fase,models`)
    const resp = await response.json()
    setTableInformation(resp)
  }

  const formatDate = (isoDate: string | null): string => {
    if (!isoDate) return ''
    const [year, month, day] = isoDate.split('T')[0].split('-')

    return `${day}/${month}/${year}`
  }

  useEffect(() => {
    if (selectedItem && selectedItem.itemId) {
      getTableInformation(selectedItem.itemId)
    }
  }, [selectedItem])

  if (tableInformation.length == 0) {
    return <></>
  }

  return (
    <div>
      <h3 className={styles.applicationTableTitle}>Tabela de Aplicação</h3>
      <table className={styles.applicationTable}>
        <thead className={styles.applicationTableHead}>
          <tr>
            <th className={styles.applicationTableSpecificationName}>
              Montadora:
            </th>
            <th className={styles.applicationTableSpecificationName}>
              Modelo:
            </th>
            <th className={styles.applicationTableSpecificationName}>
              Versão:
            </th>
            <th className={styles.applicationTableSpecificationName}>
              Geração:
            </th>
            <th className={styles.applicationTableSpecificationName}>
              De ano:
            </th>
            <th className={styles.applicationTableSpecificationName}>
              Até ano:
            </th>
          </tr>
        </thead>
        <tbody
          className={styles.applicationTableBody}
        >
          {tableInformation.map((info) => (
            <tr className={styles.applicationTableTR}>
              <td>{info.assembler}</td>
              <td>{info.models}</td>
              <td>{info.fase}</td>
              <td>{info.category}</td>
              <td>{formatDate(info.dateFrom)}</td>
              <td>{formatDate(info.dateUntil)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
