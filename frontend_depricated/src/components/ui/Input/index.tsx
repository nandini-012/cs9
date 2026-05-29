import React from 'react'
import './Input.css'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, hint, className = '', ...props }, ref) => {
    return (
      <div className="input-wrapper">
        <input
          ref={ref}
          className={`input-field ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
        {hint && <span className={`input-hint ${error ? 'hint-error' : ''}`}>{hint}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input