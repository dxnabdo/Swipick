'use client'

import { X } from 'lucide-react'
import { useAppStore } from '@/lib/store'

const NEWS_MESSAGES = [
  "نوصلوه ليك أو تستالموا في المتجر",
  "سويب لليمين إلا عجبك المنتج",
  "ديما كاين الجديد فSwipick",
  "تسوق مع صحابك أو العائلة بسهولة",
  "Swipick — سويب، اختار، واستلم بسهولة",
]

export function NewsBar() {
  const { isNewsBarVisible, hideNewsBar } = useAppStore()
  
  if (!isNewsBarVisible) return null
  
  return (
    <div className="h-[25px] bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] flex items-center overflow-hidden relative">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...NEWS_MESSAGES, ...NEWS_MESSAGES].map((message, index) => (
          <span key={index} className="mx-8 text-sm text-white">
            {message}
          </span>
        ))}
      </div>
      <button 
        onClick={hideNewsBar}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-3 h-3 text-white" />
      </button>
    </div>
  )
}
