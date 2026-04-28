'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, MapPin, Plus, Check } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { BottomBar } from '@/components/swipick/bottom-bar'
import { cn } from '@/lib/utils'

export default function ShippingAddressPage() {
  const router = useRouter()
  const { user, setUser } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [address, setAddress] = useState(user?.address || '')
  const [city, setCity] = useState(user?.city || 'marrakech')
  
  const handleSave = () => {
    setUser({ ...user, address, city })
    setIsEditing(false)
  }
  
  return (
    <div className="min-h-screen bg-[#0F0F1A] pb-[70px]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] glass-strong flex items-center justify-between px-4 z-50">
        <button onClick={() => router.back()}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold">عناوين التوصيل</h1>
        <div className="w-6" />
      </div>
      
      <div className="pt-[70px] px-4">
        {!user?.address && !isEditing ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-4">
              <MapPin className="w-10 h-10 text-[#4CAF50]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">لا يوجد عنوان</h2>
            <p className="text-[#CFCFCF] mb-6">أضف عنوان التوصيل الخاص بك</p>
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-3 rounded-xl bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] text-white font-bold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة عنوان
            </button>
          </div>
        ) : isEditing ? (
          <div className="space-y-4">
            <h2 className="text-white font-bold text-lg mb-4">
              {user?.address ? 'تعديل العنوان' : 'إضافة عنوان جديد'}
            </h2>
            
            {/* City Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCity('marrakech')}
                className={cn(
                  "glass rounded-2xl p-4 text-center transition-all",
                  city === 'marrakech' && "border-[#6C4DFF] border-2"
                )}
              >
                <span className="text-white font-bold">مراكش</span>
              </button>
              <button
                onClick={() => setCity('agadir')}
                className={cn(
                  "glass rounded-2xl p-4 text-center transition-all",
                  city === 'agadir' && "border-[#6C4DFF] border-2"
                )}
              >
                <span className="text-white font-bold">أكادير</span>
              </button>
            </div>
            
            {/* Address Input */}
            <div className="glass rounded-2xl p-4">
              <label className="text-[#CFCFCF] text-sm mb-2 block">العنوان الكامل</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="الحي، الشارع، رقم المنزل..."
                className="w-full h-32 bg-transparent border-none outline-none text-white placeholder:text-[#CFCFCF] resize-none"
              />
            </div>
            
            <button
              onClick={handleSave}
              className="w-full h-14 rounded-2xl bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] text-white font-bold"
            >
              حفظ العنوان
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#4CAF50]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold">
                      {user?.city === 'marrakech' ? 'مراكش' : 'أكادير'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#4CAF50]/20 text-[#4CAF50] text-xs">
                      الافتراضي
                    </span>
                  </div>
                  <p className="text-[#CFCFCF] text-sm">{user?.address}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full mt-4 py-2 rounded-xl glass text-[#6C4DFF] font-medium"
              >
                تعديل
              </button>
            </div>
          </div>
        )}
      </div>
      
      <BottomBar />
    </div>
  )
}
