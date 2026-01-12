'use client'

import { TabId } from '@/app/page'

interface TabNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'today', label: '오늘', icon: '📅' },
  { id: 'training', label: '훈련', icon: '🎯' },
  { id: 'sentences', label: '문장', icon: '💬' },
  { id: 'listening', label: '듣기', icon: '🎧' },
  { id: 'partner', label: '파트너', icon: '👥' },
  { id: 'progress', label: '진행', icon: '📊' },
  { id: 'settings', label: '설정', icon: '⚙️' },
]

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-bottom z-40">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              activeTab === tab.id
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <span className="text-xl mb-0.5">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
