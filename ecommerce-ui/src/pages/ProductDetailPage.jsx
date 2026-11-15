// src/pages/ProductDetailPage.jsx
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductDetail } from '../api/aggregate'
import { addToCart } from '../api/cartApi'
import AsyncView from '../components/AsyncView'
import ReviewForm from '../components/ReviewForm'
import StarRating from '../components/StarRating'
import { useAsync } from '../hooks/useAsync'
import { describeError, formatRupiah } from '../utils/format'
import { getProductMedia } from '../utils/productAssets'

export default function ProductDetailPage({ userId, onCartUpdated }) {
  const { id } = useParams()
  const { loading, data, error, reload } = useAsync(() => getProductDetail(id), [id])
  const [quantity, setQuantity] = useState('1')
  const [adding, setAdding] = useState(false)
  const [cartNotice, setCartNotice] = useState(null)

  async function handleAddToCart() {
    const amount = Math.max(1, Number(quantity) || 1)
    setAdding(true)
    setCartNotice(null)
    try {
      await addToCart(userId, Number(id), amount)
      if (onCartUpdated) onCartUpdated()
      setCartNotice({ type: 'success', text: 'Produk masuk ke keranjang.' })
    } catch (err) {
      setCartNotice({ type: 'error', text: describeError(err) })
    } finally {
      setAdding(false)
    }
  }

  return (
    <section>
      <p>
        <Link to="/" className="back-link">← Kembali ke daftar produk</Link>
      </p>
      <AsyncView loading={loading} error={error} onRetry={reload}>
        {data && (() => {
          const media = getProductMedia(data.product)

          return (
            <>
              <div className="detail-layout">
                <div className="detail-image-box">
                  <img src={media.image} alt={data.product.name} />
                </div>

                <div className="detail-info">
                  <span className="detail-category">{media.category}</span>
                  <h1>{data.product.name}</h1>

                  {data.reviews && (
                    <div className="detail-rating-row">
                      <StarRating
                        average={data.reviews.summary.average_rating}
                        total={data.reviews.summary.total_reviews}
                      />
                    </div>
                  )}

                  <p className="detail-price">{formatRupiah(data.product.price)}</p>

                  <div className="detail-desc-box">
                    <h3>Detail Produk</h3>
                    <p>{data.product.description || 'Tidak ada deskripsi produk.'}</p>
                  </div>

                  <p className="muted">Stok tersedia: <strong>{data.product.stock} unit</strong></p>

                  <div className="actions">
                    <input
                      type="number"
                      min="1"
                      aria-label="Jumlah"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                    <button
                      type="button"
                      disabled={adding || data.product.stock === 0}
                      onClick={handleAddToCart}
                    >
                      {adding ? 'Menambahkan...' : 'Masukkan ke keranjang'}
                    </button>
                  </div>

                  {cartNotice && (
                    <p className={`alert alert-${cartNotice.type}`}>{cartNotice.text}</p>
                  )}
                </div>
              </div>

              <div className="review-section">
                <h2>Review</h2>
                {data.reviews ? (
                  <ul className="reviews">
                    {data.reviews.reviews.map((review) => (
                      <li key={review.id}>
                        <StarRating average={review.rating} total={1} compact />
                        <p>{review.comment || <em className="muted">Tanpa komentar</em>}</p>
                        <small className="muted">
                          User {review.user_id},{' '}
                          {new Date(review.created_at).toLocaleDateString('id-ID')}
                        </small>
                      </li>
                    ))}
                    {data.reviews.reviews.length === 0 && (
                      <li className="muted">Belum ada review.</li>
                    )}
                  </ul>
                ) : (
                  <p className="alert alert-error">Review tidak dapat dimuat saat ini.</p>
                )}

                <ReviewForm productId={Number(id)} userId={userId} onCreated={reload} />
              </div>
            </>
          )
        })()}
      </AsyncView>
    </section>
  )
}