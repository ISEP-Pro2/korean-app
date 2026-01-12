'use client'

import { useState, useEffect } from 'react'
import { useTimer } from '@/hooks/useTimer'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { db, getCurrentEpisode } from '@/lib/db'
import { Episode } from '@/lib/types'

interface ListeningBlockProps {
  onComplete: (minutes: number, loops: number) => void
  onSkip: () => void
}

export default function ListeningBlock({ onComplete, onSkip }: ListeningBlockProps) {
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [loopCount, setLoopCount] = useState(0)
  const [shadowingEnabled, setShadowingEnabled] = useState(false)
  const [isRunningMode, setIsRunningMode] = useState(false)
  
  const timer = useTimer({
    duration: 10 * 60, // 10 minutes
    onComplete: () => handleComplete(),
  })

  const audio = useAudioPlayer({
    onEnded: () => {
      setLoopCount(prev => prev + 1)
      // Auto-replay if there's time left
      if (timer.timeRemaining > 30) {
        audio.play()
      }
    },
  })

  // Load current episode
  useEffect(() => {
    const loadEpisode = async () => {
      const ep = await getCurrentEpisode()
      setEpisode(ep || null)
      if (ep?.url) {
        audio.loadSource(ep.url)
      }
    }
    loadEpisode()
  }, [])

  const handleComplete = () => {
    audio.pause()
    const minutesListened = Math.round((10 * 60 - timer.timeRemaining) / 60)
    onComplete(minutesListened, loopCount)
  }

  const handleStartListening = () => {
    timer.start()
    if (episode) {
      audio.play()
    }
  }

  // Running mode UI
  if (isRunningMode) {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex flex-col">
        {/* Timer - huge */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl font-bold font-mono mb-4">
              {timer.formatted}
            </div>
            <div className="text-2xl text-gray-400">
              {loopCount}회 반복
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Rewind */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => audio.rewind(5)}
              className="bg-gray-800 text-white px-6 py-4 rounded-2xl text-xl"
            >
              ⏪ 5초
            </button>
            <button
              onClick={audio.toggle}
              className="bg-white text-black px-8 py-4 rounded-2xl text-xl font-bold"
            >
              {audio.isPlaying ? '일시정지' : '재생'}
            </button>
          </div>

          {/* Exit running mode */}
          <button
            onClick={() => setIsRunningMode(false)}
            className="w-full py-4 text-gray-400"
          >
            일반 모드로
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 min-h-screen flex flex-col">
      {/* Header */}
      <div className="text-center py-4">
        <h2 className="text-xl font-bold">🎧 듣기</h2>
        <p className="text-sm text-gray-500 mt-1">10분 목표</p>
      </div>

      {/* Timer */}
      <div className="text-center py-8">
        <div className="text-6xl font-bold font-mono text-primary-600">
          {timer.formatted}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {loopCount}회 반복
        </p>
      </div>

      {/* Episode info */}
      <div className="card mb-4">
        {episode ? (
          <div>
            <h3 className="font-medium mb-1">{episode.title}</h3>
            <p className="text-sm text-gray-500">
              {episode.sourceType === 'url' ? '🔗 URL' : '📁 파일'}
            </p>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>에피소드가 없습니다</p>
            <p className="text-sm mt-1">듣기 탭에서 추가하세요</p>
          </div>
        )}
      </div>

      {/* Shadowing toggle */}
      <div className="card flex items-center justify-between mb-4">
        <div>
          <h4 className="font-medium">따라 말하기 (쉐도잉)</h4>
          <p className="text-sm text-gray-500">오디오를 따라 말해보세요</p>
        </div>
        <button
          onClick={() => setShadowingEnabled(!shadowingEnabled)}
          className={`w-12 h-7 rounded-full transition-colors ${
            shadowingEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
            shadowingEnabled ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>

      {/* Shadowing prompt */}
      {shadowingEnabled && audio.isPlaying && (
        <div className="card bg-primary-50 dark:bg-primary-900/20 mb-4 text-center">
          <p className="text-primary-700 dark:text-primary-300 font-medium">
            🎤 따라 말해보세요!
          </p>
        </div>
      )}

      {/* Running mode button */}
      <button
        onClick={() => setIsRunningMode(true)}
        className="btn-secondary mb-4"
      >
        🏃 러닝 모드
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Controls */}
      <div className="space-y-3 pb-4">
        {!timer.isRunning ? (
          <button
            onClick={handleStartListening}
            className="btn-primary w-full text-xl"
            disabled={!episode}
          >
            {episode ? '듣기 시작' : '에피소드 없음'}
          </button>
        ) : (
          <>
            <div className="flex gap-3">
              <button
                onClick={() => audio.rewind(5)}
                className="btn-secondary flex-1"
              >
                ⏪ 5초 되감기
              </button>
              <button
                onClick={audio.toggle}
                className="btn-secondary flex-1"
              >
                {audio.isPlaying ? '⏸️ 일시정지' : '▶️ 재생'}
              </button>
            </div>
            <button
              onClick={handleComplete}
              className="btn-primary w-full"
            >
              듣기 완료
            </button>
          </>
        )}
        
        <button
          onClick={onSkip}
          className="btn-ghost w-full"
        >
          건너뛰기
        </button>
      </div>
    </div>
  )
}
