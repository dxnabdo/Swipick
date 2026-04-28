export interface Product {
  id: string
  serial: string
  category: string
  categoryCode: string
  brand: string
  brandCode: string
  productType: string
  productCode: string
  price: number
  size: string
  image: string
}

export interface CartItem extends Product {
  addedAt: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  method: 'pickup' | 'delivery'
  city: string
  pickupPoint?: string
  timeSlot?: string
  address?: string
  phone: string
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled'
  createdAt: number
}

export interface ChatRoom {
  id: string
  code: string
  participants: string[]
  products: Product[]
  messages: ChatMessage[]
  syncSwipe: boolean
  createdAt: number
}

export interface ChatMessage {
  id: string
  senderId: string
  content: string
  type: 'text' | 'product' | 'system'
  productId?: string
  createdAt: number
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'order' | 'product' | 'promo' | 'system'
  read: boolean
  createdAt: number
}

export type CategoryCode = 'W' | 'M' | 'K' | 'SH' | 'BG'
export type City = 'marrakech' | 'agadir'

export const PICKUP_POINTS: Record<City, string[]> = {
  marrakech: ['العزوزية', 'المحاميد'],
  agadir: ['حي السلام', 'سوق الأحد'],
}

export const TIME_SLOTS = ['10:00-12:00', '12:00-14:00', '16:00-18:00']
