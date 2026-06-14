'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface FormInputProps {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  showPasswordToggle?: boolean
  autoFocus?: boolean
}

export default function FormInput({
  label, type = 'text', placeholder, value, onChange,
  error, showPasswordToggle = false, autoFocus = false,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type

  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 500,
          color: '#374151',
          marginBottom: 6,
        }}
        className="dark:text-gray-300"
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          className="glass-input"
          style={{
            paddingRight: showPasswordToggle ? 44 : 16,
            borderColor: error ? '#EF4444' : undefined,
            boxShadow: error ? '0 0 0 3px rgba(239,68,68,0.12)' : undefined,
          }}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9CA3AF',
              display: 'flex',
              padding: 0,
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p style={{ fontSize: 12, color: '#EF4444', marginTop: 6 }}>{error}</p>
      )}
    </div>
  )
}
