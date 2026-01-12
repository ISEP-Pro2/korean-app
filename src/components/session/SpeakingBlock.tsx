'use client'

import { useState } from 'react'
import { Sentence, SpeakingStep, Rating } from '@/lib/types'

interface SpeakingBlockProps {
  sentences: Sentence[]
  currentIndex: number
  currentStep: SpeakingStep
  onStepChange: (step: SpeakingStep) => void
  onRate: (sentenceId: number, rating: Rating) => void
}

export default function SpeakingBlock({
  sentences,
  currentIndex,
  currentStep,
  onStepChange,
  onRate,
}: SpeakingBlockProps) {
  const [showAnswer, setShowAnswer] = useState(false)
  const sentence = sentences[currentIndex]

  if (!sentence) {
    return (
      <div className="p-4 text-center">
        <p>문장을 불러오는 중...</p>
      </div>
    )
  }

  // TTS function (uses Web Speech API if available)
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ko-KR'
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleListen = () => {
    speak(sentence.ko)
    onStepChange('repeat')
  }

  const handleRepeatComplete = () => {
    onStepChange('recall')
    setShowAnswer(false)
  }

  const handleShowAnswer = () => {
    setShowAnswer(true)
    onStepChange('rate')
  }

  const handleRate = (rating: Rating) => {
    setShowAnswer(false)
    onRate(sentence.id, rating)
  }

  return (
    <div className="p-4 min-h-screen flex flex-col">
      {/* Header */}
      <div className="text-center py-4">
        <h2 className="text-xl font-bold">🗣️ 말하기</h2>
        <p className="text-sm text-gray-500 mt-1">
          {currentIndex + 1} / {sentences.length}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {sentences.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx < currentIndex
                ? 'bg-success-500'
                : idx === currentIndex
                ? 'bg-primary-600'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Step indicator */}
      <div className="flex justify-around mb-6 text-sm">
        <div className={`text-center ${currentStep === 'listen' ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
          1. 듣기
        </div>
        <div className={`text-center ${currentStep === 'repeat' ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
          2. 따라하기
        </div>
        <div className={`text-center ${currentStep === 'recall' || currentStep === 'rate' ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
          3. 암기
        </div>
      </div>

      {/* Sentence card */}
      <div className="card flex-1 flex flex-col items-center justify-center text-center p-6 mb-4">
        {/* Korean sentence - hidden during recall */}
        {(currentStep !== 'recall' || showAnswer) && (
          <p className="text-2xl font-medium mb-4 animate-fadeIn">
            {sentence.ko}
          </p>
        )}

        {/* Hidden prompt during recall */}
        {currentStep === 'recall' && !showAnswer && (
          <div className="text-center">
            <p className="text-6xl mb-4">🤔</p>
            <p className="text-lg text-gray-500">
              기억해서 말해보세요
            </p>
          </div>
        )}

        {/* French meaning */}
        <p className="text-gray-500 text-sm">
          {sentence.fr}
        </p>

        {/* Pinned indicator */}
        {sentence.pinnedForTomorrow && (
          <div className="mt-4 text-xs text-warning-600 bg-warning-50 px-3 py-1 rounded-full">
            📌 복습 필요
          </div>
        )}
      </div>

      {/* Actions based on step */}
      <div className="space-y-3 pb-4">
        {currentStep === 'listen' && (
          <>
            <button
              onClick={handleListen}
              className="btn-primary w-full text-lg"
            >
              🔊 듣기
            </button>
            <button
              onClick={() => onStepChange('repeat')}
              className="btn-ghost w-full"
            >
              TTS 없이 진행
            </button>
          </>
        )}

        {currentStep === 'repeat' && (
          <>
            <div className="card bg-primary-50 dark:bg-primary-900/20 text-center py-4">
              <p className="text-primary-700 dark:text-primary-300">
                🎤 따라 말해보세요
              </p>
            </div>
            <button
              onClick={() => speak(sentence.ko)}
              className="btn-secondary w-full"
            >
              🔊 다시 듣기
            </button>
            <button
              onClick={handleRepeatComplete}
              className="btn-primary w-full"
            >
              완료
            </button>
          </>
        )}

        {currentStep === 'recall' && !showAnswer && (
          <>
            <div className="card bg-warning-50 dark:bg-warning-900/20 text-center py-4">
              <p className="text-warning-700 dark:text-warning-300">
                💭 의미를 보고 한국어로 말해보세요
              </p>
            </div>
            <button
              onClick={handleShowAnswer}
              className="btn-primary w-full"
            >
              정답 보기
            </button>
          </>
        )}

        {currentStep === 'rate' && (
          <>
            <p className="text-center text-sm text-gray-500 mb-2">
              얼마나 어려웠나요?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleRate('easy')}
                className="rating-btn rating-easy"
              >
                쉬움
              </button>
              <button
                onClick={() => handleRate('normal')}
                className="rating-btn rating-normal"
              >
                보통
              </button>
              <button
                onClick={() => handleRate('hard')}
                className="rating-btn rating-hard"
              >
                어려움
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
