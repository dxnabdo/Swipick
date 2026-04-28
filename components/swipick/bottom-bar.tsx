'use client'

import { Compass, MessageCircle, ShoppingCart, SlidersHorizontal, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'

interface BottomBarProps {
  onFilterClick?: () => void
}

export function BottomBar({ onFilterClick }: BottomBarProps) {
  const pathname = usePathname()
  const { cart } = useAppStore()
  
  const NAV_ITEMS = [
    { icon: Compass, label: 'استكشف', href: '/swipe', key: 'explore' },
    { icon: MessageCircle, label: 'واتساب', href: 'https://wa.me/212663319599', external: true, key: 'whatsapp' },
    { icon: ShoppingCart, label: 'السلة', href: '/cart', key: 'cart' },
    { icon: SlidersHorizontal, label: 'فرز', href: '#filter', key: 'filter' },
    { icon: MessageSquare, label: 'دردشة', href: '/chat', key: 'chat' },
  ]
  
  return (
    <div className="h-[50px] glass-strong fixed bottom-0 left-0 right-0 flex items-center justify-around px-4 z-40">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        
        if (item.external) {
          return (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-0.5"
            >
              <Icon className="w-5 h-5 text-[#25D366]" />
              <span className="text-[10px] text-[#CFCFCF]">{item.label}</span>
            </a>
          )
        }
        
        if (item.href === '#filter') {
          return (
            <button
              key={item.key}
              onClick={onFilterClick}
              className="flex flex-col items-center gap-0.5"
            >
              <Icon className="w-5 h-5 text-[#CFCFCF] hover:text-[#6C4DFF] transition-colors" />
              <span className="text-[10px] text-[#CFCFCF]">{item.label}</span>
            </button>
          )
        }
        
        return (
          <Link
            key={item.key}
            href={item.href}
            className="flex flex-col items-center gap-0.5 relative"
          >
            <Icon className={cn(
              "w-5 h-5",
              isActive ? "text-[#6C4DFF]" : "text-[#CFCFCF]"
            )} />
            <span className={cn(
              "text-[10px]",
              isActive ? "text-[#6C4DFF]" : "text-[#CFCFCF]"
            )}>{item.label}</span>
            {item.href === '/cart' && cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3B5C] rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                {cart.length}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
