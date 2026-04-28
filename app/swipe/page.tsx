'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/swipick/top-bar'
import { NewsBar } from '@/components/swipick/news-bar'
import { CategoriesBar } from '@/components/swipick/categories-bar'
import { BottomBar } from '@/components/swipick/bottom-bar'
import { SideMenu } from '@/components/swipick/side-menu'
import { SwipeCard } from '@/components/swipick/swipe-card'
import { ActionButtons } from '@/components/swipick/action-buttons'
import { FilterModal, FilterState } from '@/components/swipick/filter-modal'
import { useAppStore, Product } from '@/lib/store'
import { Loader2 } from 'lucide-react'

const initialFilters: FilterState = {
  priceRange: 'all',
  brands: [],
  sizes: [],
  categories: [],
  sortBy: 'newest',
}

export default function SwipePage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  
  const { 
    activeCategory,
    addToCart,
    addToFavorites,
    likeProduct,
    isProductHidden,
    rejectProduct,
    rejectedProducts,
    undoLastReject,
    cleanupExpiredLikes 
  } = useAppStore()
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const category = activeCategory === 'all' ? '' : activeCategory
        const res = await fetch(`/api/products${category ? `?category=${category}` : ''}`)
        const data = await res.json()
        
        // Filter out hidden and rejected products
        const filtered = Array.isArray(data) 
          ? data.filter((p: Product) => !isProductHidden(p.id) && !rejectedProducts.includes(p.id))
          : []
        
        setProducts(filtered)
        setCurrentIndex(0)
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    cleanupExpiredLikes()
    fetchProducts()
  }, [activeCategory, cleanupExpiredLikes, isProductHidden, rejectedProducts])
  
  // Filter and search products
  const filteredProducts = useMemo(() => {
    let result = [...products]
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p => 
        p.brand.toLowerCase().includes(query) ||
        p.productType.toLowerCase().includes(query) ||
        p.size.toLowerCase().includes(query)
      )
    }
    
    // Price filter
    if (filters.priceRange !== 'all') {
      result = result.filter(p => {
        switch (filters.priceRange) {
          case '0-100': return p.price < 100
          case '100-200': return p.price >= 100 && p.price < 200
          case '200-300': return p.price >= 200 && p.price < 300
          case '300-500': return p.price >= 300 && p.price < 500
          case '500+': return p.price >= 500
          default: return true
        }
      })
    }
    
    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand))
    }
    
    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.categoryCode))
    }
    
    // Size filter
    if (filters.sizes.length > 0) {
      result = result.filter(p => filters.sizes.includes(p.size))
    }
    
    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        // Keep original order for popular (would need likes data for real implementation)
        break
      default:
        // newest - reverse order (newest first)
        result.reverse()
    }
    
    return result
  }, [products, searchQuery, filters])
  
  const currentProduct = filteredProducts[currentIndex]
  const nextProduct = filteredProducts[currentIndex + 1]
  
  const goToNext = useCallback(() => {
    if (currentIndex < filteredProducts.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentIndex, filteredProducts.length])
  
  const handleSwipeRight = useCallback(() => {
    if (!currentProduct) return
    likeProduct(currentProduct.id)
    addToCart(currentProduct)
    addToFavorites(currentProduct)
    goToNext()
  }, [currentProduct, likeProduct, addToCart, addToFavorites, goToNext])
  
  const handleSwipeLeft = useCallback(() => {
    if (!currentProduct) return
    rejectProduct(currentProduct.id)
    goToNext()
  }, [currentProduct, rejectProduct, goToNext])
  
  const handleSwipeUp = useCallback(() => {
    if (!currentProduct) return
    router.push(`/product/${currentProduct.serial}`)
  }, [currentProduct, router])
  
  const handleUndo = useCallback(() => {
    const lastRejected = undoLastReject()
    if (lastRejected && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }, [undoLastReject, currentIndex])
  
  const handleShare = useCallback(async () => {
    if (!currentProduct) return
    
    const shareData = {
      title: `${currentProduct.brand} - ${currentProduct.productType}`,
      text: `شوف هاد المنتج في Swipick: ${currentProduct.price} درهم`,
      url: `${window.location.origin}/product/${currentProduct.serial}`,
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareData.url)
      alert('تم نسخ الرابط!')
    }
  }, [currentProduct])
  
  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentIndex(0)
  }, [])
  
  return (
    <div className="h-screen flex flex-col bg-[#0F0F1A] overflow-hidden">
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <NewsBar />
      <CategoriesBar />
      
      {/* Swipe Area */}
      <div className="flex-1 relative overflow-hidden pb-[50px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#6C4DFF] animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-4">
              <span className="text-4xl">🛍️</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">ما كاين منتجات</h2>
            <p className="text-[#CFCFCF]">جرب تغير الفئة أو الفلتر أو رجع لاحقاً</p>
          </div>
        ) : (
          <>
            {/* Cards Stack */}
            <div className="absolute inset-4 mb-[100px]">
              {nextProduct && (
                <SwipeCard
                  key={nextProduct.id}
                  product={nextProduct}
                  onSwipeRight={() => {}}
                  onSwipeLeft={() => {}}
                  onSwipeUp={() => {}}
                  isTop={false}
                />
              )}
              {currentProduct && (
                <SwipeCard
                  key={currentProduct.id}
                  product={currentProduct}
                  onSwipeRight={handleSwipeRight}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeUp={handleSwipeUp}
                  isTop={true}
                />
              )}
            </div>
            
            {/* Action Buttons */}
            <ActionButtons
              onUndo={handleUndo}
              onDislike={handleSwipeLeft}
              onShare={handleShare}
              onLike={handleSwipeRight}
              onDetails={handleSwipeUp}
              canUndo={rejectedProducts.length > 0}
            />
          </>
        )}
      </div>
      
      <BottomBar onFilterClick={() => setIsFilterOpen(true)} />
      <SideMenu />
      
      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApply={handleApplyFilters}
      />
    </div>
  )
}
