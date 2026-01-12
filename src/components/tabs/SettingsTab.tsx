'use client'

import { useState } from 'react'
import { useApp } from '@/lib/context'
import { db } from '@/lib/db'
import { programPhases } from '@/data/program'

export default function SettingsTab() {
  const { settings, updateAppSettings } = useApp()
  const [showWeekWarning, setShowWeekWarning] = useState(false)
  const [targetWeek, setTargetWeek] = useState(1)

  if (!settings) return null

  const handleTimeBudgetChange = (value: number) => {
    updateAppSettings({ dailyTimeBudget: value })
  }

  const handleLockDaysChange = (value: number) => {
    updateAppSettings({ episodeLockDays: value })
  }

  const handleWeekChange = (week: number) => {
    if (week > settings.currentWeek) {
      setTargetWeek(week)
      setShowWeekWarning(true)
    } else {
      updateAppSettings({ currentWeek: week })
    }
  }

  const confirmWeekChange = () => {
    updateAppSettings({ currentWeek: targetWeek })
    setShowWeekWarning(false)
  }

  const handleUnlockEpisode = async () => {
    const today = new Date().toISOString().split('T')[0]
    await db.episodes.toCollection().modify({ lockedUntilDate: today })
    alert('모든 에피소드 잠금이 해제되었습니다')
  }

  const handleResetApp = async () => {
    if (confirm('정말 모든 데이터를 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.')) {
      await db.delete()
      window.location.reload()
    }
  }

  return (
    <div className="p-4 pb-24">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold">⚙️ 설정</h1>
      </div>

      {/* Daily time budget */}
      <div className="card mb-4">
        <h3 className="font-medium mb-3">일일 시간 목표</h3>
        <div className="grid grid-cols-4 gap-2">
          {[10, 15, 20, 30].map((mins) => (
            <button
              key={mins}
              onClick={() => handleTimeBudgetChange(mins)}
              className={`py-3 rounded-xl text-center transition-colors ${
                settings.dailyTimeBudget === mins
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {mins}분
            </button>
          ))}
        </div>
      </div>

      {/* Episode lock days */}
      <div className="card mb-4">
        <h3 className="font-medium mb-3">에피소드 잠금 기간</h3>
        <p className="text-sm text-gray-500 mb-3">
          새 에피소드를 추가하면 이 기간 동안 집중합니다
        </p>
        <div className="grid grid-cols-4 gap-2">
          {[1, 3, 5, 7].map((days) => (
            <button
              key={days}
              onClick={() => handleLockDaysChange(days)}
              className={`py-3 rounded-xl text-center transition-colors ${
                settings.episodeLockDays === days
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {days}일
            </button>
          ))}
        </div>
      </div>

      {/* Current week */}
      <div className="card mb-4">
        <h3 className="font-medium mb-3">현재 주차</h3>
        <p className="text-sm text-gray-500 mb-3">
          프로그램 진행 상황을 조정합니다
        </p>
        <div className="grid grid-cols-4 gap-2">
          {programPhases.map((phase) => (
            <button
              key={phase.week}
              onClick={() => handleWeekChange(phase.week)}
              className={`py-3 rounded-xl text-center transition-colors ${
                settings.currentWeek === phase.week
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {phase.week}주
            </button>
          ))}
        </div>
      </div>

      {/* Phase 1 lock */}
      <div className="card mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Phase 1 잠금</h3>
            <p className="text-sm text-gray-500">8주간 커스텀 생성 비활성화</p>
          </div>
          <button
            onClick={() => updateAppSettings({ phase1Lock: !settings.phase1Lock })}
            className={`w-12 h-7 rounded-full transition-colors ${
              settings.phase1Lock ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
              settings.phase1Lock ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      {/* Speech recognition (beta) */}
      <div className="card mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">
              음성 인식
              <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">베타</span>
            </h3>
            <p className="text-sm text-gray-500">Web Speech API 사용</p>
          </div>
          <button
            onClick={() => updateAppSettings({ speechRecognition: !settings.speechRecognition })}
            className={`w-12 h-7 rounded-full transition-colors ${
              settings.speechRecognition ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
              settings.speechRecognition ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-medium">알림</h3>
            <p className="text-sm text-gray-500">일일 리마인더</p>
          </div>
          <button
            onClick={() => updateAppSettings({ notificationsEnabled: !settings.notificationsEnabled })}
            className={`w-12 h-7 rounded-full transition-colors ${
              settings.notificationsEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
              settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        {settings.notificationsEnabled && (
          <div>
            <label className="text-sm text-gray-500 block mb-1">알림 시간</label>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => updateAppSettings({ reminderTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg
                         bg-white dark:bg-gray-800"
            />
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="card border-danger-200 dark:border-danger-800">
        <h3 className="font-medium text-danger-600 mb-3">위험 영역</h3>
        
        <button
          onClick={handleUnlockEpisode}
          className="w-full mb-2 py-3 rounded-xl bg-warning-50 dark:bg-warning-900/20 
                     text-warning-600 font-medium"
        >
          🔓 모든 에피소드 잠금 해제
        </button>
        
        <button
          onClick={handleResetApp}
          className="w-full py-3 rounded-xl bg-danger-50 dark:bg-danger-900/20 
                     text-danger-600 font-medium"
        >
          🗑️ 모든 데이터 삭제
        </button>
      </div>

      {/* App info */}
      <div className="text-center text-sm text-gray-400 mt-8">
        <p>K-8M v1.0.0</p>
        <p>8개월 한국어 말하기 연습</p>
        {settings.appStartDate && (
          <p className="mt-1">시작일: {settings.appStartDate}</p>
        )}
      </div>

      {/* Week change warning modal */}
      {showWeekWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="card max-w-sm w-full animate-fadeIn">
            <h3 className="font-bold text-lg mb-2">⚠️ 주차 변경</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {targetWeek}주차로 건너뛰시겠습니까? 이전 주차의 콘텐츠를 충분히 연습하지 않으면 학습 효과가 떨어질 수 있습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWeekWarning(false)}
                className="btn-secondary flex-1"
              >
                취소
              </button>
              <button
                onClick={confirmWeekChange}
                className="btn-primary flex-1"
              >
                건너뛰기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
