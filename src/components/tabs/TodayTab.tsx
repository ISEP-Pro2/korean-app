'use client'

import { useState, useEffect, useCallback } from 'react'
import { useApp } from '@/lib/context'
import { db, getTodayLog, updateTodayLog, logReview, getTodayDate } from '@/lib/db'
import { getTodaySentences } from '@/lib/scheduling'
import { SessionState, Sentence, Rating } from '@/lib/types'
import RescueButton from '@/components/RescueButton'
import ListeningBlock from '@/components/session/ListeningBlock'
import SpeakingBlock from '@/components/session/SpeakingBlock'
import PartnerBlock from '@/components/session/PartnerBlock'
import FrictionRating from '@/components/session/FrictionRating'

const initialSessionState: SessionState = {
  phase: 'idle',
  listeningStartTime: null,
  speakingStartTime: null,
  partnerStartTime: null,
  currentSentenceIndex: 0,
  currentSentenceStep: 'listen',
  todaySentences: [],
  isPlaying: false,
  loopCount: 0,
  shadowingEnabled: false,
}

export default function TodayTab() {
  const { settings } = useApp()
  const [session, setSession] = useState<SessionState>(initialSessionState)
  const [todayLog, setTodayLog] = useState<{
    listeningMinutes: number
    speakingMinutes: number
    partnerMinutes: number
    sentencesCompleted: number
    completed: boolean
  } | null>(null)
  const [showFrictionRating, setShowFrictionRating] = useState(false)

  // Load today's log
  useEffect(() => {
    const loadLog = async () => {
      const log = await getTodayLog()
      setTodayLog({
        listeningMinutes: log.listeningMinutes,
        speakingMinutes: log.speakingMinutes,
        partnerMinutes: log.partnerMinutes,
        sentencesCompleted: log.sentencesCompleted,
        completed: log.completed,
      })
    }
    loadLog()
  }, [])

  // Load today's sentences when session starts
  const loadSentences = async () => {
    if (!settings) return []
    const sentences = await getTodaySentences(settings.currentWeek)
    return sentences
  }

  // Start the session
  const handleStart = async () => {
    const sentences = await loadSentences()
    setSession({
      ...initialSessionState,
      phase: 'speaking',
      speakingStartTime: Date.now(),
      todaySentences: sentences,
    })
  }

  // Complete speaking phase (move to partner)
  const handleSpeakingComplete = async () => {
    const speakingMinutes = Math.round((Date.now() - (session.speakingStartTime || 0)) / 60000)
    await updateTodayLog({
      speakingMinutes: (todayLog?.speakingMinutes || 0) + speakingMinutes,
      sentencesCompleted: (todayLog?.sentencesCompleted || 0) + session.todaySentences.length,
      spokeKorean: true,
    })
    setTodayLog(prev => prev ? {
      ...prev,
      speakingMinutes: prev.speakingMinutes + speakingMinutes,
      sentencesCompleted: prev.sentencesCompleted + session.todaySentences.length,
    } : null)
    
    setSession(prev => ({
      ...prev,
      phase: 'partner',
      partnerStartTime: Date.now(),
    }))
  }

  // Complete listening phase (final phase - show friction rating)
  const handleListeningComplete = async (minutes: number, loops: number) => {
    await updateTodayLog({
      listeningMinutes: (todayLog?.listeningMinutes || 0) + minutes,
      completed: true,
    })
    setTodayLog(prev => prev ? { 
      ...prev, 
      listeningMinutes: prev.listeningMinutes + minutes,
      completed: true,
    } : null)
    
    setSession(prev => ({
      ...prev,
      phase: 'completed',
    }))
    setShowFrictionRating(true)
  }

  // Rate a sentence
  const handleRateSentence = async (sentenceId: number, rating: Rating) => {
    const ratingMap: { [key: string]: 'easy' | 'normal' | 'hard' } = {
      'easy': 'easy',
      'normal': 'normal',
      'hard': 'hard',
    }
    await logReview(sentenceId, ratingMap[rating])
    
    const nextIndex = session.currentSentenceIndex + 1
    
    if (nextIndex >= session.todaySentences.length) {
      // Speaking complete - move to partner
      await handleSpeakingComplete()
    } else {
      // Move to next sentence
      setSession(prev => ({
        ...prev,
        currentSentenceIndex: nextIndex,
        currentSentenceStep: 'listen',
      }))
    }
  }

  // Complete or skip partner
  const handlePartnerComplete = async (completed: boolean) => {
    if (completed) {
      const partnerMinutes = Math.round((Date.now() - (session.partnerStartTime || 0)) / 60000)
      await updateTodayLog({
        partnerMinutes: (todayLog?.partnerMinutes || 0) + partnerMinutes,
      })
    }
    
    // Move to listening phase (now the final phase)
    setSession(prev => ({ 
      ...prev, 
      phase: 'listening',
      listeningStartTime: Date.now(),
    }))
  }

  // Handle friction rating
  const handleFrictionRating = async (rating: number) => {
    await updateTodayLog({ frictionRating: rating })
    setShowFrictionRating(false)
    setSession(initialSessionState)
  }

  // Render based on session phase
  if (showFrictionRating) {
    return <FrictionRating onRate={handleFrictionRating} />
  }

  if (session.phase === 'listening') {
    return (
      <ListeningBlock
        onComplete={handleListeningComplete}
        onSkip={() => handleListeningComplete(0, 0)}
      />
    )
  }

  if (session.phase === 'speaking') {
    return (
      <SpeakingBlock
        sentences={session.todaySentences}
        currentIndex={session.currentSentenceIndex}
        currentStep={session.currentSentenceStep}
        onStepChange={(step) => setSession(prev => ({ ...prev, currentSentenceStep: step }))}
        onRate={handleRateSentence}
      />
    )
  }

  if (session.phase === 'partner') {
    return (
      <PartnerBlock
        onComplete={() => handlePartnerComplete(true)}
        onSkip={() => handlePartnerComplete(false)}
      />
    )
  }

  // Idle state - show today overview
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center pt-4 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">오늘</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {new Date().toLocaleDateString('ko-KR', { 
            month: 'long', 
            day: 'numeric', 
            weekday: 'long' 
          })}
        </p>
      </div>

      {/* Progress summary */}
      {todayLog && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">오늘 진행</span>
            {todayLog.completed && (
              <span className="text-xs font-medium text-success-600 bg-success-50 px-2 py-1 rounded-full">
                ✓ 완료
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {todayLog.listeningMinutes}
              </div>
              <div className="text-xs text-gray-500">듣기 (분)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {todayLog.speakingMinutes}
              </div>
              <div className="text-xs text-gray-500">말하기 (분)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {todayLog.sentencesCompleted}
              </div>
              <div className="text-xs text-gray-500">문장</div>
            </div>
          </div>
        </div>
      )}

      {/* Session blocks preview */}
      <div className="space-y-3">
        {/* Listening block */}
        <div className="card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎧</span>
            <div>
              <h3 className="font-medium">듣기</h3>
              <p className="text-sm text-gray-500">10분 목표</p>
            </div>
          </div>
          <span className="text-sm text-gray-400">1단계</span>
        </div>

        {/* Speaking block */}
        <div className="card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🗣️</span>
            <div>
              <h3 className="font-medium">말하기</h3>
              <p className="text-sm text-gray-500">5문장 연습</p>
            </div>
          </div>
          <span className="text-sm text-gray-400">2단계</span>
        </div>

        {/* Partner block */}
        <div className="card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👥</span>
            <div>
              <h3 className="font-medium">파트너</h3>
              <p className="text-sm text-gray-500">5분 (선택)</p>
            </div>
          </div>
          <span className="text-sm text-gray-400">3단계</span>
        </div>
      </div>

      {/* Start button - fixed at bottom */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent">
        <button
          onClick={handleStart}
          className="btn-primary w-full text-xl py-5"
        >
          시작
        </button>
      </div>

      {/* Rescue button */}
      <RescueButton />
    </div>
  )
}
