'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, MapPin, Truck, Clock, Phone, Check } from 'lucide-react'
import { useAppStore, generateOrderId } from '@/lib/store'
import { cn } from '@/lib/utils'

type DeliveryMethod = 'pickup' | 'delivery'
type City = 'marrakech' | 'agadir'

const PICKUP_POINTS: Record<City, string[]> = {
  marrakech: ['العزوزية', 'المحاميد'],
  agadir: ['حي السلام', 'سوق الأحد'],
}

const TIME_SLOTS = ['10:00-12:00', '12:00-14:00', '16:00-18:00']

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart, addOrder, user, setUser } = useAppStore()
  
  const [method, setMethod] = useState<DeliveryMethod>('pickup')
  const [city, setCity] = useState<City>('marrakech')
  const [pickupPoint, setPickupPoint] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [address, setAddress] = useState(user?.address || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState('')
  
  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const isFreeDelivery = total >= 200
  
  const canProceed = () => {
    if (method === 'pickup') {
      return city && pickupPoint && timeSlot && phone
    }
    return city && address && phone
  }
  
  const handleSubmit = async () => {
    if (!canProceed()) return
    
    setLoading(true)
    
    const newOrderId = generateOrderId()
    setOrderId(newOrderId)
    
    const order = {
      id: newOrderId,
      items: cart,
      total,
      method,
      city,
      pickupPoint: method === 'pickup' ? pickupPoint : undefined,
      timeSlot: method === 'pickup' ? timeSlot : undefined,
      address: method === 'delivery' ? address : undefined,
      phone,
      status: 'pending' as const,
      createdAt: Date.now(),
    }
    
    addOrder(order)
    
    // Update user info
    if (phone) {
      setUser({ ...user, phone, address: method === 'delivery' ? address : user?.address })
    }
    
    // Build WhatsApp message
    const productList = cart.map(item => `- ${item.brand} ${item.productType} (${item.size}) - ${item.price} درهم`).join('\n')
    const message = `🛍️ *طلب جديد من Swipick*\n\n*رقم الطلب:* ${newOrderId}\n\n*المنتجات:*\n${productList}\n\n*المجموع:* ${total} درهم\n*طريقة الاستلام:* ${method === 'pickup' ? 'استلام من نقطة' : 'توصيل'}\n*المدينة:* ${city === 'marrakech' ? 'مراكش' : 'أكادير'}${method === 'pickup' ? `\n*نقطة الاستلام:* ${pickupPoint}\n*الوقت:* ${timeSlot}` : `\n*العنوان:* ${address}`}\n*الهاتف:* ${phone}`
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/212663319599?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    clearCart()
    setLoading(false)
    setStep(3)
  }
  
  if (cart.length === 0 && step !== 3) {
    router.push('/cart')
    return null
  }
  
  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] glass-strong flex items-center justify-between px-4 z-50">
        <button onClick={() => step > 1 ? setStep(step - 1) : router.back()}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold">إتمام الطلب</h1>
        <div className="w-6" />
      </div>
      
      {/* Progress */}
      <div className="fixed top-[60px] left-0 right-0 h-[4px] bg-[#141428]">
        <div 
          className="h-full bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
      
      <div className="pt-[80px] px-4 pb-[100px]">
        {/* Step 1: Delivery Method */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-white font-bold text-lg mb-4">اختر طريقة الاستلام</h2>
            
            <button
              onClick={() => setMethod('pickup')}
              className={cn(
                "w-full glass rounded-2xl p-4 flex items-center gap-4 transition-all",
                method === 'pickup' && "border-[#6C4DFF] border-2"
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-[#6C4DFF]/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#6C4DFF]" />
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-white font-bold">استلام من نقطة</h3>
                <p className="text-[#CFCFCF] text-sm">مجاني - الحجز صالح لمدة ساعتين</p>
              </div>
              {method === 'pickup' && <Check className="w-6 h-6 text-[#6C4DFF]" />}
            </button>
            
            <button
              onClick={() => setMethod('delivery')}
              className={cn(
                "w-full glass rounded-2xl p-4 flex items-center gap-4 transition-all",
                method === 'delivery' && "border-[#6C4DFF] border-2"
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-[#4CAF50]/20 flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#4CAF50]" />
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-white font-bold">توصيل للعنوان</h3>
                <p className="text-[#CFCFCF] text-sm">
                  {isFreeDelivery ? 'مجاني' : 'حسب المنطقة'} - للطلبات فوق 200 درهم مجاني
                </p>
              </div>
              {method === 'delivery' && <Check className="w-6 h-6 text-[#6C4DFF]" />}
            </button>
            
            {/* City Selection */}
            <h2 className="text-white font-bold text-lg mt-6 mb-4">اختر المدينة</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { setCity('marrakech'); setPickupPoint('') }}
                className={cn(
                  "glass rounded-2xl p-4 text-center transition-all",
                  city === 'marrakech' && "border-[#6C4DFF] border-2"
                )}
              >
                <span className="text-white font-bold">مراكش</span>
              </button>
              <button
                onClick={() => { setCity('agadir'); setPickupPoint('') }}
                className={cn(
                  "glass rounded-2xl p-4 text-center transition-all",
                  city === 'agadir' && "border-[#6C4DFF] border-2"
                )}
              >
                <span className="text-white font-bold">أكادير</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-4">
            {method === 'pickup' ? (
              <>
                <h2 className="text-white font-bold text-lg mb-4">اختر نقطة الاستلام</h2>
                <div className="grid grid-cols-2 gap-4">
                  {PICKUP_POINTS[city].map((point) => (
                    <button
                      key={point}
                      onClick={() => setPickupPoint(point)}
                      className={cn(
                        "glass rounded-2xl p-4 text-center transition-all",
                        pickupPoint === point && "border-[#6C4DFF] border-2"
                      )}
                    >
                      <MapPin className="w-6 h-6 text-[#6C4DFF] mx-auto mb-2" />
                      <span className="text-white">{point}</span>
                    </button>
                  ))}
                </div>
                
                <h2 className="text-white font-bold text-lg mt-6 mb-4">اختر وقت الاستلام</h2>
                <div className="space-y-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={cn(
                        "w-full glass rounded-2xl p-4 flex items-center gap-4 transition-all",
                        timeSlot === slot && "border-[#6C4DFF] border-2"
                      )}
                    >
                      <Clock className="w-5 h-5 text-[#FFC857]" />
                      <span className="text-white">{slot}</span>
                      {timeSlot === slot && <Check className="w-5 h-5 text-[#6C4DFF] mr-auto" />}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-white font-bold text-lg mb-4">عنوان التوصيل</h2>
                <div className="glass rounded-2xl p-4">
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="أدخل العنوان الكامل..."
                    className="w-full h-32 bg-transparent border-none outline-none text-white placeholder:text-[#CFCFCF] resize-none"
                  />
                </div>
              </>
            )}
            
            <h2 className="text-white font-bold text-lg mt-6 mb-4">رقم الهاتف</h2>
            <div className="glass rounded-2xl p-4 flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#6C4DFF]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06XXXXXXXX"
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[#CFCFCF]"
                dir="ltr"
              />
            </div>
          </div>
        )}
        
        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-24 h-24 rounded-full bg-[#4CAF50]/20 flex items-center justify-center mb-6">
              <Check className="w-12 h-12 text-[#4CAF50]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">تم إرسال الطلب!</h2>
            <p className="text-[#CFCFCF] mb-4">رقم الطلب: {orderId}</p>
            <p className="text-[#CFCFCF] text-sm mb-8">
              سيتم التواصل معك عبر واتساب لتأكيد الطلب
            </p>
            <button
              onClick={() => router.push('/swipe')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] text-white font-bold neon-button"
            >
              متابعة التسوق
            </button>
          </div>
        )}
      </div>
      
      {/* Bottom Button */}
      {step < 3 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 glass-strong">
          <button
            onClick={() => step === 2 ? handleSubmit() : setStep(2)}
            disabled={step === 2 && !canProceed()}
            className={cn(
              "w-full h-14 rounded-2xl font-bold text-lg flex items-center justify-center transition-all",
              (step === 1 || canProceed())
                ? "bg-gradient-to-l from-[#6C4DFF] to-[#A855F7] text-white neon-button"
                : "bg-[#141428] text-[#CFCFCF]"
            )}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : step === 2 ? (
              `تأكيد الطلب (${total} درهم)`
            ) : (
              'التالي'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
