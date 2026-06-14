'use client'

interface PasswordStrengthProps {
  password: string
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (p: string) => {
    let score = 0
    if (p.length >= 8) score++
    if (p.length >= 12) score++
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  }

  const strength = getStrength(password)
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', '#EF4444', '#F97316', '#EAB308', '#22C55E']

  if (!password) return null

  return (
    <div style={{ marginTop: 8, marginBottom: 4 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 999,
              background: i <= strength ? colors[strength] : '#E5E7EB',
              transition: 'background-color 200ms ease',
            }}
          />
        ))}
      </div>
      {strength > 0 && (
        <p style={{ fontSize: 12, color: colors[strength], fontWeight: 500 }}>
          {labels[strength]}
        </p>
      )}
    </div>
  )
}
