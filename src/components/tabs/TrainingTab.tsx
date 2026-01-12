'use client'

import { useState, useEffect } from 'react'
import { db, getTodayTrainingPatterns, logPatternReview } from '@/lib/db'
import { PatternMastery } from '@/lib/training-types'
import { trainingPatterns } from '@/data/training.seed'
import { generateTrainingSet } from '@/lib/training-generator'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'

type SessionStep = 'idle' | 'french' | 'reveal' | 'listen' | 'rate'

interface TrainingSentence {
  patternId: string
  korean: string
  english: string
}

export default function TrainingTab() {
  const [patterns, setPatterns] = useState<PatternMastery[]>([])
  const [sentences, setSentences] = useState<TrainingSentence[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [step, setStep] = useState<SessionStep>('idle')
  const [sessionComplete, setSessionComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const { speak, isSpeaking } = useTextToSpeech({ lang: 'ko-KR', rate: 0.8 })

  useEffect(() => {
    loadTrainingData()
  }, [])

  async function loadTrainingData() {
    setLoading(true)
    try {
      const todayPatterns = await getTodayTrainingPatterns()
      setPatterns(todayPatterns)

      // Get app start date for difficulty scaling
      const settings = await db.settings.get(1)
      const appStartDate = settings?.appStartDate || new Date().toISOString().split('T')[0]

      // Generate sentences from patterns
      const generated = generateTrainingSet(trainingPatterns, 5, appStartDate)
      const trainingSentences: TrainingSentence[] = generated.map(g => ({
        patternId: g.patternId,
        korean: g.korean,
        english: g.english,
      }))
      setSentences(trainingSentences)
    } catch (error) {
      console.error('Failed to load training data:', error)
    }
    setLoading(false)
  }

  function startSession() {
    if (sentences.length === 0) return
    setCurrentIndex(0)
    setSessionComplete(false)
    setStep('french')
  }

  function handleFrench() {
    setStep('reveal')
  }

  function handleReveal() {
    setStep('listen')
    // Auto-play audio when revealing Korean
    setTimeout(() => speak(sentences[currentIndex].korean), 100)
  }

  function handleListen() {
    speak(sentences[currentIndex].korean)
  }

  function handleListenDone() {
    setStep('rate')
  }

  async function handleRate(rating: 'easy' | 'medium' | 'hard') {
    const currentSentence = sentences[currentIndex]
    
    // Log the review
    await logPatternReview(currentSentence.patternId, rating)

    // Move to next sentence or complete
    if (currentIndex < sentences.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setStep('french')
    } else {
      setSessionComplete(true)
      setStep('idle')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    )
  }

  if (sentences.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-400">훈련 패턴이 없습니다</p>
        <button
          onClick={loadTrainingData}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
        >
          새로고침
        </button>
      </div>
    )
  }

  // Session complete screen
  if (sessionComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-6">
        <div className="text-4xl">🎉</div>
        <p className="text-xl text-gray-200">훈련 완료!</p>
        <p className="text-gray-400">{sentences.length}개 문장 연습</p>
        <button
          onClick={() => {
            loadTrainingData()
            setSessionComplete(false)
            setStep('idle')
          }}
          className="px-6 py-3 bg-primary text-white rounded-xl text-lg"
        >
          다시 연습
        </button>
      </div>
    )
  }

  // Idle state - show start button
  if (step === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-6">
        <h2 className="text-xl text-gray-200">패턴 훈련</h2>
        <p className="text-gray-400">{sentences.length}개 문장</p>
        <button
          onClick={startSession}
          className="px-8 py-4 bg-primary text-white rounded-xl text-2xl font-medium"
        >
          시작
        </button>
      </div>
    )
  }

  const currentSentence = sentences[currentIndex]
  const progress = `${currentIndex + 1} / ${sentences.length}`

  return (
    <div className="p-4 space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm">{progress}</span>
        <div className="flex space-x-1">
          {sentences.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < currentIndex
                  ? 'bg-success'
                  : i === currentIndex
                  ? 'bg-primary'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step indicator */}
      <div className="text-center">
        <span className="text-sm text-gray-400 uppercase tracking-wide">
          {step === 'french' && '생각해보세요'}
          {step === 'reveal' && '정답 보기'}
          {step === 'listen' && '듣기'}
          {step === 'rate' && '평가'}
        </span>
      </div>

      {/* Sentence display */}
      <div className="bg-gray-800 rounded-xl p-6 min-h-[200px] flex flex-col justify-center items-center space-y-4">
        {step === 'french' && (
          <>
            <p className="text-gray-400 text-sm mb-2">질문</p>
            <p className="text-3xl text-center leading-relaxed font-medium">
              {currentSentence.english}
            </p>
            <p className="text-gray-500 text-sm mt-4">어떻게 말할까요?</p>
          </>
        )}

        {step === 'reveal' && (
          <>
            <p className="text-gray-400 text-sm mb-2">정답</p>
            <p className="text-3xl text-center leading-relaxed">
              {currentSentence.korean}
            </p>
          </>
        )}

        {(step === 'listen' || step === 'rate') && (
          <>
            <p className="text-3xl text-center leading-relaxed">
              {currentSentence.korean}
            </p>
            <p className="text-gray-400 text-center">
              {currentSentence.english}
            </p>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col space-y-3">
        {step === 'french' && (
          <button
            onClick={handleFrench}
            className="w-full py-4 bg-primary text-white rounded-xl text-lg"
          >
            답변 생각함
          </button>
        )}

        {step === 'reveal' && (
          <button
            onClick={handleReveal}
            className="w-full py-4 bg-primary text-white rounded-xl text-lg"
          >
            🔊 정답 듣기
          </button>
        )}

        {step === 'listen' && (
          <>
            <button
              onClick={handleListen}
              disabled={isSpeaking}
              className="w-full py-4 bg-gray-700 text-white rounded-xl text-lg disabled:opacity-50"
            >
              {isSpeaking ? '재생 중...' : '🔊 다시 듣기'}
            </button>
            <button
              onClick={handleListenDone}
              className="w-full py-4 bg-primary text-white rounded-xl text-lg"
            >
              다음 단계
            </button>
          </>
        )}

        {step === 'rate' && (
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleRate('easy')}
              className="py-4 bg-success text-white rounded-xl text-lg"
            >
              쉬움
            </button>
            <button
              onClick={() => handleRate('medium')}
              className="py-4 bg-warning text-black rounded-xl text-lg"
            >
              보통
            </button>
            <button
              onClick={() => handleRate('hard')}
              className="py-4 bg-danger text-white rounded-xl text-lg"
            >
              어려움
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
