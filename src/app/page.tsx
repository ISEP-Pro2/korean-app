'use client'

import { useState } from 'react'
import { useApp } from '@/lib/context'
import TabNav from '@/components/TabNav'
import TodayTab from '@/components/tabs/TodayTab'
import TrainingTab from '@/components/tabs/TrainingTab'
import SentencesTab from '@/components/tabs/SentencesTab'
import ListeningTab from '@/components/tabs/ListeningTab'
import PartnerTab from '@/components/tabs/PartnerTab'
import ProgressTab from '@/components/tabs/ProgressTab'
import SettingsTab from '@/components/tabs/SettingsTab'

export type TabId = 'today' | 'training' | 'sentences' | 'listening' | 'partner' | 'progress' | 'settings'

export default function Home() {
  const { isLoading } = useApp()
  const [activeTab, setActiveTab] = useState<TabId>('today')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🇰🇷</div>
          <div className="text-lg font-medium text-gray-600 dark:text-gray-400">
            K-8M
          </div>
        </div>
      </div>
    )
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'today':
        return <TodayTab />
      case 'training':
        return <TrainingTab />
      case 'sentences':
        return <SentencesTab />
      case 'listening':
        return <ListeningTab />
      case 'partner':
        return <PartnerTab />
      case 'progress':
        return <ProgressTab />
      case 'settings':
        return <SettingsTab />
      default:
        return <TodayTab />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-20 overflow-y-auto">
        {renderTab()}
      </main>
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
