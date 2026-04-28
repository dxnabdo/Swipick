'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Package, Clock, Check, X } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { BottomBar } from '@/components/swipick/bottom-bar'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  pending: { label: 'قيد الانتظار', color: '#FFC857', icon: Clock },
  confirmed: { label: 'مؤكد', color: '#2196F3', icon: Check },
  ready: { label: 'جاهز للاستلام', color: '#4CAF50', icon: Package },
  completed: { label: 'مكتمل', color: '#4CAF50', icon: Check },
  cancelled: { label: 'ملغي', color: '#E94560', icon: X },
}

export default function OrdersPage() {
  const router = useRouter()
  const { orders } = useAppStore()
  
  const sortedOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt)
  
  return (
    <div className="min-h-screen bg-[#0F0F1A] pb-[70px]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] glass-strong flex items-center justify-between px-4 z-50">
        <button onClick={() => router.back()}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold">طلباتي</h1>
        <div className="w-6" />
      </div>
      
      <div className="pt-[70px] px-4">
        {sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-[#6C4DFF]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">لا توجد طلبات</h2>
            <p className="text-[#CFCFCF]">ابدأ بالتسوق وإضافة منتجات</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => {
              const status = STATUS_CONFIG[order.status]
              const StatusIcon = status.icon
              const date = new Date(order.createdAt).toLocaleDateString('ar-MA', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
              
              return (
                <div key={order.id} className="glass rounded-2xl p-4">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[#6C4DFF] text-sm">{order.id}</span>
                      <p className="text-[#CFCFCF] text-xs">{date}</p>
                    </div>
                    <div 
                      className={cn(
                        "flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                      )}
                      style={{ 
                        backgroundColor: `${status.color}20`,
                        color: status.color 
                      }}
                    >
                      <StatusIcon className="w-4 h-4" />
                      <span>{status.label}</span>
                    </div>
                  </div>
                  
                  {/* Products */}
                  <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="w-16 h-16 rounded-xl flex-shrink-0 bg-cover bg-center"
                        style={{ 
                          backgroundImage: `url(${item.image})`,
                          backgroundColor: '#1a1a2e'
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Order Info */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#CFCFCF]">
                      {order.method === 'pickup' ? 'استلام' : 'توصيل'} - {order.city === 'marrakech' ? 'مراكش' : 'أكادير'}
                    </span>
                    <span className="text-[#FFC857] font-bold">{order.total} درهم</span>
                  </div>
                  
                  {order.method === 'pickup' && order.pickupPoint && (
                    <p className="text-[#CFCFCF] text-xs mt-2">
                      نقطة الاستلام: {order.pickupPoint} | {order.timeSlot}
                    </p>
                  )}
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
