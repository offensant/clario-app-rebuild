'use client'

interface OnboardingInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  prefix?: string
  suffix?: string
  type?: string
  autoFocus?: boolean
}

export default function OnboardingInput({ label, value, onChange, placeholder, prefix, suffix, type = 'text', autoFocus = false }: OnboardingInputProps) {
  return (
    <div style={{ marginBottom: 16, width: '100%', maxWidth: 420 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {prefix && (
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: 18, pointerEvents: 'none' }}>
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '14px 16px',
            paddingLeft: prefix ? 32 : 16,
            paddingRight: suffix ? 36 : 16,
            fontSize: 18,
            color: '#FFFFFF',
            outline: 'none',
            transition: 'border-color 150ms ease, box-shadow 150ms ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#F97316'
            e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.1)'
            e.target.style.boxShadow = 'none'
          }}
        />
        {suffix && (
          <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: 16, pointerEvents: 'none' }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}
