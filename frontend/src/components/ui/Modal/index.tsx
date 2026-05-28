import React from 'react'
import './Modal.css'

export interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  width?: string
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, children, width = '440px' }) => {
  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal