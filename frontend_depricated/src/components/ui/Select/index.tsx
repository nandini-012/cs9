import React from 'react'
import './Select.css'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  hint?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, hint, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="select-wrapper">
        <select
          ref={ref}
          className={`select-field ${error ? 'select-error' : ''} ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {hint && <span className={`select-hint ${error ? 'hint-error' : ''}`}>{hint}</span>}
      </div>
    )
  }
)

Select.displayName = 'Select'
export default Select