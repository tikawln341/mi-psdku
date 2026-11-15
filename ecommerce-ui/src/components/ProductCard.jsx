// src/components/ProductCard.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addToCart } from '../api/cartApi'
import { formatRupiah } from '../utils/format'
import { getProductMedia } from '../utils/productAssets'
import StarRating from './StarRating'

export default function ProductCard({ product, userId = 1, onCartUpdated }) {
  const { id, name, price, stock, rating } = product
  const media = getProductMedia(product)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  async function handleQuickAdd(e) {
    e.preventDefault()
    if (adding || stock === 0) return
    setAdding(true)
    try {
      await addToCart(userId, Number(id), 1)
      setAdded(true)
      if (onCartUpdated) onCartUpdated()
      setTimeout(() => setAdded(false), 1800)
    } catch {
      alert('Gagal menambahkan produk ke keranjang.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <article className="card product-card">
      <Link to={`/products/${id}`} className="card-thumb-wrap">
        <img
          src={media.image}
          alt={name}
          className="card-thumb"
          loading="lazy"
        />
        <span className="card-badge">{media.category}</span>
      </Link>

      <div className="card-body">
        <div className="card-title-row">
          <h3>
            <Link to={`/products/${id}`}>{name}</Link>
          </h3>
          <span className="card-rating">
            {rating === null ? (
              <span className="muted">—</span>
            ) : (
              <StarRating
                average={rating.average_rating}
                total={rating.total_reviews}
              />
            )}
          </span>
        </div>

        <p className="card-meta">Stok: {stock} unit</p>

        <div className="card-footer-row">
          <p className="price">{formatRupiah(price)}</p>
          <button
            type="button"
            className={`btn-quick-add ${added ? 'is-added' : ''}`}
            disabled={adding || stock === 0}
            onClick={handleQuickAdd}
          >
            {added ? 'Masuk ✓' : adding ? '...' : '+ Keranjang'}
          </button>
        </div>
      </div>
    </article>
  )
}