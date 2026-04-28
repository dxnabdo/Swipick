'use client'

import { X, User, MessageSquare, Sparkles, Megaphone, HelpCircle, Phone, Instagram, Youtube, Music, LogOut } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const MENU_ITEMS = [
  { icon: User, label: 'حسابي', href: '/profile' },
  { icon: MessageSquare, label: 'الدردشة', href: '/chat' },
  { icon: Sparkles, label: 'الذكاء الاصطناعي', href: '#ai', popup: true },
  { icon: Megaphone, label: 'إعلانات', href: '/announcements' },
  { icon: HelpCircle, label: 'المساعدة والدعم', href: '/help' },
]

const SOCIAL_ITEMS = [
  { icon: Phone, label: 'واتساب', href: 'https://wa.me/212663319599', color: '#25D366' },
  { icon: Instagram, label: 'إنستغرام', href: 'https://instagram.com/swipick', color: '#E4405F' },
  { icon: Youtube, label: 'يوتيوب', href: 'https://youtube.com/@swipick', color: '#FF0000' },
  { icon: Music, label: 'تيك توك', href: 'https://tiktok.com/@swipick', color: '#000000' },
]

export function SideMenu() {
  const { isSideMenuOpen, closeSideMenu, setUser } = useAppStore()
  const router = useRouter()
  
  const handleLogout = () => {
    setUser(null)
    closeSideMenu()
    router.push('/')
  }
  
  const handleAIClick = () => {
    alert('الخدمات قريباً')
    closeSideMenu()
  }
  
  if (!isSideMenuOpen) return null
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50"
        onClick={closeSideMenu}
      />
      
      {/* Menu */}
      <div className="fixed top-0 right-0 w-[280px] h-full glass-strong z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="h-[70px] flex items-center justify-between px-4 border-b border-[rgba(108,77,255,0.2)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C4DFF] to-[#A855F7] flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-white font-bold text-lg">Swipick</span>
          </div>
          <button onClick={closeSideMenu}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        
        {/* Menu Items */}
        <div className="flex-1 py-4">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon
            
            if (item.popup) {
              return (
                <button
                  key={item.label}
                  onClick={handleAIClick}
                  className="w-full flex items-center gap-4 px-6 py-3 hover:bg-white/5 transition-colors"
                >
                  <Icon className="w-5 h-5 text-[#6C4DFF]" />
                  <span className="text-white">{item.label}</span>
                </button>
              )
            }
            
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeSideMenu}
                className="flex items-center gap-4 px-6 py-3 hover:bg-white/5 transition-colors"
              >
                <Icon className="w-5 h-5 text-[#6C4DFF]" />
                <span className="text-white">{item.label}</span>
              </Link>
            )
          })}
          
          <div className="h-px bg-[rgba(108,77,255,0.2)] my-4 mx-4" />
          
          {/* Social Links */}
          <div className="px-4 mb-4">
            <p className="text-[#CFCFCF] text-sm mb-3">تابعنا</p>
            <div className="flex gap-3">
              {SOCIAL_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:scale-110 transition-transform"
                    style={{ color: item.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-4 border-t border-[rgba(108,77,255,0.2)] hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-5 h-5 text-[#E94560]" />
          <span className="text-[#E94560]">تسجيل خروج</span>
        </button>
      </div>
    </>
  )
}
