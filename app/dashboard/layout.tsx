'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Zap, TrendingUp, Users, BarChart2, Clock,
  MessageCircle, Settings, ChevronDown, Target
} from 'lucide-react'
import ClarioLogo from '@/components/ClarioLogo'
import ThemeToggle from '@/components/ThemeToggle'
import { WorkspaceProvider, useWorkspace } from '@/context/WorkspaceContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <DashboardShell>{children}</DashboardShell>
    </WorkspaceProvider>
  )
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { workspace, businessProfile, user, loading } = useWorkspace()

  const isAgency = businessProfile?.business_type !== 'ecommerce'

  const navItems = isAgency
    ? [
        { href: '/dashboard', label: 'Today', icon: Zap },
        { href: '/dashboard/intelligence', label: 'Intelligence', icon: TrendingUp },
        { href: '/dashboard/pipeline', label: 'Pipeline', icon: Users },
        { href: '/dashboard/revenue', label: 'Revenue', icon: BarChart2 },
        { href: '/dashboard/timeline', label: 'Timeline', icon: Clock },
        { href: '/dashboard/axo', label: 'Axo', icon: MessageCircle },
      ]
    : [
        { href: '/dashboard', label: 'Today', icon: Zap },
        { href: '/dashboard/intelligence', label: 'Intelligence', icon: TrendingUp },
        { href: '/dashboard/acquisition', label: 'Acquisition', icon: Target },
        { href: '/dashboard/revenue', label: 'Revenue', icon: BarChart2 },
        { href: '/dashboard/timeline', label: 'Timeline', icon: Clock },
        { href: '/dashboard/axo', label: 'Axo', icon: MessageCircle },
      ]

  const pageTitles: Record<string, string> = {
    '/dashboard': 'Today',
    '/dashboard/intelligence': 'Intelligence',
    '/dashboard/pipeline': 'Pipeline',
    '/dashboard/acquisition': 'Acquisition',
    '/dashboard/revenue': 'Revenue',
    '/dashboard/timeline': 'Timeline',
    '/dashboard/axo': 'Axo',
  }
  const pageTitle = pathname.startsWith('/dashboard/settings') ? 'Settings' : (pageTitles[pathname] || 'Today')

  const getInitials = (name?: string) => {
    if (!name) return '?'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return (
    <div className="page-bg flex" style={{ minHeight: '100vh' }}>
      {/* ========== SIDEBAR ========== */}
      <aside
        className="glass-sidebar"
        style={{
          width: 248,
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 40,
        }}
      >
        {/* LOGO — NO background — NO box — flush */}
        <div style={{ padding: '20px 16px 0' }}>
          <ClarioLogo size="md" />
        </div>

        {/* NAV */}
        <nav style={{ padding: '24px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard' || pathname === '/dashboard/'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  color: isActive ? '#F97316' : '#6B7280',
                  background: isActive ? 'rgba(249,115,22,0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid #F97316' : '2px solid transparent',
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'all 150ms ease',
                }}
              >
                <Icon size={20} color={isActive ? '#F97316' : '#9CA3AF'} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* SETTINGS + USER */}
        <div style={{ padding: '0 12px 20px' }}>
          <Link
            href="/dashboard/settings"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 10,
              textDecoration: 'none',
              color: pathname.startsWith('/dashboard/settings') ? '#F97316' : '#6B7280',
              background: pathname.startsWith('/dashboard/settings') ? 'rgba(249,115,22,0.08)' : 'transparent',
              borderLeft: pathname.startsWith('/dashboard/settings') ? '2px solid #F97316' : '2px solid transparent',
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            <Settings size={20} color={pathname.startsWith('/dashboard/settings') ? '#F97316' : '#9CA3AF'} />
            Settings
          </Link>

          {/* USER ROW */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 4px',
              cursor: 'pointer',
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 600,
                color: '#374151',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getInitials(user?.full_name)
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                className="text-[#0A0A0A] dark:text-white"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.full_name || 'Loading...'}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#9CA3AF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.email || ''}
              </div>
            </div>
            <ChevronDown size={16} color="#9CA3AF" />
          </div>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <div style={{ marginLeft: 248, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* TOPBAR */}
        <header
          className="glass-topbar"
          style={{
            height: 60,
            position: 'sticky',
            top: 0,
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <span
            className="text-[#0A0A0A] dark:text-white"
            style={{ fontSize: 18, fontWeight: 600 }}
          >
            {pageTitle}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ThemeToggle />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ flex: 1, padding: 24 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
