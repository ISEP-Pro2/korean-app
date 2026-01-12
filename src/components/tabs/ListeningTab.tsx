'use client'

import { useState, useRef } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, getTodayDate } from '@/lib/db'
import { Episode } from '@/lib/types'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { useApp } from '@/lib/context'

export default function ListeningTab() {
  const { settings } = useApp()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [playingEpisodeId, setPlayingEpisodeId] = useState<number | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audio = useAudioPlayer()

  const episodes = useLiveQuery(() => db.episodes.toArray())

  const handleAddUrl = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return

    const today = getTodayDate()
    const lockDate = new Date()
    lockDate.setDate(lockDate.getDate() + (settings?.episodeLockDays || 3))

    await db.episodes.add({
      title: newTitle.trim(),
      sourceType: 'url',
      url: newUrl.trim(),
      lockedUntilDate: lockDate.toISOString().split('T')[0],
      notes: '',
      addedDate: today,
      loopCount: 0,
    })

    setNewTitle('')
    setNewUrl('')
    setShowAddForm(false)
  }

  const handleAddFile = async () => {
    if (!selectedFile || !newTitle.trim()) return

    const today = getTodayDate()
    const lockDate = new Date()
    lockDate.setDate(lockDate.getDate() + (settings?.episodeLockDays || 3))

    // Store file as blob in IndexedDB
    const blobKey = `audio-${Date.now()}`
    await db.audioBlobs.add({
      key: blobKey,
      blob: selectedFile,
      filename: selectedFile.name,
      mimeType: selectedFile.type,
    })

    await db.episodes.add({
      title: newTitle.trim(),
      sourceType: 'file',
      blobKey,
      lockedUntilDate: lockDate.toISOString().split('T')[0],
      notes: '',
      addedDate: today,
      loopCount: 0,
    })

    setNewTitle('')
    setSelectedFile(null)
    setShowAddForm(false)
  }

  const handlePlayEpisode = async (episode: Episode) => {
    if (playingEpisodeId === episode.id) {
      audio.toggle()
      return
    }

    setPlayingEpisodeId(episode.id!)

    if (episode.sourceType === 'url' && episode.url) {
      audio.loadSource(episode.url)
      audio.play()
    } else if (episode.sourceType === 'file' && episode.blobKey) {
      const audioBlob = await db.audioBlobs.where('key').equals(episode.blobKey).first()
      if (audioBlob) {
        audio.loadSource(audioBlob.blob)
        audio.play()
      }
    }
  }

  const handleDeleteEpisode = async (id: number) => {
    if (confirm('이 에피소드를 삭제하시겠습니까?')) {
      const episode = await db.episodes.get(id)
      if (episode?.blobKey) {
        await db.audioBlobs.where('key').equals(episode.blobKey).delete()
      }
      await db.episodes.delete(id)
    }
  }

  const isLocked = (episode: Episode) => {
    const today = getTodayDate()
    return episode.lockedUntilDate > today
  }

  const daysUntilUnlock = (episode: Episode) => {
    const today = new Date(getTodayDate())
    const unlock = new Date(episode.lockedUntilDate)
    const diff = Math.ceil((unlock.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold">🎧 듣기</h1>
        <p className="text-sm text-gray-500 mt-1">
          {episodes?.length || 0}개 에피소드
        </p>
      </div>

      {/* Add button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-secondary w-full mb-4"
        >
          + 에피소드 추가
        </button>
      )}

      {/* Add form */}
      {showAddForm && (
        <div className="card mb-4 space-y-4">
          <h3 className="font-medium">새 에피소드</h3>
          
          <input
            type="text"
            placeholder="제목"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl 
                       bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          {/* URL input */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">URL로 추가</label>
            <input
              type="url"
              placeholder="https://..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl 
                         bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleAddUrl}
              disabled={!newTitle.trim() || !newUrl.trim()}
              className="btn-primary w-full mt-2"
            >
              URL 추가
            </button>
          </div>

          <div className="text-center text-gray-400 text-sm">또는</div>

          {/* File input */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">파일 업로드</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/mp3,audio/m4a,audio/mpeg,audio/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary w-full"
            >
              {selectedFile ? selectedFile.name : '파일 선택'}
            </button>
            <button
              onClick={handleAddFile}
              disabled={!newTitle.trim() || !selectedFile}
              className="btn-primary w-full mt-2"
            >
              파일 추가
            </button>
          </div>

          <button
            onClick={() => {
              setShowAddForm(false)
              setNewTitle('')
              setNewUrl('')
              setSelectedFile(null)
            }}
            className="btn-ghost w-full"
          >
            취소
          </button>
        </div>
      )}

      {/* Episode list */}
      <div className="space-y-2">
        {episodes?.map((episode) => (
          <div key={episode.id} className="card">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{episode.title}</h3>
                  {isLocked(episode) && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                      🔒 {daysUntilUnlock(episode)}일
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {episode.sourceType === 'url' ? '🔗 URL' : '📁 파일'}
                  {' · '}
                  {episode.loopCount}회 반복
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePlayEpisode(episode)}
                  className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                >
                  {playingEpisodeId === episode.id && audio.isPlaying ? '⏸️' : '▶️'}
                </button>
                <button
                  onClick={() => handleDeleteEpisode(episode.id!)}
                  className="p-2 rounded-lg bg-danger-50 dark:bg-danger-900/20 text-danger-600"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Player for active episode */}
            {playingEpisodeId === episode.id && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => audio.rewind(5)}
                    className="btn-ghost px-2"
                  >
                    ⏪ 5초
                  </button>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${(audio.currentTime / audio.duration) * 100 || 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {Math.floor(audio.currentTime / 60)}:{String(Math.floor(audio.currentTime % 60)).padStart(2, '0')}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {episodes?.length === 0 && !showAddForm && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-2">🎧</p>
          <p>에피소드가 없습니다</p>
          <p className="text-sm mt-1">오디오 파일이나 URL을 추가하세요</p>
        </div>
      )}

      {/* CORS warning */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm text-gray-500">
        <p className="font-medium mb-1">💡 팁</p>
        <p>일부 URL은 CORS 정책으로 재생되지 않을 수 있습니다. 파일 업로드를 권장합니다.</p>
      </div>
    </div>
  )
}
