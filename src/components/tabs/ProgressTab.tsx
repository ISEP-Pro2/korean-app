'use client'

import { useState, useRef } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, exportData, importData } from '@/lib/db'
import { useApp } from '@/lib/context'
import { programPhases } from '@/data/program'

export default function ProgressTab() {
  const { settings } = useApp()
  const [showExport, setShowExport] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate streak
  const dailyLogs = useLiveQuery(() => db.dailyLogs.toArray())
  
  const streak = (() => {
    if (!dailyLogs) return 0
    
    const sortedLogs = [...dailyLogs]
      .filter(l => l.completed)
      .sort((a, b) => b.date.localeCompare(a.date))
    
    if (sortedLogs.length === 0) return 0
    
    let count = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.date)
      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - count)
      
      if (logDate.toDateString() === expectedDate.toDateString()) {
        count++
      } else if (count === 0 && logDate.getTime() < today.getTime()) {
        // Allow yesterday to count if today isn't done yet
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        if (logDate.toDateString() === yesterday.toDateString()) {
          count++
        } else {
          break
        }
      } else {
        break
      }
    }
    
    return count
  })()

  // Stats
  const stats = useLiveQuery(async () => {
    const logs = await db.dailyLogs.toArray()
    const sentences = await db.sentences.toArray()
    
    const totalListeningMinutes = logs.reduce((sum, l) => sum + l.listeningMinutes, 0)
    const totalSentencesCompleted = logs.reduce((sum, l) => sum + l.sentencesCompleted, 0)
    const difficultSentences = sentences.filter(s => s.pinnedForTomorrow)
    
    return {
      totalListeningMinutes,
      totalSentencesCompleted,
      difficultSentences,
      completedDays: logs.filter(l => l.completed).length,
    }
  })

  // Weekly listening data (last 7 days)
  const weeklyData = useLiveQuery(async () => {
    const today = new Date()
    const data = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const log = await db.dailyLogs.where('date').equals(dateStr).first()
      data.push({
        date: dateStr,
        day: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
        minutes: log?.listeningMinutes || 0,
      })
    }
    
    return data
  })

  const handleExport = async () => {
    const data = await exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `k8m-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    
    URL.revokeObjectURL(url)
    setShowExport(false)
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      await importData(data)
      alert('데이터를 성공적으로 가져왔습니다!')
      window.location.reload()
    } catch (error) {
      alert('데이터를 가져오는데 실패했습니다.')
    }
  }

  const currentPhase = programPhases.find(p => p.week === settings?.currentWeek) || programPhases[0]

  return (
    <div className="p-4 pb-24">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold">📊 진행</h1>
      </div>

      {/* Streak */}
      <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white mb-4">
        <div className="text-center py-4">
          <div className="text-5xl mb-2">🔥</div>
          <div className="text-4xl font-bold">{streak}</div>
          <div className="text-primary-100">연속 일</div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {stats?.totalListeningMinutes || 0}
          </div>
          <div className="text-sm text-gray-500">총 듣기 (분)</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {stats?.totalSentencesCompleted || 0}
          </div>
          <div className="text-sm text-gray-500">완료 문장</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {stats?.completedDays || 0}
          </div>
          <div className="text-sm text-gray-500">완료 일수</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">
            {stats?.difficultSentences?.length || 0}
          </div>
          <div className="text-sm text-gray-500">어려운 문장</div>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="card mb-6">
        <h3 className="font-medium mb-4">이번 주 듣기</h3>
        <div className="flex items-end justify-between gap-1 h-24">
          {weeklyData?.map((day, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full bg-primary-200 dark:bg-primary-800 rounded-t transition-all"
                  style={{
                    height: `${Math.min(100, (day.minutes / 30) * 100)}%`,
                    minHeight: day.minutes > 0 ? '4px' : '0',
                  }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">{day.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Program phase */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">프로그램</h3>
          <span className="text-sm text-primary-600">{settings?.currentWeek}주차</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-3">{currentPhase.description}</p>
        
        <div className="grid grid-cols-8 gap-1">
          {programPhases.map((phase) => (
            <div
              key={phase.week}
              className={`h-2 rounded-full ${
                phase.week <= (settings?.currentWeek || 1)
                  ? 'bg-primary-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1주</span>
          <span>8주</span>
        </div>
      </div>

      {/* Difficult sentences */}
      {stats?.difficultSentences && stats.difficultSentences.length > 0 && (
        <div className="card mb-6">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <span>📌</span>
            <span>복습 필요</span>
          </h3>
          <div className="space-y-2">
            {stats.difficultSentences.slice(0, 5).map((s) => (
              <div key={s.id} className="p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                <p className="font-medium">{s.ko}</p>
                <p className="text-sm text-gray-500">{s.fr}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export/Import */}
      <div className="card">
        <h3 className="font-medium mb-3">데이터 백업</h3>
        <div className="flex gap-3">
          <button onClick={handleExport} className="btn-secondary flex-1">
            📤 내보내기
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary flex-1"
          >
            📥 가져오기
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
        <p className="text-xs text-gray-400 mt-2">
          JSON 파일로 진행 상태를 백업하고 복원하세요
        </p>
      </div>
    </div>
  )
}
