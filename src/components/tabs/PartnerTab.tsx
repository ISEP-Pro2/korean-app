'use client'

import { useState } from 'react'
import { partnerScripts } from '@/data/partnerScripts'
import { useApp } from '@/lib/context'
import RescueButton from '@/components/RescueButton'

export default function PartnerTab() {
  const { settings } = useApp()
  const [selectedScriptId, setSelectedScriptId] = useState<number | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  const availableScripts = partnerScripts.filter(
    s => s.weekUnlock <= (settings?.currentWeek || 1)
  )

  const lockedScripts = partnerScripts.filter(
    s => s.weekUnlock > (settings?.currentWeek || 1)
  )

  const selectedScript = partnerScripts.find(s => s.id === selectedScriptId)
  const currentCard = selectedScript?.cards[currentCardIndex]

  if (selectedScript && currentCard) {
    return (
      <div className="p-4 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <button
            onClick={() => {
              setSelectedScriptId(null)
              setCurrentCardIndex(0)
            }}
            className="btn-ghost"
          >
            ← 뒤로
          </button>
          <span className="font-medium">{selectedScript.title}</span>
          <span className="text-sm text-gray-500">
            {currentCardIndex + 1}/{selectedScript.cards.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-4">
          {selectedScript.cards.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-1 rounded-full ${
                idx <= currentCardIndex ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="card flex-1 flex flex-col justify-center space-y-6">
          {/* You say */}
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">내가 말하기</p>
            <p className="text-2xl font-medium">{currentCard.youSayKo}</p>
            <p className="text-sm text-gray-500 mt-2">{currentCard.frMeaning}</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
            <span className="text-gray-400">↓</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
          </div>

          {/* Partner reply */}
          <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">파트너 예시 답변</p>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              {currentCard.partnerReplyKo}
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
            <span className="text-gray-400">↓</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
          </div>

          {/* You repeat */}
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">따라 말하기</p>
            <p className="text-xl font-medium text-primary-600">
              {currentCard.youRepeatKo}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 py-4">
          <button
            onClick={() => setCurrentCardIndex(prev => Math.max(0, prev - 1))}
            disabled={currentCardIndex === 0}
            className="btn-secondary flex-1"
          >
            ← 이전
          </button>
          <button
            onClick={() => {
              if (currentCardIndex === selectedScript.cards.length - 1) {
                setSelectedScriptId(null)
                setCurrentCardIndex(0)
              } else {
                setCurrentCardIndex(prev => prev + 1)
              }
            }}
            className="btn-primary flex-1"
          >
            {currentCardIndex === selectedScript.cards.length - 1 ? '완료' : '다음 →'}
          </button>
        </div>

        <RescueButton />
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold">👥 파트너</h1>
        <p className="text-sm text-gray-500 mt-1">
          파트너와 함께 연습하세요
        </p>
      </div>

      {/* Instructions card */}
      <div className="card bg-warning-50 dark:bg-warning-900/20 mb-6">
        <h3 className="font-medium text-warning-700 dark:text-warning-300 mb-2">
          💡 파트너 규칙
        </h3>
        <ul className="text-sm text-warning-600 dark:text-warning-400 space-y-1">
          <li>• 설명하지 않기</li>
          <li>• 가르치지 않기</li>
          <li>• 짧게만 대답하기</li>
          <li>• 틀려도 교정하지 않기</li>
        </ul>
      </div>

      {/* Available scripts */}
      {availableScripts.length > 0 && (
        <div className="mb-6">
          <h2 className="font-medium text-gray-500 mb-3">사용 가능</h2>
          <div className="space-y-2">
            {availableScripts.map((script) => (
              <button
                key={script.id}
                onClick={() => setSelectedScriptId(script.id)}
                className="card w-full text-left flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">{script.title}</h3>
                  <p className="text-sm text-gray-500">{script.cards.length}장 카드</p>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Locked scripts */}
      {lockedScripts.length > 0 && (
        <div>
          <h2 className="font-medium text-gray-400 mb-3">🔒 잠김</h2>
          <div className="space-y-2">
            {lockedScripts.map((script) => (
              <div
                key={script.id}
                className="card opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{script.title}</h3>
                    <p className="text-sm text-gray-500">
                      {script.weekUnlock}주차에 잠금 해제
                    </p>
                  </div>
                  <span className="text-gray-400">🔒</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {availableScripts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-2">🔒</p>
          <p>파트너 스크립트가 아직 잠겨 있습니다</p>
          <p className="text-sm mt-1">3주차부터 사용 가능합니다</p>
        </div>
      )}

      <RescueButton />
    </div>
  )
}
