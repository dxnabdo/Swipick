'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Users, Copy, Check, Share2, ShoppingCart, ToggleLeft, ToggleRight } from 'lucide-react'
import { useAppStore, Product } from '@/lib/store'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ roomId: string }>
}

export default function SharedShoppingPage({ params }: PageProps) {
  const { roomId } = use(params)
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [syncSwipe, setSyncSwipe] = useState(false)
  const [sharedProducts, setSharedProducts] = useState<Product[]>([])
  const { favorites, addToCart } = useAppStore()
  
  useEffect(() => {
    // In a real app, this would sync with a backend
    // For now, just show favorites as shared products
    setSharedProducts(favorites.slice(0, 4))
  }, [favorites])
  
  const copyLink = async () => {
    const link = `${window.location.origin}/shared-shopping/${roomId}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const shareWhatsApp = () => {
    const link = `${window.location.origin}/shared-shopping/${roomId}`
    const message = `تعال نتسوقو مع بعض في Swipick! 🛍️\n\nالكود: ${roomId}\n${link}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }
  
  return (
    <div className="min-h-screen bg-[#0F0F1A] pb-[100px]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] glass-strong flex items-center justify-between px-4 z-50">
        <button onClick={() => router.back()}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold">غرفة التسوق</h1>
        <button onClick={shareWhatsApp}>
          <Share2 className="w-6 h-6 text-white" />
        </button>
      </div>
      
      <div className="pt-[70px] px-4">
        {/* Room Info */}
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6C4DFF]/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#6C4DFF]" />
              </div>
              <div>
                <p className="text-[#CFCFCF] text-sm">كود الغرفة</p>
                <p className="text-white font-bold text-lg tracking-widest">{roomId}</p>
              </div>
            </div>
            <button
              onClick={copyLink}
              className="px-4 py-2 rounded-xl glass flex items-center gap-2"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#4CAF50]" />
              ) : (
                <Copy className="w-4 h-4 text-[#6C4DFF]" />
              )}
              <span className="text-white text-sm">{copied ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          </div>
          
          {/* Participants */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 space-x-reverse">
              <div className="w-8 h-8 rounded-full bg-[#6C4DFF] flex items-center justify-center text-white text-sm font-bold border-2 border-[#0F0F1A]">
                أ
              </div>
              <div className="w-8 h-8 rounded-full bg-[#A855F7] flex items-center justify-center text-white text-sm font-bold border-2 border-[#0F0F1A]">
                +
              </div>
            </div>
            <span className="text-[#CFCFCF] text-sm">في انتظار المشاركين...</span>
          </div>
        </div>
        
        {/* Sync Toggle */}
        <div className="glass rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold">مزامنة السويب</h3>
            <p className="text-[#CFCFCF] text-sm">شوفو نفس المنتجات معاً</p>
          </div>
          <button onClick={() => setSyncSwipe(!syncSwipe)}>
            {syncSwipe ? (
              <ToggleRight className="w-12 h-8 text-[#6C4DFF]" />
            ) : (
              <ToggleLeft className="w-12 h-8 text-[#CFCFCF]" />
            )}
          </button>
        </div>
        
        {/* Shared Likes */}
        <h2 className="text-white font-bold text-lg mb-4">المنتجات المشتركة</h2>
        {sharedProducts.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <ShoppingCart className="w-12 h-12 text-[#6C4DFF] mx-auto mb-4" />
            <p className="text-white font-bold mb-2">لا توجد منتجات مشتركة</p>
            <p className="text-[#CFCFCF] text-sm mb-4">
              ابدأ بالسويب مع صحابك وشوفو شنو عجبكم
            </p>
            <Link
              href="/swipe"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] text-white font-bold"
            >
              ابدأ السويب
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {sharedProducts.map((product) => (
              <div key={product.id} className="glass rounded-2xl overflow-hidden">
                <Link href={`/product/${product.serial}`}>
                  <div 
                    className="w-full aspect-square bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${product.image})`,
                      backgroundColor: '#1a1a2e'
                    }}
                  />
                </Link>
                <div className="p-3">
                  <span className="text-[#6C4DFF] text-xs">{product.brand}</span>
                  <h3 className="text-white font-bold text-sm truncate">{product.productType}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[#FFC857] font-bold text-sm">{product.price} درهم</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-8 h-8 rounded-lg bg-[#6C4DFF] flex items-center justify-center"
                    >
                      <ShoppingCart className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass-strong flex gap-4">
        <Link
          href="/swipe"
          className="flex-1 h-14 rounded-2xl bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] text-white font-bold flex items-center justify-center"
        >
          تصفح المنتجات
        </Link>
        <button
          onClick={shareWhatsApp}
          className="h-14 px-6 rounded-2xl glass text-[#25D366] font-bold flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          مشاركة
        </button>
      </div>
    </div>
  )
}
