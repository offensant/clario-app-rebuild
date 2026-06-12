'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface ClarioLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function ClarioLogo({ size = 'md', showText = true, className = '' }: ClarioLogoProps) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  useEffect(() => setMounted(true), [])

  const iconSizes = { sm: 22, md: 28, lg: 36 }
  const textSizes = { sm: '16px', md: '20px', lg: '24px' }
  const iconSize = iconSizes[size]
  const textColor = mounted && resolvedTheme === 'dark' ? '#FFFFFF' : '#0A0A0A'

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'none',
        border: 'none',
        boxShadow: 'none',
        padding: 0,
        margin: 0,
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 2L24 8V20L14 26L4 20V8L14 2Z"
          stroke="#F97316"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 8L19 11V17L14 20L9 17V11L14 8Z"
          fill="#F97316"
          fillOpacity="0.15"
          stroke="#F97316"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="14" r="2" fill="#F97316" />
      </svg>
      {showText && (
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: textSizes[size],
            fontWeight: 700,
            color: textColor,
            letterSpacing: '-0.3px',
            background: 'none',
            userSelect: 'none',
          }}
        >
          Clario
        </span>
      )}
    </div>
  )
}
