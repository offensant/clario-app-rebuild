'use client'

import ClarioLogo from '@/components/ClarioLogo'
import ThemeToggle from '@/components/ThemeToggle'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-bg" style={{ minHeight: '100vh', position: 'relative' }}>

      {/* CLARIO LOGO — FIXED TOP LEFT */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        padding: '20px 24px',
        zIndex: 50,
      }}>
        <ClarioLogo size="md" />
      </div>

      {/* THEME TOGGLE — FIXED TOP RIGHT */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        padding: '20px 24px',
        zIndex: 50,
      }}>
        <ThemeToggle />
      </div>

      {/* CENTERED CONTENT */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 40px',
      }}>
        {children}
      </div>
    </div>
  )
}
