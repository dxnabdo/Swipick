'use client'

import { useState } from 'react'
import { RotateCcw, ThumbsDown, Share2, ThumbsUp, ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ActionButtonsProps {
  onUndo: () => void
  onDislike: () => void
  onShare: () => void
  onLike: () => void
  onDetails: () => void
  canUndo: boolean
}

const BUTTONS = [
  { key: 'undo', icon: RotateCcw, size: 50, color: '#9E9E9E' },
  { key: 'dislike', icon: ThumbsDown, size: 60, color: '#E94560' },
  { key: 'share', icon: Share2, size: 50, color: '#2196F3' },
  { key: 'like', icon: ThumbsUp, size: 60, color: '#4CAF50' },
  { key: 'details', icon: ArrowUp, size: 50, color: '#6C4DFF' },
]

export function ActionButtons({ onUndo, onDislike, onShare, onLike, onDetails, canUndo }: ActionButtonsProps) {
  const [showLikeText, setShowLikeText] = useState(false)
  
  const handleLike = () => {
    setShowLikeText(true)
    onLike()
    setTimeout(() => setShowLikeText(false), 500)
  }
  
  const handlers: Record<string, () => void> = {
    undo: onUndo,
    dislike: onDislike,
    share: onShare,
    like: handleLike,
    details: onDetails,
  }
  
  return (
    <>
      {/* Like Effect Overlay */}
      <AnimatePresence>
        {showLikeText && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          >
            <div className="flex flex-col items-center gap-2">
              <ThumbsUp className="w-16 h-16 text-[#4CAF50]" fill="#4CAF50" />
              <span className="text-[#4CAF50] text-2xl font-bold">أعجبني</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#141428]/90 backdrop-blur-xl border-t border-purple-500/20 z-[50]">
        {BUTTONS.map(({ key, icon: Icon, size, color }) => (
          <button
            key={key}
            onClick={handlers[key]}
            disabled={key === 'undo' && !canUndo}
            className={cn(
              "rounded-full glass flex items-center justify-center transition-all duration-200",
              "hover:scale-110 active:scale-95",
              key === 'undo' && !canUndo && "opacity-50 cursor-not-allowed hover:scale-100"
            )}
            style={{ 
              width: size, 
              height: size,
              boxShadow: `0 0 15px ${color}40`,
            }}
          >
            <Icon 
              className="transition-transform"
              style={{ 
                width: size * 0.45, 
                height: size * 0.45,
                color 
              }} 
            />
          </button>
        ))}
      </div>
    </>
  )
}
