import React from 'react'
import './Badge.css'

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'
  size?: 'sm' | 'md'
  children: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
}) => (
  <span className={`badge badge-${variant} badge-${size} ${className}`}>
    {children}
  </span>
)

export default Badge