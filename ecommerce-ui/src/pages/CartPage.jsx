// src/pages/CartPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getCartDetail } from '../api/aggregate'
import { clearCart, removeCartItem, updateCartItem } from '../api/cartApi'
import AsyncView from '../components/AsyncView'
import { useAsync } from '../hooks/useAsync'
import { describeError, formatRupiah } from '../utils/format'
import { getProductMedia } from '../utils/productAssets'

export default function CartPage({ userId, onCartUpdated }) {
  const { loading, data, error, reload } = useAsync(() => getCartDetail(userId), [userId])
  const [actionError, setActionError] = useState(null)

  async function run(action) {
    setActionError(null)
    try {
      await action()
      reload()
      if (onCartUpdated) onCartUpdated()
    } catch (err) {
      setActionError(err)
    }
  }

  return (
    <section>
      <div className="cart-header">
        <h1>Keranjang user {userId}</h1>
        <Link to="/" className="back-link">← Lanjut Belanja</Link>
      </div>

      {actionError && <p className="alert alert-error">{describeError(actionError)}</p>}

      <AsyncView loading={loading} error={error} onRetry={reload}>
        {data && data.items.length === 0 ? (
          <div className="empty-cart-box">
            <p className="muted">Keranjang kosong.</p>
            <Link to="/" className="btn-link-pill">Lihat Katalog Produk</Link>
          </div>
        ) : (
          data && (
            <div className="cart-layout">
              <div className="cart-list">
                {data.items.map((item) => {
                  const media = getProductMedia(item.product)
                  const subtotal = item.product
                    ? Number(item.product.price) * item.quantity
                    : 0

                  return (
                    <div key={item.id} className="cart-item-card">
                      <img
                        src={media.image}
                        alt={item.product?.name || 'Produk tidak tersedia'}
                        className="cart-item-thumb"
                      />

                      <div className="cart-item-info">
                        <h3>
                          {item.product ? (
                            <Link to={`/products/${item.product_id}`}>{item.product.name}</Link>
                          ) : (
                            <em>Produk tidak tersedia</em>
                          )}
                        </h3>
                        <p className="muted">
                          Harga satuan: {item.product ? formatRupiah(item.product.price) : '-'}
                        </p>

                        <div className="stepper-control">
                          <button
                            type="button"
                            className="stepper-btn"
                            aria-label="Kurangi"
                            disabled={item.quantity <= 1}
                            onClick={() => run(() => updateCartItem(item.id, item.quantity - 1))}
                          >
                            −
                          </button>
                          <span className="qty">{item.quantity}</span>
                          <button
                            type="button"
                            className="stepper-btn"
                            aria-label="Tambah"
                            onClick={() => run(() => updateCartItem(item.id, item.quantity + 1))}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-actions">
                        <p className="price">{item.product ? formatRupiah(subtotal) : '-'}</p>
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => run(() => removeCartItem(item.id))}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <aside className="cart-summary-card">
                <h2>Ringkasan Belanja</h2>
                <div className="summary-row">
                  <span>Total Item</span>
                  <span>
                    {data.items.reduce((acc, i) => acc + Number(i.quantity), 0)} barang
                  </span>
                </div>
                <div className="summary-row summary-total">
                  <span>Total Harga</span>
                  <span>{formatRupiah(data.totalPrice)}</span>
                </div>

                <button
                  type="button"
                  className="btn-clear-cart"
                  onClick={() => run(() => clearCart(userId))}
                >
                  Kosongkan keranjang
                </button>
              </aside>
            </div>
          )
        )}
      </AsyncView>
    </section>
  )
}