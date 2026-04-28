'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { User, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CompleteProfilePage() {
  const router = useRouter()
  const { user, setUser, activeCategory } = useAppStore()
  const [gender, setGender] = useState<'male' | 'female' | null>(null)
  const [kidsPreference, setKidsPreference] = useState<'boys' | 'girls' | null>(null)
  
  const showKidsOption = activeCategory === 'K' || activeCategory === 'أطفال'
  
  const handleContinue = () => {
    setUser({
      ...user,
      gender: gender || undefined,
      kidsPreference: kidsPreference || undefined,
    })
    router.push('/swipe')
  }
  
  return (
    <div className="min-h-screen bg-[#0F0F1A] flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#6C4DFF] to-[#A855F7] flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-[0_0_30px_rgba(108,77,255,0.4)]">
          S
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">أكمل ملفك</h1>
        <p className="text-[#CFCFCF]">ساعدنا نعرض ليك المنتجات المناسبة</p>
      </div>
      
      {/* Gender Selection */}
      <div className="w-full max-w-sm space-y-4 mb-8">
        <h2 className="text-white font-bold text-lg text-center">أنت:</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setGender('male')}
            className={cn(
              "glass rounded-2xl p-6 text-center transition-all",
              gender === 'male' && "border-[#6C4DFF] border-2"
            )}
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-[#3B82F6]/20 flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-[#3B82F6]" />
            </div>
            <span className="text-white font-bold">رجل</span>
          </button>
          <button
            onClick={() => setGender('female')}
            className={cn(
              "glass rounded-2xl p-6 text-center transition-all",
              gender === 'female' && "border-[#6C4DFF] border-2"
            )}
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FF4D8D]/20 flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-[#FF4D8D]" />
            </div>
            <span className="text-white font-bold">امرأة</span>
          </button>
        </div>
      </div>
      
      {/* Kids Preference (only if kids category) */}
      {showKidsOption && (
        <div className="w-full max-w-sm space-y-4 mb-8">
          <h2 className="text-white font-bold text-lg text-center">تبحث عن ملابس:</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setKidsPreference('boys')}
              className={cn(
                "glass rounded-2xl p-6 text-center transition-all",
                kidsPreference === 'boys' && "border-[#6C4DFF] border-2"
              )}
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#4DA3FF]/20 flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-[#4DA3FF]" />
              </div>
              <span className="text-white font-bold">أولاد</span>
            </button>
            <button
              onClick={() => setKidsPreference('girls')}
              className={cn(
                "glass rounded-2xl p-6 text-center transition-all",
                kidsPreference === 'girls' && "border-[#6C4DFF] border-2"
              )}
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FFB6C1]/20 flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-[#FFB6C1]" />
              </div>
              <span className="text-white font-bold">بنات</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Continue Button */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleContinue}
          className="w-full h-14 rounded-2xl bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] text-white font-bold text-lg neon-button"
        >
          متابعة
        </button>
        <button
          onClick={() => router.push('/swipe')}
          className="w-full h-14 mt-3 rounded-2xl glass text-[#CFCFCF] font-medium"
        >
          تخطي
        </button>
      </div>
    </div>
  )
}
