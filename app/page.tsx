'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { Phone, ArrowLeft, UserCircle2 } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  const router = useRouter()
  const { setUser } = useAppStore()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate phone (Moroccan format)
    const phoneRegex = /^(0[67]\d{8}|212[67]\d{8})$/
    if (phone && !phoneRegex.test(phone.replace(/\s/g, ''))) {
      setError('رقم الهاتف غير صالح')
      return
    }
    
    if (phone) {
      setUser({ phone: phone.replace(/\s/g, '') })
    }
    
    router.push('/swipe')
  }
  
  const handleGuestMode = () => {
    router.push('/swipe')
  }
  
  return (
    <div className="min-h-screen bg-[#0F0F1A] flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-32 h-32 mx-auto mb-4 relative">
          <Image 
            src="/logo.png" 
            alt="Swipick" 
            fill
            className="object-contain drop-shadow-[0_0_40px_rgba(108,77,255,0.5)]"
            priority
          />
        </div>
        <p className="text-[#CFCFCF]">اسحب، اختر، وخذ المنتج اللي عجبك بسرعة</p>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="glass rounded-2xl p-1">
          <div className="relative">
            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C4DFF]" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                setError('')
              }}
              placeholder="رقم الهاتف (اختياري)"
              className="w-full h-14 bg-transparent border-none outline-none text-white placeholder:text-[#CFCFCF] px-12 text-center"
              dir="ltr"
            />
            <ArrowLeft className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#CFCFCF]" />
          </div>
        </div>
        
        {error && (
          <p className="text-[#E94560] text-sm text-center">{error}</p>
        )}
        
        <button
          type="submit"
          className="w-full h-14 rounded-2xl bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] text-white font-bold text-lg neon-button transition-all duration-300 hover:opacity-90"
        >
          {phone ? 'دخول' : 'ابدأ التصفح'}
        </button>
        
        <button
          type="button"
          onClick={handleGuestMode}
          className="w-full h-14 rounded-2xl glass text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
        >
          <UserCircle2 className="w-5 h-5" />
          <span>متابعة كزائر</span>
        </button>
      </form>
      
      {/* Features */}
      <div className="mt-12 grid grid-cols-3 gap-4 w-full max-w-sm">
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl mb-1">👆</div>
          <p className="text-[#CFCFCF] text-xs">سويب للاكتشاف</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl mb-1">❤️</div>
          <p className="text-[#CFCFCF] text-xs">اختار المفضل</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl mb-1">🛍️</div>
          <p className="text-[#CFCFCF] text-xs">استلم بسهولة</p>
        </div>
      </div>
      
      {/* Footer */}
      <p className="mt-8 text-[#CFCFCF] text-sm">
        مراكش & أكادير
      </p>
    </div>
  )
}
