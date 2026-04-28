'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Bell, Moon, Globe, Shield, Trash2 } from 'lucide-react'
import { BottomBar } from '@/components/swipick/bottom-bar'
import { useAppStore } from '@/lib/store'

export default function SettingsPage() {
  const router = useRouter()
  const { clearCart, setUser } = useAppStore()
  
  const handleClearData = () => {
    if (confirm('هل أنت متأكد من حذف جميع البيانات؟')) {
      clearCart()
      setUser(null)
      localStorage.clear()
      router.push('/')
    }
  }
  
  return (
    <div className="min-h-screen bg-[#0F0F1A] pb-[70px]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] glass-strong flex items-center justify-between px-4 z-50">
        <button onClick={() => router.back()}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold">الإعدادات</h1>
        <div className="w-6" />
      </div>
      
      <div className="pt-[70px] px-4">
        {/* Settings Options */}
        <div className="glass rounded-2xl overflow-hidden mb-6">
          <div className="flex items-center justify-between p-4 border-b border-[rgba(108,77,255,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6C4DFF]/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#6C4DFF]" />
              </div>
              <span className="text-white">الإشعارات</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-[#141428] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#6C4DFF] after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 border-b border-[rgba(108,77,255,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A855F7]/20 flex items-center justify-center">
                <Moon className="w-5 h-5 text-[#A855F7]" />
              </div>
              <span className="text-white">الوضع الداكن</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-[#141428] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#6C4DFF] after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#4CAF50]" />
              </div>
              <span className="text-white">اللغة</span>
            </div>
            <span className="text-[#CFCFCF]">العربية</span>
          </div>
        </div>
        
        {/* Privacy */}
        <div className="glass rounded-2xl overflow-hidden mb-6">
          <button className="w-full flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-[#2196F3]/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#2196F3]" />
            </div>
            <span className="text-white">سياسة الخصوصية</span>
          </button>
        </div>
        
        {/* Danger Zone */}
        <div className="glass rounded-2xl overflow-hidden">
          <button 
            onClick={handleClearData}
            className="w-full flex items-center gap-3 p-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E94560]/20 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-[#E94560]" />
            </div>
            <span className="text-[#E94560]">حذف جميع البيانات</span>
          </button>
        </div>
        
        {/* Version */}
        <p className="text-center text-[#CFCFCF] text-sm mt-8">
          Swipick v1.0.0
        </p>
      </div>
      
      <BottomBar />
    </div>
  )
}
