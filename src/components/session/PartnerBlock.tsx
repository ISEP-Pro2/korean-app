'use client'

import { useState, useEffect } from 'react'
import { useTimer } from '@/hooks/useTimer'
import { partnerScripts } from '@/data/partnerScripts'
import { useApp } from '@/lib/context'
import RescueButton from '@/components/RescueButton'

interface PartnerBlockProps {
  onComplete: () => void
  onSkip: () => void
}

export default function PartnerBlock({ onComplete, onSkip }: PartnerBlockProps) {
  const { settings } = useApp()
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isStarted, setIsStarted] = useState(false)

  const timer = useTimer({
    duration: 5 * 60, // 5 minutes
    onComplete: () => onComplete(),
  })

  // Filter scripts by current week
  const availableScripts = partnerScripts.filter(
    s => s.weekUnlock <= (settings?.currentWeek || 1)
  )

  const currentScript = availableScripts[currentScriptIndex]
  const currentCard = currentScript?.cards[currentCardIndex]
  const totalCards = currentScript?.cards.length || 0

  const handleStart = () => {
    setIsStarted(true)
    timer.start()
  }

  const handleNextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1)
    } else if (currentScriptIndex < availableScripts.length - 1) {
      setCurrentScriptIndex(prev => prev + 1)
      setCurrentCardIndex(0)
    } else {
      onComplete()
    }
  }

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1)
    }
  }

  if (!isStarted) {
    return (
      <div className="p-4 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center py-4">
          <h2 className="text-xl font-bold">👥 파트너</h2>
          <p className="text-sm text-gray-500 mt-1">5분 (선택)</p>
        </div>

        {/* Instructions */}
        <div className="card bg-warning-50 dark:bg-warning-900/20 mb-4">
          <h3 className="font-medium text-warning-700 dark:text-warning-300 mb-2">
            파트너에게 전달하세요:
          </h3>
          <ul className="text-sm text-warning-600 dark:text-warning-400 space-y-1">
            <li>• 설명하지 않기</li>
            <li>• 가르치지 않기</li>
            <li>• 짧게 대답하기</li>
          </ul>
        </div>

        {/* Available scripts */}
        <div className="space-y-2 mb-4">
          {availableScripts.map((script, idx) => (
            <button
              key={script.id}
              onClick={() => setCurrentScriptIndex(idx)}
              className={`card w-full text-left ${
                currentScriptIndex === idx
                  ? 'ring-2 ring-primary-500'
                  : ''
              }`}
            >
              <h4 className="font-medium">{script.title}</h4>
              <p className="text-sm text-gray-500">{script.cards.length}장 카드</p>
            </button>
          ))}
        </div>

        {availableScripts.length === 0 && (
          <div className="card text-center py-8 text-gray-500">
            <p>파트너 스크립트가 아직 잠겨 있습니다.</p>
            <p className="text-sm mt-1">3주차부터 사용 가능합니다.</p>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="space-y-3 pb-4">
          <button
            onClick={handleStart}
            className="btn-primary w-full"
            disabled={availableScripts.length === 0}
          >
            파트너와 시작
          </button>
          <button
            onClick={onSkip}
            className="btn-ghost w-full text-lg"
          >
            스킵 (괜찮아요!)
          </button>
        </div>

        <RescueButton />
      </div>
    )
  }

  // Active session
  return (
    <div className="p-4 min-h-screen flex flex-col">
      {/* Timer */}
      <div className="text-center py-4">
        <div className="text-4xl font-bold font-mono text-primary-600">
          {timer.formatted}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {currentScript?.title} - {currentCardIndex + 1}/{totalCards}
        </p>
      </div>

      {/* Card */}
      {currentCard && (
        <div className="card flex-1 flex flex-col justify-center space-y-6 mb-4">
          {/* You say */}
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">내가 말하기</p>
            <p className="text-xl font-medium">{currentCard.youSayKo}</p>
            <p className="text-sm text-gray-500 mt-1">{currentCard.frMeaning}</p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* Partner reply */}
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">파트너 예시 답변</p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {currentCard.partnerReplyKo}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* You repeat */}
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">내가 따라 말하기</p>
            <p className="text-lg font-medium text-primary-600">
              {currentCard.youRepeatKo}
            </p>
          </div>
        </div>
      )}

      {/* Quick rescue card */}
      <div className="card bg-gray-50 dark:bg-gray-800 mb-4 text-center py-3">
        <p className="text-sm text-gray-500">막히면:</p>
        <p className="font-medium">천천히 다시 말해 주세요.</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pb-4">
        <button
          onClick={handlePrevCard}
          className="btn-secondary flex-1"
          disabled={currentCardIndex === 0}
        >
          ← 이전
        </button>
        <button
          onClick={handleNextCard}
          className="btn-primary flex-1"
        >
          {currentCardIndex === totalCards - 1 ? '완료' : '다음 →'}
        </button>
      </div>

      {/* Skip */}
      <button
        onClick={onSkip}
        className="btn-ghost w-full mb-4"
      >
        스킵
      </button>

      <RescueButton />
    </div>
  )
}
