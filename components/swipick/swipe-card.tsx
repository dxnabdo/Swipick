'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion'
import { Heart, X, ArrowUp, ThumbsUp } from 'lucide-react'
import { Product } from '@/lib/store'
import { cn } from '@/lib/utils'

interface SwipeCardProps {
  product: Product
  onSwipeRight: () => void
  onSwipeLeft: () => void
  onSwipeUp: () => void
  isTop: boolean
}

export function SwipeCard({ product, onSwipeRight, onSwipeLeft, onSwipeUp, isTop }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0)
  const [exitY, setExitY] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null)
  const [showLikeEffect, setShowLikeEffect] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // 3D rotation based on drag position (max 15 degrees)
  const rotateZ = useTransform(x, [-200, 0, 200], [-15, 0, 15])
  const rotateX = useTransform(y, [-100, 0, 100], [10, 0, -10])
  
  // Indicator opacity
  const likeOpacity = useTransform(x, [0, 80], [0, 1])
  const dislikeOpacity = useTransform(x, [-80, 0], [1, 0])
  const detailsOpacity = useTransform(y, [-80, 0], [1, 0])
  
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 80
    
    if (info.offset.x > threshold) {
      setExitX(500)
      setSwipeDirection('right')
      setShowLikeEffect(true)
      setTimeout(() => {
        onSwipeRight()
      }, 300)
    } else if (info.offset.x < -threshold) {
      setExitX(-500)
      setSwipeDirection('left')
      onSwipeLeft()
    } else if (info.offset.y < -threshold) {
      setExitY(-500)
      setSwipeDirection('up')
      onSwipeUp()
    }
  }
  
// Get category-specific glow color
  const getCategoryGlowColor = () => {
    const colors: Record<string, string> = {
      'W': '#FF4D8D',
      'M': '#1E3A8A',
      'K': '#4DA3FF',
      'SH': '#10B981',
      'BG': '#FFC857',
    }
    return colors[product.categoryCode] || '#FF4D8D'
  }
  
  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "absolute inset-0 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing swipe-card",
        !isTop && "pointer-events-none"
      )}
      style={{ 
        x, 
        y, 
        rotateZ,
        rotateX,
        transformStyle: 'preserve-3d',
      }}
      drag={isTop}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      animate={swipeDirection ? {
        x: exitX,
        y: exitY,
        opacity: 0,
        transition: { duration: 0.3 }
      } : {}}
      whileDrag={{ scale: 1.02 }}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.8 }}
    >
      {/* Category Glow Background - Radial gradient blur */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(circle at center, ${getCategoryGlowColor()}40, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />
      
      {/* Product Image */}
      <div className="absolute inset-0 bg-[#141428]">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${product.image})`,
            backgroundColor: '#1a1a2e'
          }}
        />
        {/* Gradient Overlay - 15% from bottom */}
        <div 
          className="absolute inset-x-0 bottom-0" 
          style={{ 
            height: '15%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
          }} 
        />
      </div>
      
      {/* Swipe Indicators */}
      <motion.div 
        className="absolute top-1/2 right-8 -translate-y-1/2 w-16 h-16 rounded-full bg-[#4CAF50] flex items-center justify-center"
        style={{ opacity: likeOpacity }}
      >
        <Heart className="w-8 h-8 text-white" fill="white" />
      </motion.div>
      
      <motion.div 
        className="absolute top-1/2 left-8 -translate-y-1/2 w-16 h-16 rounded-full bg-[#E94560] flex items-center justify-center"
        style={{ opacity: dislikeOpacity }}
      >
        <X className="w-8 h-8 text-white" />
      </motion.div>
      
      <motion.div 
        className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-[#6C4DFF] flex items-center justify-center"
        style={{ opacity: detailsOpacity }}
      >
        <ArrowUp className="w-8 h-8 text-white" />
      </motion.div>
      
      {/* "أعجبني" Like Effect */}
      <AnimatePresence>
        {showLikeEffect && (
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
      
      {/* Product Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-[80px] px-4 py-3 flex flex-col justify-end">
        {/* Line 1: Brand - Product */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#6C4DFF] font-bold">{product.brand}</span>
          <span className="text-white">-</span>
          <span className="text-white font-bold">{product.productType}</span>
        </div>
        
        {/* Line 2: Price | Size | Condition */}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[#FFC857] font-bold">{product.price} درهم</span>
          <span className="text-[#CFCFCF]">|</span>
          <span className="text-[#CFCFCF]">{product.size}</span>
          <span className="text-[#CFCFCF]">|</span>
          <span className="text-[#4CAF50]">ممتاز</span>
        </div>
      </div>
    </motion.div>
  )
}
