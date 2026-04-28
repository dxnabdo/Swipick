import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

interface CartItem extends Product {
  addedAt: number
}

interface LikedItem {
  productId: string
  expiry: number
}

interface AppState {
  // Cart
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  
  // Favorites
  favorites: Product[]
  addToFavorites: (product: Product) => void
  removeFromFavorites: (productId: string) => void
  isFavorite: (productId: string) => boolean
  
  // Liked (hidden for 15 min)
  likedItems: LikedItem[]
  likeProduct: (productId: string) => void
  isProductHidden: (productId: string) => boolean
  cleanupExpiredLikes: () => void
  
  // Rejected (for undo)
  rejectedProducts: string[]
  rejectProduct: (productId: string) => void
  undoLastReject: () => string | null
  
  // Category
  activeCategory: string
  setActiveCategory: (category: string) => void
  
  // User
  user: {
    phone?: string
    gender?: 'male' | 'female'
    kidsPreference?: 'boys' | 'girls'
    city?: string
    address?: string
  } | null
  setUser: (user: AppState['user']) => void
  
  // News bar
  isNewsBarVisible: boolean
  hideNewsBar: () => void
  
  // Side menu
  isSideMenuOpen: boolean
  toggleSideMenu: () => void
  closeSideMenu: () => void
  
  // Orders
  orders: Order[]
  addOrder: (order: Order) => void
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

// Category mappings
export const CATEGORY_MAP: Record<string, string> = {
  'W': 'نساء',
  'M': 'رجال',
  'K': 'أطفال',
  'SH': 'أحذية',
  'BG': 'حقائب',
}

export const BRAND_MAP: Record<string, string> = {
  'ZR': 'Zara',
  'NK': 'Nike',
  'AD': 'Adidas',
  'LV': 'Louis Vuitton',
  'GU': 'Gucci',
  'HM': 'H&M',
  'PU': 'Puma',
}

export const PRODUCT_MAP: Record<string, string> = {
  'Qa': 'قميص',
  'Ts': 'تيشرت',
  'Ja': 'جاكيت',
  'Ro': 'فستان',
  'Ch': 'حذاء',
  'Pa': 'بنطلون',
  'Ba': 'حقيبة',
  'Ju': 'تنورة',
}

export const CATEGORY_GLOW: Record<string, string> = {
  'W': '#FF4D8D',   // Women - Pink
  'M': '#1E3A8A',   // Men - Blue
  'K': '#4DA3FF',   // Kids - Light Blue
  'SH': '#10B981',  // Shoes - Green
  'BG': '#FFC857',  // Bags - Gold
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (product) => set((state) => ({
        cart: state.cart.some(item => item.id === product.id)
          ? state.cart
          : [...state.cart, { ...product, addedAt: Date.now() }]
      })),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.id !== productId)
      })),
      clearCart: () => set({ cart: [] }),
      
      // Favorites
      favorites: [],
      addToFavorites: (product) => set((state) => ({
        favorites: state.favorites.some(item => item.id === product.id)
          ? state.favorites
          : [...state.favorites, product]
      })),
      removeFromFavorites: (productId) => set((state) => ({
        favorites: state.favorites.filter(item => item.id !== productId)
      })),
      isFavorite: (productId) => get().favorites.some(item => item.id === productId),
      
      // Liked (hidden for 15 min)
      likedItems: [],
      likeProduct: (productId) => set((state) => ({
        likedItems: [
          ...state.likedItems.filter(item => item.productId !== productId),
          { productId, expiry: Date.now() + 15 * 60 * 1000 }
        ]
      })),
      isProductHidden: (productId) => {
        const item = get().likedItems.find(item => item.productId === productId)
        if (!item) return false
        return item.expiry > Date.now()
      },
      cleanupExpiredLikes: () => set((state) => ({
        likedItems: state.likedItems.filter(item => item.expiry > Date.now())
      })),
      
      // Rejected
      rejectedProducts: [],
      rejectProduct: (productId) => set((state) => ({
        rejectedProducts: [...state.rejectedProducts, productId]
      })),
      undoLastReject: () => {
        const { rejectedProducts } = get()
        if (rejectedProducts.length === 0) return null
        const lastRejected = rejectedProducts[rejectedProducts.length - 1]
        set((state) => ({
          rejectedProducts: state.rejectedProducts.slice(0, -1)
        }))
        return lastRejected
      },
      
      // Category
      activeCategory: 'all',
      setActiveCategory: (category) => set({ activeCategory: category }),
      
      // User
      user: null,
      setUser: (user) => set({ user }),
      
      // News bar
      isNewsBarVisible: true,
      hideNewsBar: () => set({ isNewsBarVisible: false }),
      
      // Side menu
      isSideMenuOpen: false,
      toggleSideMenu: () => set((state) => ({ isSideMenuOpen: !state.isSideMenuOpen })),
      closeSideMenu: () => set({ isSideMenuOpen: false }),
      
      // Orders
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
    }),
    {
      name: 'swipick-storage',
      partialize: (state) => ({
        cart: state.cart,
        favorites: state.favorites,
        likedItems: state.likedItems,
        user: state.user,
        orders: state.orders,
        activeCategory: state.activeCategory,
      }),
    }
  )
)

// Parse product serial
export function parseProductSerial(filename: string): Product | null {
  // Format: [Category]-[Brand]-[Product]-[Price]-[Size]-[ID].jpg
  const match = filename.match(/^([A-Z]+)-([A-Z]+)-([A-Za-z]+)-(\d+)-([A-Z0-9]+)-(\d+)\.jpg$/i)
  if (!match) return null
  
  const [, categoryCode, brandCode, productCode, price, size, id] = match
  
  return {
    id,
    serial: filename.replace('.jpg', ''),
    category: CATEGORY_MAP[categoryCode.toUpperCase()] || categoryCode,
    categoryCode: categoryCode.toUpperCase(),
    brand: BRAND_MAP[brandCode.toUpperCase()] || brandCode,
    brandCode: brandCode.toUpperCase(),
    productType: PRODUCT_MAP[productCode] || productCode,
    productCode,
    price: parseInt(price),
    size,
    image: `/products/${filename}`,
  }
}

// Generate order ID
export function generateOrderId(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(1000 + Math.random() * 9000)
  return `SWP-${year}-${random}`
}
