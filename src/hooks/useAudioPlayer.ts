'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseAudioPlayerOptions {
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number) => void
}

export function useAudioPlayer(options: UseAudioPlayerOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio()
    
    const audio = audioRef.current

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
      setIsLoading(false)
    })

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
      options.onTimeUpdate?.(audio.currentTime)
    })

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      options.onEnded?.()
    })

    audio.addEventListener('error', () => {
      setError('오디오를 재생할 수 없습니다')
      setIsLoading(false)
      setIsPlaying(false)
    })

    audio.addEventListener('waiting', () => setIsLoading(true))
    audio.addEventListener('playing', () => setIsLoading(false))

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const loadSource = useCallback((source: string | Blob) => {
    if (!audioRef.current) return

    setIsLoading(true)
    setError(null)
    
    if (typeof source === 'string') {
      audioRef.current.src = source
    } else {
      audioRef.current.src = URL.createObjectURL(source)
    }
    
    audioRef.current.load()
  }, [])

  const play = useCallback(async () => {
    if (!audioRef.current) return
    
    try {
      await audioRef.current.play()
      setIsPlaying(true)
      
      // Update Media Session
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing'
      }
    } catch (err) {
      setError('재생 실패')
    }
  }, [])

  const pause = useCallback(() => {
    if (!audioRef.current) return
    
    audioRef.current.pause()
    setIsPlaying(false)
    
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'paused'
    }
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(time, duration))
  }, [duration])

  const rewind = useCallback((seconds: number = 5) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - seconds)
  }, [])

  const forward = useCallback((seconds: number = 5) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + seconds)
  }, [duration])

  return {
    isPlaying,
    currentTime,
    duration,
    isLoading,
    error,
    loadSource,
    play,
    pause,
    toggle,
    seek,
    rewind,
    forward,
  }
}
