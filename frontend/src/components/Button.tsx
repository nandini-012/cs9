import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline-primary' | 'outline-secondary' | 'widget-link' | 'cancel' | 'modal-submit';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  [key: string]: unknown;
}

export default function Button({ children, variant = 'primary', type = 'button', onClick, disabled, className = '', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-unified btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}