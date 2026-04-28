'use client'

import { useState, useRef, useCallback } from 'react'
import { X, Upload, Camera, Check, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ALL_BRANDS, POPULAR_BRANDS, searchBrands } from '@/constants/brands'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onProductAdded?: () => void
}

const CATEGORIES = [
  { code: 'W', name: 'نساء', color: '#FF4D8D' },
  { code: 'M', name: 'رجال', color: '#1E3A8A' },
  { code: 'K', name: 'أطفال', color: '#4DA3FF' },
  { code: 'SH', name: 'أحذية', color: '#10B981' },
  { code: 'BG', name: 'حقائب', color: '#FFC857' },
]

const SIZES: Record<string, string[]> = {
  W: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  M: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  K: ['2Y', '4Y', '6Y', '8Y', '10Y', '12Y'],
  SH: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
  BG: ['OS'],
}

const CONDITIONS = [
  { value: 'excellent', label: 'ممتاز', color: '#4CAF50' },
  { value: 'very-good', label: 'جيد جداً', color: '#8BC34A' },
  { value: 'good', label: 'جيد', color: '#FFC107' },
]

const PRODUCT_TYPES: Record<string, { code: string; name: string }[]> = {
  W: [
    { code: 'Qa', name: 'قميص' },
    { code: 'Ts', name: 'تيشرت' },
    { code: 'Ro', name: 'فستان' },
    { code: 'Ju', name: 'تنورة' },
    { code: 'Pa', name: 'بنطلون' },
    { code: 'Ja', name: 'جاكيت' },
  ],
  M: [
    { code: 'Qa', name: 'قميص' },
    { code: 'Ts', name: 'تيشرت' },
    { code: 'Pa', name: 'بنطلون' },
    { code: 'Ja', name: 'جاكيت' },
    { code: 'Sw', name: 'سويتر' },
  ],
  K: [
    { code: 'Qa', name: 'قميص' },
    { code: 'Ts', name: 'تيشرت' },
    { code: 'Ro', name: 'فستان' },
    { code: 'Pa', name: 'بنطلون' },
    { code: 'Ja', name: 'جاكيت' },
  ],
  SH: [
    { code: 'Ch', name: 'حذاء رياضي' },
    { code: 'Sa', name: 'صندل' },
    { code: 'Bo', name: 'بوت' },
    { code: 'Fo', name: 'حذاء رسمي' },
  ],
  BG: [
    { code: 'Ba', name: 'حقيبة يد' },
    { code: 'Bp', name: 'حقيبة ظهر' },
    { code: 'Cl', name: 'كلاتش' },
    { code: 'Wa', name: 'محفظة' },
  ],
}

