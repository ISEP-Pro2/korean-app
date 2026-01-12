'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { db, initializeDatabase, getSettings, updateSettings } from '@/lib/db'
import { Settings } from '@/lib/types'
import { defaultSettings } from '@/data/program'

interface AppContextType {
  settings: Settings | null
  isLoading: boolean
  updateAppSettings: (updates: Partial<Settings>) => Promise<void>
  refreshSettings: () => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadSettings = async () => {
    try {
      await initializeDatabase()
      const s = await getSettings()
      setSettings(s)
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const updateAppSettings = async (updates: Partial<Settings>) => {
    await updateSettings(updates)
    const s = await getSettings()
    setSettings(s)
  }

  const refreshSettings = async () => {
    const s = await getSettings()
    setSettings(s)
  }

  return (
    <AppContext.Provider value={{ settings, isLoading, updateAppSettings, refreshSettings }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
