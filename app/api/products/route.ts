import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface Product {
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

const CATEGORY_MAP: Record<string, string> = {
  W: 'نساء',
  M: 'رجال',
  K: 'أطفال',
  SH: 'أحذية',
  BG: 'حقائب',
}

const BRAND_MAP: Record<string, string> = {
  ZR: 'Zara',
  NK: 'Nike',
  AD: 'Adidas',
  LV: 'Louis Vuitton',
  GU: 'Gucci',
  HM: 'H&M',
  PU: 'Puma',
  NB: 'New Balance'
}

const PRODUCT_MAP: Record<string, string> = {
  Qa: 'قميص',
  Ts: 'تيشرت',
  Ja: 'جاكيت',
  Ro: 'فستان',
  Ch: 'حذاء',
  Pa: 'بنطلون',
  Ba: 'حقيبة',
  Ju: 'تنورة',
  Sn: 'سنيكرز',
}

function parseProductSerial(filename: string): Product | null {
  const match = filename.match(/^([A-Z]+)-([A-Z]+)-([A-Za-z]+)-(\d+)-([A-Z0-9]+)-(\d+)\.(jpg|jpeg|png)$/i)
  if (!match) return null

  const [, categoryCode, brandCode, productCode, price, size, id] = match

  return {
    id,
    serial: filename.replace(/\.(jpg|jpeg|png)$/i, ''),
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  try {
    const productsDir = path.join(process.cwd(), 'public', 'products')

    let products: Product[] = []

    if (fs.existsSync(productsDir)) {
      const files = fs.readdirSync(productsDir)

      products = files
        .map(parseProductSerial)
        .filter((p): p is Product => p !== null)
    }

    if (category && category !== 'all') {
      const categoryMap: Record<string, string> = {
        نساء: 'W',
        رجال: 'M',
        أطفال: 'K',
        أحذية: 'SH',
        حقائب: 'BG',
      }

      const categoryCode = categoryMap[category] || category.toUpperCase()
      products = products.filter(p => p.categoryCode === categoryCode)
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json([])
  }
}