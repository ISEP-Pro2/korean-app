'use client'

import { useState, useCallback } from 'react'

interface TextToSpeechOptions {
  lang?: string
  rate?: number
  pitch?: number
  volume?: number
}

export function useTextToSpeech(options: TextToSpeechOptions = {}) {
  const {
    lang = 'ko-KR',
    rate = 0.8,
    pitch = 1,
    volume = 1,
  } = options

  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Web Speech API not supported')
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [lang, rate, pitch, volume])

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  return { speak, stop, isSpeaking }
}
