'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Trash2, ShoppingBag } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { BottomBar } from '@/components/swipick/bottom-bar'
import Link from 'next/link'

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, clearCart } = useAppStore()
  
  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const isFreeDelivery = total >= 200
  
  return (
    <div className="min-h-screen bg-[#0F0F1A] pb-[130px]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] glass-strong flex items-center justify-between px-4 z-50">
        <button onClick={() => router.back()}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold">السلة</h1>
        {cart.length > 0 && (
          <button onClick={clearCart} className="text-[#E94560] text-sm">
            مسح الكل
          </button>
        )}
      </div>
      
      <div className="pt-[70px] px-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-[#6C4DFF]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">السلة فارغة</h2>
            <p className="text-[#CFCFCF] mb-6">ابدأ بإضافة منتجات للسلة</p>
            <Link
              href="/swipe"
              className="px-8 py-3 rounded-xl bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] text-white font-bold"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="glass rounded-2xl p-3 flex gap-4"
                >
                  <div 
                    className="w-24 h-24 rounded-xl bg-cover bg-center flex-shrink-0"
                    style={{ 
                      backgroundImage: `url(${item.image})`,
                      backgroundColor: '#1a1a2e'
                    }}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[#6C4DFF] text-sm">{item.brand}</span>
                      <h3 className="text-white font-bold">{item.productType}</h3>
                      <p className="text-[#CFCFCF] text-sm">المقاس: {item.size}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#FFC857] font-bold">{item.price} درهم</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-lg glass flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4 text-[#E94560]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Summary */}
            <div className="glass rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#CFCFCF]">المجموع</span>
                <span className="text-white font-bold">{total} درهم</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#CFCFCF]">التوصيل</span>
                <span className={isFreeDelivery ? "text-[#4CAF50]" : "text-white"}>
                  {isFreeDelivery ? 'مجاني' : 'حسب المنطقة'}
                </span>
              </div>
              {!isFreeDelivery && (
                <p className="text-[#CFCFCF] text-sm">
                  أضف {200 - total} درهم للتوصيل المجاني
                </p>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Checkout Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-[60px] left-0 right-0 p-4 glass-strong">
          <Link
            href="/checkout"
            className="block w-full h-14 rounded-2xl bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] text-white font-bold text-lg flex items-center justify-center neon-button"
          >
            متابعة الطلب ({total} درهم)
          </Link>
        </div>
      )}
      
      <BottomBar />
    </div>
  )
}
