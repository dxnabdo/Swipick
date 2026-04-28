'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, MapPin, Clock, Navigation } from 'lucide-react'
import { BottomBar } from '@/components/swipick/bottom-bar'

const PICKUP_POINTS = {
  marrakech: [
    {
      id: '1',
      name: 'العزوزية',
      address: 'شارع محمد الخامس، بالقرب من سوق المركزي',
      hours: '09:00 - 20:00',
      coordinates: { lat: 31.6295, lng: -7.9811 },
    },
    {
      id: '2',
      name: 'المحاميد',
      address: 'حي المحاميد 9، بالقرب من مسجد الحسن',
      hours: '09:00 - 20:00',
      coordinates: { lat: 31.5897, lng: -8.0168 },
    },
  ],
  agadir: [
    {
      id: '3',
      name: 'حي السلام',
      address: 'شارع الحسن الثاني، أمام البنك الشعبي',
      hours: '09:00 - 19:00',
      coordinates: { lat: 30.4278, lng: -9.5981 },
    },
    {
      id: '4',
      name: 'سوق الأحد',
      address: 'بالقرب من مدخل السوق الرئيسي',
      hours: '10:00 - 18:00',
      coordinates: { lat: 30.4202, lng: -9.5932 },
    },
  ],
}

export default function PickupPointsPage() {
  const router = useRouter()
  
  const openMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`
    window.open(url, '_blank')
  }
  
  return (
    <div className="min-h-screen bg-[#0F0F1A] pb-[70px]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-[60px] glass-strong flex items-center justify-between px-4 z-50">
        <button onClick={() => router.back()}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-bold">نقاط الاستلام</h1>
        <div className="w-6" />
      </div>
      
      <div className="pt-[70px] px-4">
        {/* Marrakech */}
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF4D8D]" />
          مراكش
        </h2>
        <div className="space-y-4 mb-8">
          {PICKUP_POINTS.marrakech.map((point) => (
            <div key={point.id} className="glass rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FFC857]/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#FFC857]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold">{point.name}</h3>
                  <p className="text-[#CFCFCF] text-sm mt-1">{point.address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-[#6C4DFF]" />
                    <span className="text-[#CFCFCF] text-sm">{point.hours}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openMaps(point.coordinates.lat, point.coordinates.lng, point.name)}
                className="w-full mt-4 py-2 rounded-xl glass text-[#6C4DFF] font-medium flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                الاتجاهات
              </button>
            </div>
          ))}
        </div>
        
        {/* Agadir */}
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3B82F6]" />
          أكادير
        </h2>
        <div className="space-y-4">
          {PICKUP_POINTS.agadir.map((point) => (
            <div key={point.id} className="glass rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FFC857]/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#FFC857]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold">{point.name}</h3>
                  <p className="text-[#CFCFCF] text-sm mt-1">{point.address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-[#6C4DFF]" />
                    <span className="text-[#CFCFCF] text-sm">{point.hours}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openMaps(point.coordinates.lat, point.coordinates.lng, point.name)}
                className="w-full mt-4 py-2 rounded-xl glass text-[#6C4DFF] font-medium flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                الاتجاهات
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <BottomBar />
    </div>
  )
}
