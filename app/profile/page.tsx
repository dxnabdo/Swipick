'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, User, Heart, ShoppingBag, MapPin, Bell, Settings, HelpCircle } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { BottomBar } from '@/components/swipick/bottom-bar'
import Link from 'next/link'

const MENU_ITEMS = [
  { icon: Heart, label: 'المفضلة', href: '/favorites', color: '#FF3B5C' },
  { icon: ShoppingBag, label: 'طلباتي', href: '/orders', color: '#6C4DFF' },
  { icon: MapPin, label: 'عناوين التوصيل', href: '/shipping-address', color: '#4CAF50' },
  { icon: MapPin, label: 'نقاط الاستلام', href: '/pickup-points', color: '#FFC857' },
  { icon: Bell, label: 'الإشعارات', href: '/notifications', color: '#2196F3' },
  { icon: Settings, label: 'الإعدادات', href: '/settings', color: '#9E9E9E' },
  { icon: HelpCircle, label: 'المساعدة', href: '/help', color: '#A855F7' },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, favorites, orders, cart } = useAppStore()
  
  return (
    <div className="min-h-screen bg-[#0F0F1A] pb-[70px]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] glass-strong flex items-center justify-between px-4 z-50">
        <button onClick={() => router.back()}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold">حسابي</h1>
        <div className="w-6" />
      </div>
      
      <div className="pt-[70px] px-4">
        {/* User Info */}
        <div className="glass rounded-2xl p-6 flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6C4DFF] to-[#A855F7] flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-white font-bold text-lg">
              {user?.phone ? `+${user.phone}` : 'زائر'}
            </h2>
            <p className="text-[#CFCFCF] text-sm">مرحباً بك في Swipick</p>
          </div>
          {!user?.phone && (
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] text-white text-sm font-bold"
            >
              تسجيل
            </Link>
          )}
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass rounded-2xl p-4 text-center">
            <span className="text-2xl font-bold text-[#FF3B5C]">{favorites.length}</span>
            <p className="text-[#CFCFCF] text-sm mt-1">المفضلة</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <span className="text-2xl font-bold text-[#6C4DFF]">{cart.length}</span>
            <p className="text-[#CFCFCF] text-sm mt-1">السلة</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <span className="text-2xl font-bold text-[#4CAF50]">{orders.length}</span>
            <p className="text-[#CFCFCF] text-sm mt-1">الطلبات</p>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="glass rounded-2xl overflow-hidden">
          {MENU_ITEMS.map((item, index) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <span className="text-white flex-1">{item.label}</span>
                <ArrowRight className="w-5 h-5 text-[#CFCFCF] rotate-180" />
                {index < MENU_ITEMS.length - 1 && (
                  <div className="absolute bottom-0 left-4 right-4 h-px bg-[rgba(108,77,255,0.1)]" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
      
      <BottomBar />
    </div>
  )
}
