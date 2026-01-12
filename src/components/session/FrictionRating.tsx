'use client'

interface FrictionRatingProps {
  onRate: (rating: number) => void
}

export default function FrictionRating({ onRate }: FrictionRatingProps) {
  return (
    <div className="p-4 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">오늘 완료!</h2>
        <p className="text-gray-500">잘했어요! 내일도 화이팅!</p>
      </div>

      <div className="card w-full max-w-sm">
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
          오늘 시작하기 얼마나 어려웠나요?
        </p>
        
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => onRate(rating)}
              className="flex-1 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 font-bold text-lg
                         active:bg-primary-100 dark:active:bg-primary-900 active:text-primary-600
                         transition-colors"
            >
              {rating}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
          <span>쉬웠음</span>
          <span>어려웠음</span>
        </div>
      </div>
    </div>
  )
}
