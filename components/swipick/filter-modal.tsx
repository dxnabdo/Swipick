'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface FilterState {
  priceRange: string
  brands: string[]
  sizes: string[]
  categories: string[]
  sortBy: string
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onApply: (filters: FilterState) => void
}

const PRICE_RANGES = [
  { value: 'all', label: 'الكل' },
  { value: '0-100', label: '<100' },
  { value: '100-200', label: '100-200' },
  { value: '200-300', label: '200-300' },
  { value: '300-500', label: '300-500' },
  { value: '500+', label: '>500' },
]

const BRANDS = ['Zara', 'Nike', 'Adidas', 'Louis Vuitton', 'Gucci', 'H&M', 'Uniqlo', 'Puma']

const CATEGORIES = [
  { value: 'W', label: 'نساء' },
  { value: 'M', label: 'رجال' },
  { value: 'K', label: 'أطفال' },
  { value: 'SH', label: 'أحذية' },
  { value: 'BG', label: 'حقائب' },
]

const SIZE_GROUPS = {
  women: { label: 'نساء', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  men: { label: 'رجال', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  kids: { label: 'أطفال', sizes: ['2Y', '4Y', '6Y', '8Y', '10Y', '12Y'] },
  shoes: { label: 'أحذية', sizes: ['36', '37', '38', '39', '40', '41', '42'] },
  bags: { label: 'حقائب', sizes: ['OS'] },
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'price-asc', label: 'السعر: الأقل للأعلى' },
  { value: 'price-desc', label: 'السعر: الأعلى للأقل' },
  { value: 'popular', label: 'الأكثر إعجاباً' },
]

export function FilterModal({ isOpen, onClose, filters, onApply }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)
  
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])
  
  const handleReset = () => {
    setLocalFilters({
      priceRange: 'all',
      brands: [],
      sizes: [],
      categories: [],
      sortBy: 'newest',
    })
  }
  
  const handleApply = () => {
    onApply(localFilters)
    onClose()
  }
  
  const toggleBrand = (brand: string) => {
    setLocalFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }))
  }
  
  const toggleSize = (size: string) => {
    setLocalFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }
  
  const toggleCategory = (category: string) => {
    setLocalFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-[#141428] rounded-t-3xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#6C4DFF]/20">
              <h2 className="text-xl font-bold text-white">فرز وتصفية</h2>
              <button onClick={onClose} className="p-2">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)] space-y-6">
              {/* Price Range */}
              <div>
                <h3 className="text-white font-bold mb-3">السعر</h3>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setLocalFilters(prev => ({ ...prev, priceRange: value }))}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm transition-all",
                        localFilters.priceRange === value
                          ? "bg-[#6C4DFF] text-white"
                          : "glass text-[#CFCFCF] hover:bg-[#6C4DFF]/20"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Brands */}
              <div>
                <h3 className="text-white font-bold mb-3">الماركة</h3>
                <div className="flex flex-wrap gap-2">
                  {BRANDS.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm transition-all",
                        localFilters.brands.includes(brand)
                          ? "bg-[#6C4DFF] text-white"
                          : "glass text-[#CFCFCF] hover:bg-[#6C4DFF]/20"
                      )}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Categories */}
              <div>
                <h3 className="text-white font-bold mb-3">الفئة</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => toggleCategory(value)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm transition-all",
                        localFilters.categories.includes(value)
                          ? "bg-[#6C4DFF] text-white"
                          : "glass text-[#CFCFCF] hover:bg-[#6C4DFF]/20"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sizes by Category */}
              <div>
                <h3 className="text-white font-bold mb-3">المقاس</h3>
                {Object.entries(SIZE_GROUPS).map(([key, { label, sizes }]) => (
                  <div key={key} className="mb-4">
                    <p className="text-[#CFCFCF] text-sm mb-2">{label}</p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={`${key}-${size}`}
                          onClick={() => toggleSize(size)}
                          className={cn(
                            "w-12 h-12 rounded-xl text-sm transition-all flex items-center justify-center",
                            localFilters.sizes.includes(size)
                              ? "bg-[#6C4DFF] text-white"
                              : "glass text-[#CFCFCF] hover:bg-[#6C4DFF]/20"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Sort */}
              <div>
                <h3 className="text-white font-bold mb-3">الترتيب</h3>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setLocalFilters(prev => ({ ...prev, sortBy: value }))}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm transition-all",
                        localFilters.sortBy === value
                          ? "bg-[#6C4DFF] text-white"
                          : "glass text-[#CFCFCF] hover:bg-[#6C4DFF]/20"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex gap-4 p-6 border-t border-[#6C4DFF]/20">
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-xl glass text-[#CFCFCF] font-bold hover:bg-[#6C4DFF]/20 transition-colors"
              >
                إعادة ضبط
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-3 rounded-xl bg-[#6C4DFF] text-white font-bold neon-button hover:opacity-90 transition-opacity"
              >
                تطبيق
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
