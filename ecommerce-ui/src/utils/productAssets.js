// src/utils/productAssets.js
// Mengambil foto lokal dari folder public/images/

const PRODUCT_ASSETS = [
  {
    keywords: ['keyboard'],
    category: 'Keyboard',
    image: '/images/keyboard.jpg',
  },
  {
    keywords: ['mousepad'],
    category: 'Setup Meja',
    image: '/images/mousepad.jpg',
  },
  {
    keywords: ['mouse'],
    category: 'Mouse',
    image: '/images/mouse.jpg',
  },
  {
    keywords: ['headset'],
    category: 'Audio',
    image: '/images/headset.jpg',
  },
  {
    keywords: ['speaker'],
    category: 'Audio',
    image: '/images/speaker.jpg',
  },
  {
    keywords: ['webcam'],
    category: 'Kamera',
    image: '/images/webcam.jpg',
  },
  {
    keywords: ['flashdisk'],
    category: 'Aksesoris',
    image: '/images/flashdisk.jpg',
  },
  {
    keywords: ['hub'],
    category: 'Aksesoris',
    image: '/images/usbhub.jpg',
  },
  {
    keywords: ['stand'],
    category: 'Setup Meja',
    image: '/images/standlaptop.jpg',
  },
]

const FALLBACK_MEDIA = {
  category: 'Aksesoris',
  image: '/images/keyboard.jpg',
}

export function getProductMedia(product) {
  if (!product?.name) return FALLBACK_MEDIA
  const lower = product.name.toLowerCase()
  const matched = PRODUCT_ASSETS.find((item) =>
    item.keywords.some((kw) => lower.includes(kw))
  )
  return matched || FALLBACK_MEDIA
}

export const CATEGORIES = ['Semua', 'Keyboard', 'Mouse', 'Audio', 'Kamera', 'Aksesoris', 'Setup Meja']