'use client'

import { useState } from 'react'
import { rescueLines } from '@/data/sentences'

export default function RescueButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-30 bg-danger-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-lg font-bold active:scale-95 transition-transform"
        aria-label="도움말"
      >
        도움
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50">
          <div 
            className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">🆘 구조 문장</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              {rescueLines.map((line, index) => (
                <div 
                  key={index}
                  className="card p-4 space-y-1"
                >
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {line.ko}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {line.fr}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setIsOpen(false)}
                className="btn-secondary w-full"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