export function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form state
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [brandSearch, setBrandSearch] = useState('')
  const [showBrandDropdown, setShowBrandDropdown] = useState(false)
  const [productType, setProductType] = useState('')
  const [price, setPrice] = useState('')
  const [size, setSize] = useState('')
  const [condition, setCondition] = useState('')
  
  const filteredBrands = brandSearch 
    ? searchBrands(brandSearch)
    : POPULAR_BRANDS
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])
  
  const handleSubmit = async () => {
    if (!imageFile || !category || !brand || !productType || !price || !size) {
      return
    }
    
    setLoading(true)
    
    try {
      // Generate serial number
      const brandCode = brand.substring(0, 2).toUpperCase()
      const id = String(Date.now()).slice(-4)
      const serial = `${category}-${brandCode}-${productType}-${price}-${size}-${id}`
      
      // Create form data
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('serial', serial)
      formData.append('category', category)
      formData.append('brand', brand)
      formData.append('productType', productType)
      formData.append('price', price)
      formData.append('size', size)
      formData.append('condition', condition)
      
      // Upload to API
      const res = await fetch('/api/products/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (res.ok) {
        onProductAdded?.()
        handleClose()
      } else {
        alert('حدث خطأ في إضافة المنتج')
      }
    } catch (error) {
      console.error('Error uploading product:', error)
      alert('حدث خطأ في إضافة المنتج')
    } finally {
      setLoading(false)
    }
  }
  
  const handleClose = () => {
    setStep(1)
    setImagePreview(null)
    setImageFile(null)
    setCategory('')
    setBrand('')
    setBrandSearch('')
    setProductType('')
    setPrice('')
    setSize('')
    setCondition('')
    onClose()
  }
  
  const canProceed = () => {
    switch (step) {
      case 1: return !!imagePreview
      case 2: return !!category && !!brand && !!productType
      case 3: return !!price && !!size && !!condition
      default: return false
    }
  }
  
  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md glass-strong rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <button onClick={handleClose}>
              <X className="w-6 h-6 text-white" />
            </button>
            <h2 className="text-lg font-bold text-white">إضافة منتج</h2>
            <div className="w-6" />
          </div>
          
          {/* Progress */}
          <div className="flex gap-2 p-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  s <= step ? 'bg-[#6C4DFF]' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          
          {/* Content */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-center">صورة المنتج</h3>
                
                {imagePreview ? (
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null)
                        setImageFile(null)
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-white/30 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#6C4DFF] transition-colors"
                  >
                    <div className="w-16 h-16 rounded-full glass flex items-center justify-center">
                      <Camera className="w-8 h-8 text-[#6C4DFF]" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium">اسحب الصورة هنا</p>
                      <p className="text-[#CFCFCF] text-sm">أو اضغط للاختيار</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-white font-medium mb-2">الفئة</label>
                  <div className="grid grid-cols-5 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.code}
                        onClick={() => {
                          setCategory(cat.code)
                          setProductType('')
                          setSize('')
                        }}
                        className={`p-3 rounded-xl text-center transition-all ${
                          category === cat.code
                            ? 'ring-2 ring-offset-2 ring-offset-[#0F0F1A]'
                            : 'glass'
                        }`}
                        style={{
                          backgroundColor: category === cat.code ? cat.color : undefined,
                          ringColor: cat.color,
                        }}
                      >
                        <span className="text-white text-xs">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Brand */}
                <div className="relative">
                  <label className="block text-white font-medium mb-2">الماركة</label>
                  <input
                    type="text"
                    value={brandSearch || brand}
                    onChange={(e) => {
                      setBrandSearch(e.target.value)
                      setBrand('')
                      setShowBrandDropdown(true)
                    }}
                    onFocus={() => setShowBrandDropdown(true)}
                    placeholder="ابحث عن ماركة..."
                    className="w-full h-12 px-4 rounded-xl glass text-white placeholder:text-[#CFCFCF] outline-none"
                  />
                  {showBrandDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl max-h-48 overflow-y-auto z-10">
                      {filteredBrands.map((b) => (
                        <button
                          key={b}
                          onClick={() => {
                            setBrand(b)
                            setBrandSearch('')
                            setShowBrandDropdown(false)
                          }}
                          className="w-full px-4 py-2 text-right text-white hover:bg-white/10 transition-colors"
                        >
                          {b}
                        </button>
                      ))}
                      {brandSearch && !ALL_BRANDS.includes(brandSearch) && (
                        <button
                          onClick={() => {
                            setBrand(brandSearch)
                            setBrandSearch('')
                            setShowBrandDropdown(false)
                          }}
                          className="w-full px-4 py-2 text-right text-[#6C4DFF] hover:bg-white/10 transition-colors"
                        >
                          + إضافة "{brandSearch}" كماركة جديدة
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Product Type */}
                {category && (
                  <div>
                    <label className="block text-white font-medium mb-2">نوع المنتج</label>
                    <div className="flex flex-wrap gap-2">
                      {PRODUCT_TYPES[category]?.map((pt) => (
                        <button
                          key={pt.code}
                          onClick={() => setProductType(pt.code)}
                          className={`px-4 py-2 rounded-xl transition-all ${
                            productType === pt.code
                              ? 'bg-[#6C4DFF] text-white'
                              : 'glass text-white hover:bg-white/10'
                          }`}
                        >
                          {pt.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-4">
                {/* Price */}
                <div>
                  <label className="block text-white font-medium mb-2">السعر (درهم)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="مثال: 350"
                    className="w-full h-12 px-4 rounded-xl glass text-white placeholder:text-[#CFCFCF] outline-none text-center text-xl"
                  />
                </div>
                
                {/* Size */}
                <div>
                  <label className="block text-white font-medium mb-2">المقاس</label>
                  <div className="flex flex-wrap gap-2">
                    {SIZES[category]?.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`w-12 h-12 rounded-xl transition-all ${
                          size === s
                            ? 'bg-[#6C4DFF] text-white'
                            : 'glass text-white hover:bg-white/10'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Condition */}
                <div>
                  <label className="block text-white font-medium mb-2">الحالة</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CONDITIONS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setCondition(c.value)}
                        className={`p-3 rounded-xl text-center transition-all ${
                          condition === c.value
                            ? 'ring-2 ring-offset-2 ring-offset-[#0F0F1A]'
                            : 'glass'
                        }`}
                        style={{
                          backgroundColor: condition === c.value ? c.color : undefined,
                          ringColor: c.color,
                        }}
                      >
                        <span className="text-white text-sm">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-white/10 flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 h-12 rounded-xl glass text-white font-medium"
              >
                رجوع
              </button>
            )}
            <button
              onClick={() => {
                if (step < 3) {
                  setStep(step + 1)
                } else {
                  handleSubmit()
                }
              }}
              disabled={!canProceed() || loading}
              className={`flex-1 h-12 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                canProceed()
                  ? 'bg-[#6C4DFF] text-white'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : step < 3 ? (
                <>
                  التالي
                  <Check className="w-5 h-5" />
                </>
              ) : (
                <>
                  إضافة المنتج
                  <Upload className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
