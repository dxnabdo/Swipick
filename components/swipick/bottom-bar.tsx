'use client';

import { Compass, Phone, ShoppingBag, Sliders, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface BottomBarProps {
  activeTab: string;
}

export default function BottomBar({ activeTab }: BottomBarProps) {
  const tabs = [
    { id: 'swipe', icon: Compass, label: 'استكشف', href: '/swipe' },
    { id: 'whatsapp', icon: Phone, label: 'واتساب', href: 'https://wa.me/21266319599', external: true },
    { id: 'cart', icon: ShoppingBag, label: 'السلة', href: '/cart' },
    { id: 'filter', icon: Sliders, label: 'فرز', href: '#', action: 'filter' },
    { id: 'chat', icon: MessageCircle, label: 'دردشة', href: '/chat' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#141428]/90 backdrop-blur-xl border-t border-purple-500/20 z-10 h-[65px]">
      <div className="flex items-center justify-around h-full max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.external) {
            return (
              <a
                key={tab.id}
                href={tab.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{tab.label}</span>
              </a>
            );
          }

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-purple-400' : 'text-gray-400 hover:text-purple-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}