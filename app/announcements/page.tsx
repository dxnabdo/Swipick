'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Megaphone, Calendar, ExternalLink } from 'lucide-react'
import { BottomBar } from '@/components/swipick/bottom-bar'

const ANNOUNCEMENTS = [
  {
    id: '1',
    title: 'افتتاح نقطة استلام جديدة في أكادير!',
    content: 'يسعدنا الإعلان عن افتتاح نقطة استلام جديدة في حي السلام بأكادير. الآن يمكنكم استلام طلباتكم بسهولة أكثر.',
    date: '2026-04-20',
    image: null,
    link: '/pickup-points',
  },
  {
    id: '2',
    title: 'عرض خاص: توصيل مجاني!',
    content: 'لفترة محدودة، استفيدوا من التوصيل المجاني لجميع الطلبات بدون حد أدنى. العرض ساري حتى نهاية الشهر.',
    date: '2026-04-15',
    image: null,
    link: null,
  },
  {
    id: '3',
    title: 'تشكيلة صيف 2026 متوفرة الآن',
    content: 'اكتشفوا أحدث صيحات الموضة لصيف 2026 من أشهر الماركات العالمية. منتجات جديدة تضاف يومياً!',
    date: '2026-04-01',
    image: null,
    link: '/swipe',
  },
]

export default function AnnouncementsPage() {
  const router = useRouter()
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ar-MA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
  
  return (
    <div className="min-h-screen bg-[#0F0F1A] pb-[70px]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] glass-strong flex items-center justify-between px-4 z-50">
        <button onClick={() => router.back()}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold">الإعلانات</h1>
        <div className="w-6" />
      </div>
      
      <div className="pt-[70px] px-4">
        {ANNOUNCEMENTS.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-4">
              <Megaphone className="w-10 h-10 text-[#6C4DFF]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">لا توجد إعلانات</h2>
            <p className="text-[#CFCFCF]">تابعنا للحصول على آخر الأخبار</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ANNOUNCEMENTS.map((announcement) => (
              <div key={announcement.id} className="glass rounded-2xl overflow-hidden">
                {announcement.image && (
                  <div 
                    className="w-full h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${announcement.image})` }}
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Megaphone className="w-4 h-4 text-[#6C4DFF]" />
                    <span className="text-[#6C4DFF] text-sm font-bold">إعلان</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{announcement.title}</h3>
                  <p className="text-[#CFCFCF] text-sm leading-relaxed mb-3">
                    {announcement.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#CFCFCF]" />
                      <span className="text-[#CFCFCF] text-sm">{formatDate(announcement.date)}</span>
                    </div>
                    {announcement.link && (
                      <button
                        onClick={() => router.push(announcement.link!)}
                        className="flex items-center gap-1 text-[#6C4DFF] text-sm"
                      >
                        <span>المزيد</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <BottomBar />
    </div>
  )
}
