'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Bell, Package, Tag, Info } from 'lucide-react'
import { BottomBar } from '@/components/swipick/bottom-bar'

const DEMO_NOTIFICATIONS = [
  {
    id: '1',
    title: 'مرحباً بك في Swipick!',
    message: 'ابدأ بالسويب واكتشف منتجات جديدة كل يوم',
    type: 'system',
    read: false,
    createdAt: Date.now() - 1000 * 60 * 5,
  },
  {
    id: '2',
    title: 'منتجات جديدة!',
    message: 'شوف التشكيلة الجديدة من Nike و Adidas',
    type: 'product',
    read: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: '3',
    title: 'عرض خاص',
    message: 'توصيل مجاني لجميع الطلبات هذا الأسبوع',
    type: 'promo',
    read: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
]

const NOTIFICATION_ICONS = {
  system: { icon: Info, color: '#6C4DFF' },
  product: { icon: Package, color: '#4CAF50' },
  promo: { icon: Tag, color: '#FFC857' },
  order: { icon: Bell, color: '#2196F3' },
}

export default function NotificationsPage() {
  const router = useRouter()
  
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) return `قبل ${minutes} دقيقة`
    if (hours < 24) return `قبل ${hours} ساعة`
    return `قبل ${days} يوم`
  }
  
  return (
    <div className="min-h-screen bg-[#0F0F1A] pb-[70px]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] glass-strong flex items-center justify-between px-4 z-50">
        <button onClick={() => router.back()}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold">الإشعارات</h1>
        <div className="w-6" />
      </div>
      
      <div className="pt-[70px] px-4">
        {DEMO_NOTIFICATIONS.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-[#6C4DFF]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">لا توجد إشعارات</h2>
            <p className="text-[#CFCFCF]">سنخبرك بكل جديد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {DEMO_NOTIFICATIONS.map((notification) => {
              const config = NOTIFICATION_ICONS[notification.type as keyof typeof NOTIFICATION_ICONS]
              const Icon = config.icon
              
              return (
                <div 
                  key={notification.id} 
                  className={`glass rounded-2xl p-4 flex gap-4 ${!notification.read ? 'border border-[#6C4DFF]/30' : ''}`}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: config.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-white font-bold">{notification.title}</h3>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-[#6C4DFF] flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-[#CFCFCF] text-sm mt-1">{notification.message}</p>
                    <p className="text-[#CFCFCF] text-xs mt-2">{formatTime(notification.createdAt)}</p>
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
