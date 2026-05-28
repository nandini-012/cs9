interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'outline-primary' | 'outline-secondary' | 'widget-link' | 'cancel' | 'modal-submit'
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  className?: string
  [key: string]: unknown
}

const VARIANT_CLASS: Record<string, string> = {
  primary:
    'inline-flex items-center justify-center gap-2 font-sans text-[0.82rem] font-bold uppercase tracking-wide rounded-lg cursor-pointer border-none h-9 px-5 bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-md transition-all duration-200 hover:from-slate-700 hover:to-slate-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
  'outline-primary':
    'inline-flex items-center justify-center gap-2 font-sans text-[0.82rem] font-bold uppercase tracking-wide rounded-lg cursor-pointer border-2 border-blue-900 bg-white text-blue-900 transition-all duration-200 hover:bg-blue-50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  'outline-secondary':
    'inline-flex items-center justify-center gap-2 font-sans text-[0.82rem] font-bold uppercase tracking-wide rounded-lg cursor-pointer border-2 border-slate-900 bg-white text-slate-900 transition-all duration-200 hover:bg-slate-50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  'widget-link':
    'w-full inline-flex items-center justify-center gap-2 font-sans text-[0.82rem] font-bold uppercase tracking-wide rounded-lg cursor-pointer border-2 border-slate-900 bg-white text-slate-900 h-9 transition-all duration-200 hover:bg-slate-50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  cancel:
    'inline-flex items-center justify-center gap-2 font-sans text-[0.82rem] font-bold uppercase tracking-wide rounded-lg cursor-pointer border border-slate-900/10 bg-transparent text-slate-500 transition-all duration-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed',
  'modal-submit':
    'w-full inline-flex items-center justify-center gap-2 font-sans text-[0.82rem] font-bold uppercase tracking-wide rounded-lg cursor-pointer border-none h-[42px] px-5 bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-md transition-all duration-200 hover:from-slate-700 hover:to-slate-800 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
}

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}