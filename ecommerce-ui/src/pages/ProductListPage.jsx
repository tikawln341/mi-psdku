// src/pages/ProductListPage.jsx
import { useMemo, useState } from 'react'
import { getProductsWithRating } from '../api/aggregate'
import AsyncView from '../components/AsyncView'
import ProductCard from '../components/ProductCard'
import { useAsync } from '../hooks/useAsync'
import { CATEGORIES, getProductMedia } from '../utils/productAssets'

export default function ProductListPage({ userId, onCartUpdated }) {
  const { loading, data, error, reload } = useAsync(getProductsWithRating, [])
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    if (!data) return []
    return data
      .filter((product) => {
        const media = getProductMedia(product)
        const matchCategory =
          selectedCategory === 'Semua' || media.category === selectedCategory
        const matchSearch = product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
        return matchCategory && matchSearch
      })
      .sort((a, b) => Number(a.id) - Number(b.id))
  }, [data, selectedCategory, searchQuery])

  return (
    <section>
      <div className="hero-banner">
        <div className="hero-content">
          <span className="hero-tag">Koleksi Pilihan 2026</span>
          <h1>Workspace & Gaming Gear</h1>
          <p>
            Lengkapi meja kerjamu dengan perangkat ergonomis dan mekanikal pilihan terbaik.
          </p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Cari keyboard, mouse, headset, atau aksesoris..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="/images/banner.jpg"
            alt="Setup Meja Kerja"
          />
        </div>
      </div>

      <div className="filter-bar">
        <h2>Kategori Produk</h2>
        <div className="pill-group">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <AsyncView loading={loading} error={error} onRetry={reload}>
        {filteredProducts.length === 0 ? (
          <p className="muted">Tidak ada produk yang cocok dengan pencarianmu.</p>
        ) : (
          <div className="grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                summary={product.rating}
                userId={userId}
                onCartUpdated={onCartUpdated}
              />
            ))}
          </div>
        )}
      </AsyncView>
    </section>
  )
}