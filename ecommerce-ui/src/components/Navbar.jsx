// src/components/Navbar.jsx
import { NavLink } from 'react-router-dom'

export default function Navbar({ userId, onUserChange, cartCount = 0 }) {
  return (
    <header className="navbar">
      <nav>
        <strong>Toko Online</strong>
        <NavLink to="/" end>
          Produk
        </NavLink>
        <NavLink to="/cart" className="nav-cart-link">
          Keranjang
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>
      </nav>

      <label className="user">
        User ID
        <select value={userId} onChange={(e) => onUserChange(Number(e.target.value))}>
          <option value={1}>User 1</option>
          <option value={2}>User 2</option>
          <option value={3}>User 3</option>
        </select>
      </label>
    </header>
  )
}