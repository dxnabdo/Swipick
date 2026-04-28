'use client'

import { useState, useEffect, useCallback } from 'react'
import { Menu, Bell, Heart, Search, Mic, X, MicOff } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import Link from 'next/link'
import Image from 'next/image'

interface TopBarProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

export function TopBar({ searchQuery = '', onSearchChange }: TopBarProps) {
  const { toggleSideMenu, favorites } = useAppStore()
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  
  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setSpeechSupported(!!SpeechRecognition)
  }, [])
  
  const handleSearchChange = (value: string) => {
    setLocalSearch(value)
    onSearchChange?.(value)
  }
  
  const handleClear = () => {
    setLocalSearch('')
    onSearchChange?.('')
  }
  
  const handleVoiceSearch = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      alert('المتصفح لا يدعم البحث الصوتي')
      return
    }
    
    const recognition = new SpeechRecognition()
    recognition.lang = 'ar-MA' // Moroccan Arabic
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    
    recognition.onstart = () => {
      setIsListening(true)
    }
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      handleSearchChange(transcript)
      setIsListening(false)
    }
    
    recognition.onerror = () => {
      setIsListening(false)
      alert('حدث خطأ في البحث الصوتي، حاول مرة أخرى')
    }
    
    recognition.onend = () => {
      setIsListening(false)
    }
    
    recognition.start()
  }, [])
  
  return (
    <div className="h-[70px] px-4 flex items-center justify-between glass-strong">
      {/* Right side - Logo */}
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-xl overflow-hidden">
          <Image 
            src="/logo.png" 
            alt="Swipick" 
            width={40} 
            height={40}
            className="object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = '<span class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C4DFF] to-[#A855F7] flex items-center justify-center text-white font-bold text-lg">S</span>'
              }
            }}
          />
        </div>
      </div>
      
      {/* Center - Search bar */}
      <div className="flex-1 mx-4 max-w-md">
        <div className="relative h-[45px] glass rounded-xl flex items-center px-4">
          <Search className="w-5 h-5 text-muted-foreground ml-2" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-muted-foreground text-center px-2"
          />
          {localSearch ? (
            <button onClick={handleClear} className="p-1">
              <X className="w-5 h-5 text-muted-foreground hover:text-white transition-colors" />
            </button>
          ) : (
            <button 
              onClick={handleVoiceSearch} 
              disabled={!speechSupported}
              className={`p-1 ${isListening ? 'animate-pulse' : ''}`}
            >
              {isListening ? (
                <Mic className="w-5 h-5 text-[#FF3B5C]" />
              ) : speechSupported ? (
                <Mic className="w-5 h-5 text-muted-foreground hover:text-white transition-colors" />
              ) : (
                <MicOff className="w-5 h-5 text-muted-foreground opacity-50" />
              )}
            </button>
          )}
        </div>
        {isListening && (
          <div className="absolute top-[75px] left-1/2 -translate-x-1/2 glass-strong px-4 py-2 rounded-lg text-sm text-white animate-pulse z-50">
            🎤 جاري الاستماع...
          </div>
        )}
      </div>
      
      {/* Left side - Icons */}
      <div className="flex items-center gap-4">
        <Link href="/favorites" className="relative">
          <Heart className="w-6 h-6 text-[#FF3B5C]" fill="#FF3B5C" />
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3B5C] rounded-full text-[10px] flex items-center justify-center text-white font-bold">
              {favorites.length}
            </span>
          )}
        </Link>
        <Link href="/notifications" className="relative">
          <Bell className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF3B5C] rounded-full" />
        </Link>
        <button onClick={toggleSideMenu}>
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  )
}
