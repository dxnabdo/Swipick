'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Heart, ShoppingCart } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { BottomBar } from '@/components/swipick/bottom-bar'
import Link from 'next/link'

export default function FavoritesPage() {
  const router = useRouter()
  const { favorites, removeFromFavorites, addToCart, cart } = useAppStore()
  
  return (
    <div className="min-h-screen bg-[#0F0F1A] pb-[70px]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] glass-strong flex items-center justify-between px-4 z-50">
        <button onClick={() => router.back()}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold">المفضلة</h1>
        <div className="w-6" />
      </div>
      
      <div className="pt-[70px] px-4">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-[#FF3B5C]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">لا توجد مفضلات</h2>
            <p className="text-[#CFCFCF] mb-6">سويب لليمين لإضافة منتجات</p>
            <Link
              href="/swipe"
              className="px-8 py-3 rounded-xl bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] text-white font-bold"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {favorites.map((item) => {
              const isInCart = cart.some(c => c.id === item.id)
              
              return (
                <div
                  key={item.id}
                  className="glass rounded-2xl overflow-hidden"
                >
                  <Link href={`/product/${item.serial}`}>
                    <div 
                      className="w-full aspect-square bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url(${item.image})`,
                        backgroundColor: '#1a1a2e'
                      }}
                    />
                  </Link>
                  <div className="p-3">
                    <span className="text-[#6C4DFF] text-xs">{item.brand}</span>
                    <h3 className="text-white font-bold text-sm truncate">{item.productType}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#FFC857] font-bold text-sm">{item.price} درهم</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => removeFromFavorites(item.id)}
                          className="w-8 h-8 rounded-lg glass flex items-center justify-center"
                        >
                          <Heart className="w-4 h-4 text-[#FF3B5C]" fill="#FF3B5C" />
                        </button>
                        <button
                          onClick={() => addToCart(item)}
                          disabled={isInCart}
                          className="w-8 h-8 rounded-lg glass flex items-center justify-center"
                        >
                          <ShoppingCart 
                            className="w-4 h-4" 
                            color={isInCart ? "#4CAF50" : "#6C4DFF"}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      
      <BottomBar />
    </div>
  )
}
