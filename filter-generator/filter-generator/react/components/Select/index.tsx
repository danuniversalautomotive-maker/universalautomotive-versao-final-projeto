/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

import IconArrow from '../../icons/IconArrow'
import type { Option } from '../../interfaces'
import IconCheck from '../../icons/IconCheck'
import IconCheckComplete from '../../icons/IconCheckComplete'

import './style.css'

export const CSS_HANDLES = [
  'filterSelectContainer',
  'ContainerDropdonw',
  'itemSelect',
  'optionsSelect',
  'OptionsDropdonw',
  'optionsNotSelect',
  'optionsSelectWrapper',
  'ContainerSelect',
] as const

interface SelectProps {
  placeholder?: string
  options?: Option[]
  selected: Option | null
  onChange: (selection: Option) => void
  loading?: boolean
}

const Select: React.FC<SelectProps> = ({
  placeholder,
  selected,
  options,
  onChange,
  loading = false,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const [showOptions, setShowOptions] = useState(false)

  function handleClickShowOptions() {
    setShowOptions((prevState) => !prevState)
  }

  return (
    <div className={handles.ContainerSelect}>
      <div
        className={applyModifiers(
          handles.filterSelectContainer,
          loading ? 'loading' : ''
        )}
      >
        <div
          className={handles.ContainerDropdonw}
          onClick={handleClickShowOptions}
        >
          <div className={handles.itemSelect}>
            {selected ? selected.name : placeholder}
            <IconArrow />
          </div>
        </div>
        {options && (
          <>
            {showOptions && (
              <div className={handles.optionsSelectWrapper}>
                <div className={handles.optionsSelect}>
                  {options.map((option) => (
                    <div
                      className={handles.OptionsDropdonw}
                      onClick={() => {
                        onChange(option)
                        setShowOptions(false)
                      }}
                      key={option.name}
                    >
                      <div className={handles.optionsNotSelect}>
                        {option.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selected ? <IconCheckComplete /> : options && <IconCheck />}
    </div>
  )
}

export default Select
