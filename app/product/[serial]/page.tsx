'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Heart, ShoppingCart, Share2, Check } from 'lucide-react'
import { useAppStore, Product, CATEGORY_GLOW } from '@/lib/store'
import { cn } from '@/lib/utils'

interface PageProps {
  params: Promise<{ serial: string }>
}

export default function ProductPage({ params }: PageProps) {
  const { serial } = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)
  
  const { 
    addToCart, 
    addToFavorites, 
    removeFromFavorites,
    isFavorite,
    cart 
  } = useAppStore()
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        const found = Array.isArray(data) 
          ? data.find((p: Product) => p.serial === serial)
          : null
        setProduct(found || null)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [serial])
  
  if (loading) {
    return (
      <div className="h-screen bg-[#0F0F1A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6C4DFF] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="h-screen bg-[#0F0F1A] flex flex-col items-center justify-center text-center px-8">
        <h2 className="text-xl font-bold text-white mb-2">المنتج غير موجود</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 rounded-xl glass text-white"
        >
          الرجوع
        </button>
      </div>
    )
  }
  
  const isInCart = cart.some(item => item.id === product.id)
  const isLiked = isFavorite(product.id)
  const glowClass = CATEGORY_GLOW[product.categoryCode] || 'glow-women'
  
  const handleAddToCart = () => {
    addToCart(product)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }
  
  const handleToggleFavorite = () => {
    if (isLiked) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }
  
  const handleShare = async () => {
    const shareData = {
      title: `${product.brand} - ${product.productType}`,
      text: `شوف هاد المنتج في Swipick: ${product.price} درهم`,
      url: window.location.href,
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareData.url)
      alert('تم نسخ الرابط!')
    }
  }
  
  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] glass-strong flex items-center justify-between px-4 z-50">
        <button onClick={() => router.back()}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold">تفاصيل المنتج</h1>
        <button onClick={handleShare}>
          <Share2 className="w-6 h-6 text-white" />
        </button>
      </div>
      
      {/* Product Image */}
      <div className="relative pt-[60px]">
        <div className={cn(
          "absolute inset-0 opacity-20 blur-[60px]",
          glowClass
        )} />
        <div 
          className="w-full aspect-square bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${product.image})`,
            backgroundColor: '#1a1a2e'
          }}
        />
      </div>
      
      {/* Product Info */}
      <div className="px-4 py-6 space-y-4">
        {/* Brand & Name */}
        <div>
          <span className="text-[#6C4DFF] text-lg font-bold">{product.brand}</span>
          <h2 className="text-2xl font-bold text-white mt-1">{product.productType}</h2>
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-[#FFC857]">{product.price}</span>
          <span className="text-[#CFCFCF]">درهم</span>
        </div>
        
        {/* Details */}
        <div className="glass rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[#CFCFCF]">الفئة</span>
            <span className="text-white">{product.category}</span>
          </div>
          <div className="h-px bg-[rgba(108,77,255,0.2)]" />
          <div className="flex justify-between items-center">
            <span className="text-[#CFCFCF]">المقاس</span>
            <span className="text-white">{product.size}</span>
          </div>
          <div className="h-px bg-[rgba(108,77,255,0.2)]" />
          <div className="flex justify-between items-center">
            <span className="text-[#CFCFCF]">الحالة</span>
            <span className="text-[#4CAF50]">ممتاز</span>
          </div>
          <div className="h-px bg-[rgba(108,77,255,0.2)]" />
          <div className="flex justify-between items-center">
            <span className="text-[#CFCFCF]">التوصيل</span>
            <span className="text-white">مراكش و أكادير</span>
          </div>
        </div>
        
        {/* Delivery Info */}
        <div className="glass rounded-2xl p-4">
          <p className="text-[#CFCFCF] text-sm">
            التوصيل مجاني للطلبات فوق 200 درهم
          </p>
        </div>
      </div>
      
      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 h-[80px] glass-strong flex items-center gap-4 px-4">
        <button
          onClick={handleToggleFavorite}
          className={cn(
            "w-14 h-14 rounded-2xl glass flex items-center justify-center transition-all",
            isLiked && "bg-[#FF3B5C]/20"
          )}
        >
          <Heart 
            className="w-6 h-6" 
            fill={isLiked ? "#FF3B5C" : "none"}
            color="#FF3B5C"
          />
        </button>
        
        <button
          onClick={handleAddToCart}
          disabled={isInCart}
          className={cn(
            "flex-1 h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all",
            isInCart || addedToCart
              ? "bg-[#4CAF50] text-white"
              : "bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] text-white neon-button"
          )}
        >
          {isInCart || addedToCart ? (
            <>
              <Check className="w-5 h-5" />
              <span>في السلة</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>أضف للسلة</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
