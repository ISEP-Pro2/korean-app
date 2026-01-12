'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseTimerOptions {
  duration: number // in seconds
  onComplete?: () => void
  autoStart?: boolean
}

export function useTimer({ duration, onComplete, autoStart = false }: UseTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(duration)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(duration)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    if (isRunning) return
    
    startTimeRef.current = Date.now()
    pausedTimeRef.current = timeRemaining
    setIsRunning(true)
  }, [isRunning, timeRemaining])

  const pause = useCallback(() => {
    clearTimer()
    pausedTimeRef.current = timeRemaining
    setIsRunning(false)
  }, [clearTimer, timeRemaining])

  const reset = useCallback(() => {
    clearTimer()
    setTimeRemaining(duration)
    pausedTimeRef.current = duration
    setIsRunning(false)
  }, [clearTimer, duration])

  const toggle = useCallback(() => {
    if (isRunning) {
      pause()
    } else {
      start()
    }
  }, [isRunning, pause, start])

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const remaining = Math.max(0, pausedTimeRef.current - elapsed)
      
      setTimeRemaining(remaining)
      
      if (remaining <= 0) {
        clearTimer()
        setIsRunning(false)
        onComplete?.()
      }
    }, 100)

    return () => clearTimer()
  }, [isRunning, onComplete, clearTimer])

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = Math.floor(timeRemaining % 60)
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`

  return {
    timeRemaining,
    isRunning,
    formatted,
    start,
    pause,
    reset,
    toggle,
  }
}
