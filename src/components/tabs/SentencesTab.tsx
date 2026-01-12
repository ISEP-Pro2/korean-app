'use client'

import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { useApp } from '@/lib/context'
import { Sentence, MasteryState } from '@/lib/types'

const masteryColors: Record<MasteryState, string> = {
  NEW: 'bg-gray-200 text-gray-600',
  WARM: 'bg-warning-100 text-warning-600',
  HOT: 'bg-orange-100 text-orange-600',
  SOLID: 'bg-success-100 text-success-600',
}

const masteryLabels: Record<MasteryState, string> = {
  NEW: '새로움',
  WARM: '익숙해지는 중',
  HOT: '거의 암기',
  SOLID: '완벽',
}

export default function SentencesTab() {
  const { settings } = useApp()
  const [filter, setFilter] = useState<MasteryState | 'all'>('all')

  const sentences = useLiveQuery(async () => {
    let query = db.sentences.where('weekUnlock').belowOrEqual(settings?.currentWeek || 1)
    const all = await query.toArray()
    
    if (filter !== 'all') {
      return all.filter(s => s.masteryState === filter)
    }
    return all
  }, [settings?.currentWeek, filter])

  const stats = useLiveQuery(async () => {
    const all = await db.sentences
      .where('weekUnlock')
      .belowOrEqual(settings?.currentWeek || 1)
      .toArray()
    
    return {
      total: all.length,
      NEW: all.filter(s => s.masteryState === 'NEW').length,
      WARM: all.filter(s => s.masteryState === 'WARM').length,
      HOT: all.filter(s => s.masteryState === 'HOT').length,
      SOLID: all.filter(s => s.masteryState === 'SOLID').length,
    }
  }, [settings?.currentWeek])

  return (
    <div className="p-4">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold">💬 문장</h1>
        <p className="text-sm text-gray-500 mt-1">
          {stats?.total || 0}개 문장
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(['NEW', 'WARM', 'HOT', 'SOLID'] as MasteryState[]).map((state) => (
            <button
              key={state}
              onClick={() => setFilter(filter === state ? 'all' : state)}
              className={`card p-3 text-center ${
                filter === state ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="text-lg font-bold">{stats[state]}</div>
              <div className={`text-xs px-2 py-0.5 rounded ${masteryColors[state]}`}>
                {masteryLabels[state]}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Filter indicator */}
      {filter !== 'all' && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">
            {masteryLabels[filter]} 필터 적용됨
          </span>
          <button
            onClick={() => setFilter('all')}
            className="text-sm text-primary-600"
          >
            필터 해제
          </button>
        </div>
      )}

      {/* Sentence list */}
      <div className="space-y-2">
        {sentences?.map((sentence) => (
          <div key={sentence.id} className="card">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-medium text-lg">{sentence.ko}</p>
                <p className="text-sm text-gray-500 mt-1">{sentence.fr}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                masteryColors[sentence.masteryState]
              }`}>
                {masteryLabels[sentence.masteryState]}
              </span>
            </div>
            
            {/* Review info */}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <span>복습 {sentence.reviewCount}회</span>
              {sentence.lastReviewDate && (
                <span>마지막: {sentence.lastReviewDate}</span>
              )}
              {sentence.pinnedForTomorrow && (
                <span className="text-warning-600">📌 내일 복습</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {sentences?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>표시할 문장이 없습니다</p>
        </div>
      )}
    </div>
  )
}
