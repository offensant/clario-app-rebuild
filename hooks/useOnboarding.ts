'use client'

import { useState, useEffect } from 'react'

export interface OnboardingData {
  business_type?: 'agency' | 'ecommerce'
  business_name?: string
  mrr?: number
  active_clients?: number
  top_client_share?: number
  active_customers?: number
  repeat_purchase_rate?: number
  active_pipeline?: number
  clients_lost_60d?: number
  cac?: number
  roas?: number
  goal_90d?: number
}

const STORAGE_KEY = 'clario_onboarding'

export function useOnboarding() {
  const [data, setData] = useState<OnboardingData>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try { setData(JSON.parse(stored)) } catch { /* ignore malformed data */ }
    }
    setLoaded(true)
  }, [])

  const updateData = (updates: Partial<OnboardingData>) => {
    const newData = { ...data, ...updates }
    setData(newData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
  }

  const clearData = () => {
    localStorage.removeItem(STORAGE_KEY)
    setData({})
  }

  return { data, updateData, clearData, loaded }
}
