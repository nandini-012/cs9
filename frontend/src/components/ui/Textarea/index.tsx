import React from 'react'
import './Textarea.css'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  hint?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, hint, className = '', ...props }, ref) => {
    return (
      <div className="textarea-wrapper">
        <textarea
          ref={ref}
          className={`textarea-field ${error ? 'textarea-error' : ''} ${className}`}
          {...props}
        />
        {hint && <span className={`textarea-hint ${error ? 'hint-error' : ''}`}>{hint}</span>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export default Textarea