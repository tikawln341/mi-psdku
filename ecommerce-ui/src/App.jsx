// src/App.jsx
import { useCallback, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { getCart } from './api/cartApi'
import Navbar from './components/Navbar'
import CartPage from './pages/CartPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductListPage from './pages/ProductListPage'

export default function App() {
  const [userId, setUserId] = useState(() => Number(localStorage.getItem('userId')) || 1)
  const [cartCount, setCartCount] = useState(0)

  const refreshCartCount = useCallback(async () => {
    try {
      const cart = await getCart(userId)
      const items = Array.isArray(cart) ? cart : cart?.items || []
      const totalQty = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
      setCartCount(totalQty)
    } catch {
      setCartCount(0)
    }
  }, [userId])

  useEffect(() => {
    localStorage.setItem('userId', String(userId))
    refreshCartCount()
  }, [userId, refreshCartCount])

  return (
    <>
      <Navbar userId={userId} onUserChange={setUserId} cartCount={cartCount} />
      <main className="container">
        <Routes>
          <Route
            path="/"
            element={<ProductListPage userId={userId} onCartUpdated={refreshCartCount} />}
          />
          <Route
            path="/products/:id"
            element={<ProductDetailPage userId={userId} onCartUpdated={refreshCartCount} />}
          />
          <Route
            path="/cart"
            element={<CartPage userId={userId} onCartUpdated={refreshCartCount} />}
          />
          <Route path="*" element={<p>Halaman tidak ditemukan.</p>} />
        </Routes>
      </main>
    </>
  )
}