'use client'

import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { id: 'all', name: 'الكل' },
  { id: 'W', name: 'نساء' },
  { id: 'M', name: 'رجال' },
  { id: 'K', name: 'أطفال' },
  { id: 'SH', name: 'أحذية' },
  { id: 'BG', name: 'حقائب' },
]

export function CategoriesBar() {
  const { activeCategory, setActiveCategory } = useAppStore()
  
  return (
    <div className="h-[30px] flex items-center justify-center gap-6 bg-[#0F0F1A]">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={cn(
            "text-sm transition-all duration-200 relative pb-1",
            activeCategory === category.id
              ? "text-white font-bold"
              : "text-[#CFCFCF] hover:text-white"
          )}
        >
          {category.name}
          {activeCategory === category.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C4DFF] rounded-full" />
          )}
        </button>
      ))}
    </div>
  )
}
