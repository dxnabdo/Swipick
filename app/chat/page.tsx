'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Send, Users, Plus, Copy, Check } from 'lucide-react'
import { BottomBar } from '@/components/swipick/bottom-bar'
import Link from 'next/link'

interface Message {
  id: string
  text: string
  sender: 'user' | 'support'
  timestamp: number
}

export default function ChatPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'support' | 'shared'>('support')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
      sender: 'support',
      timestamp: Date.now() - 1000 * 60 * 5,
    },
  ])
  const [roomCode, setRoomCode] = useState('')
  const [copied, setCopied] = useState(false)
  
  const handleSendMessage = () => {
    if (!message.trim()) return
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: Date.now(),
    }
    
    setMessages([...messages, newMessage])
    setMessage('')
    
    // Simulate support response
    setTimeout(() => {
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'شكراً لتواصلك معنا! سيتم الرد عليك في أقرب وقت.',
        sender: 'support',
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, supportResponse])
    }, 1000)
  }
  
  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomCode(code)
    return code
  }
  
  const handleCreateRoom = () => {
    const code = generateRoomCode()
    router.push(`/shared-shopping/${code}`)
  }
  
  const handleJoinRoom = () => {
    if (roomCode.length === 6) {
      router.push(`/shared-shopping/${roomCode}`)
    }
  }
  
  const copyRoomLink = async (code: string) => {
    const link = `${window.location.origin}/shared-shopping/${code}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="min-h-screen bg-[#0F0F1A] pb-[70px]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] glass-strong flex items-center justify-between px-4 z-50">
        <button onClick={() => router.back()}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold">الدردشة</h1>
        <div className="w-6" />
      </div>
      
      {/* Tabs */}
      <div className="fixed top-[60px] left-0 right-0 h-[50px] glass flex items-center px-4 z-40">
        <button
          onClick={() => setActiveTab('support')}
          className={`flex-1 py-2 text-center rounded-xl transition-colors ${
            activeTab === 'support' 
              ? 'bg-[#6C4DFF] text-white' 
              : 'text-[#CFCFCF]'
          }`}
        >
          دعم العملاء
        </button>
        <button
          onClick={() => setActiveTab('shared')}
          className={`flex-1 py-2 text-center rounded-xl transition-colors ${
            activeTab === 'shared' 
              ? 'bg-[#6C4DFF] text-white' 
              : 'text-[#CFCFCF]'
          }`}
        >
          تسوق مشترك
        </button>
      </div>
      
      <div className="pt-[120px] px-4">
        {activeTab === 'support' ? (
          <>
            {/* Messages */}
            <div className="space-y-4 pb-20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      msg.sender === 'user'
                        ? 'bg-[#6C4DFF] text-white rounded-br-none'
                        : 'glass text-white rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString('ar-MA', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="fixed bottom-[60px] left-0 right-0 p-4 glass-strong">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 h-12 rounded-xl glass bg-transparent border-none outline-none px-4 text-white placeholder:text-[#CFCFCF]"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-12 h-12 rounded-xl bg-[#6C4DFF] flex items-center justify-center"
                >
                  <Send className="w-5 h-5 text-white rotate-180" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Create Room */}
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#6C4DFF]/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#6C4DFF]" />
              </div>
              <h2 className="text-white font-bold text-lg mb-2">تسوق مع صحابك!</h2>
              <p className="text-[#CFCFCF] text-sm mb-4">
                أنشئ غرفة وشارك الكود مع أصدقائك للتسوق معاً
              </p>
              <button
                onClick={handleCreateRoom}
                className="w-full h-12 rounded-xl bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] text-white font-bold flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                إنشاء غرفة جديدة
              </button>
            </div>
            
            {/* Join Room */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">انضم لغرفة</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="أدخل الكود"
                  maxLength={6}
                  className="flex-1 h-12 rounded-xl glass bg-transparent border-none outline-none px-4 text-white placeholder:text-[#CFCFCF] text-center tracking-widest"
                  dir="ltr"
                />
                <button
                  onClick={handleJoinRoom}
                  disabled={roomCode.length !== 6}
                  className="px-6 h-12 rounded-xl bg-[#4CAF50] text-white font-bold disabled:opacity-50"
                >
                  انضم
                </button>
              </div>
            </div>
            
            {/* Share via WhatsApp */}
            <div className="glass rounded-2xl p-4">
              <p className="text-[#CFCFCF] text-sm text-center">
                أو شارك رابط الغرفة عبر واتساب مع أصدقائك
              </p>
            </div>
          </div>
        )}
      </div>
      
      <BottomBar />
    </div>
  )
}
