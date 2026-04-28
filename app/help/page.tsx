'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ChevronDown, Phone, MessageCircle, Mail } from 'lucide-react'
import { BottomBar } from '@/components/swipick/bottom-bar'
import { cn } from '@/lib/utils'

const FAQ_ITEMS = [
  {
    question: 'كيفاش نسويبي؟',
    answer: 'سويب لليمين باش تضيف المنتج للسلة والمفضلة، سويب ليسار باش تسكيبي، سويب لفوق باش تشوف التفاصيل.',
  },
  {
    question: 'كيفاش نشري من Swipick؟',
    answer: 'ضيف المنتجات للسلة، كمل الطلب، اختار طريقة الاستلام (توصيل أو استلام من نقطة)، وخلص عند الاستلام.',
  },
  {
    question: 'التوصيل كم كيكلف؟',
    answer: 'التوصيل مجاني للطلبات فوق 200 درهم. للطلبات أقل من 200 درهم، الثمن حسب المنطقة.',
  },
  {
    question: 'شحال من وقت كياخد التوصيل؟',
    answer: 'التوصيل في نفس اليوم في مراكش وأكادير. الطلبات قبل 14:00 توصل نفس اليوم.',
  },
  {
    question: 'واش نقدر نرجع المنتج؟',
    answer: 'نعم، تقدر ترجع المنتج في 24 ساعة إلا كان فيه عيب أو مختلف عن الصورة.',
  },
  {
    question: 'كيفاش نستالم من نقطة؟',
    answer: 'اختار نقطة الاستلام والوقت عند إتمام الطلب. الحجز صالح لمدة ساعتين من الوقت المختار.',
  },
]

export default function HelpPage() {
  const router = useRouter()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  
  return (
    <div className="min-h-screen bg-[#0F0F1A] pb-[70px]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] glass-strong flex items-center justify-between px-4 z-50">
        <button onClick={() => router.back()}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold">المساعدة والدعم</h1>
        <div className="w-6" />
      </div>
      
      <div className="pt-[70px] px-4">
        {/* Contact Options */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <a
            href="https://wa.me/212663319599"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-2xl p-4 text-center"
          >
            <Phone className="w-6 h-6 text-[#25D366] mx-auto mb-2" />
            <span className="text-white text-sm">واتساب</span>
          </a>
          <a
            href="mailto:support@swipick.ma"
            className="glass rounded-2xl p-4 text-center"
          >
            <Mail className="w-6 h-6 text-[#6C4DFF] mx-auto mb-2" />
            <span className="text-white text-sm">إيميل</span>
          </a>
          <button
            onClick={() => router.push('/chat')}
            className="glass rounded-2xl p-4 text-center"
          >
            <MessageCircle className="w-6 h-6 text-[#2196F3] mx-auto mb-2" />
            <span className="text-white text-sm">دردشة</span>
          </button>
        </div>
        
        {/* FAQ */}
        <h2 className="text-white font-bold text-lg mb-4">الأسئلة الشائعة</h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index} className="glass rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-4 flex items-center justify-between"
              >
                <span className="text-white font-medium">{item.question}</span>
                <ChevronDown 
                  className={cn(
                    "w-5 h-5 text-[#6C4DFF] transition-transform",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4">
                  <p className="text-[#CFCFCF] text-sm leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <BottomBar />
    </div>
  )
}
