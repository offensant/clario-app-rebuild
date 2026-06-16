'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

interface BusinessProfile {
  workspace_id: string
  business_type: 'agency' | 'ecommerce'
  mrr: number
  active_clients: number
  goal_90d: number
}

interface Workspace {
  id: string
  name: string
  slug: string
}

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
}

interface WorkspaceContextType {
  workspace: Workspace | null
  businessProfile: BusinessProfile | null
  user: UserProfile | null
  loading: boolean
  refetchUser: () => Promise<void>
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  workspace: null,
  businessProfile: null,
  user: null,
  loading: true,
  refetchUser: async () => {},
})

export function useWorkspace() {
  return useContext(WorkspaceContext)
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async (userId: string) => {
    const { data } = await supabase.from('users').select('*').eq('id', userId).single()
    if (data) setUser(data)
  }

  useEffect(() => {
    const load = async () => {
      const { data: authData } = await supabase.auth.getUser()
      const userId = authData.user?.id
      if (!userId) { setLoading(false); return }

      await fetchUser(userId)

      const { data: memberRow } = await supabase
        .from('workspace_members')
        .select('workspace_id, workspaces(id, name, slug)')
        .eq('user_id', userId)
        .single()

      if (memberRow?.workspace_id) {
        const ws = memberRow.workspaces as any
        setWorkspace({ id: ws.id, name: ws.name, slug: ws.slug })

        const { data: profile } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('workspace_id', memberRow.workspace_id)
          .single()

        if (profile) setBusinessProfile(profile)
      }

      setLoading(false)
    }

    load()
  }, [])

  return (
    <WorkspaceContext.Provider value={{
      workspace,
      businessProfile,
      user,
      loading,
      refetchUser: async () => { if (user) await fetchUser(user.id) },
    }}>
      {children}
    </WorkspaceContext.Provider>
  )
}
