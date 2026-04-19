import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <Package size={28} />
          ShopSphere
        </Link>
        <div className="nav-links">
          <Link to="/cart" className="nav-item">
            <ShoppingCart size={20} />
            Cart
            {cartItems.length > 0 && (
              <span className="cart-badge" style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px' }}>
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>
          
          {userInfo ? (
            <>
              {userInfo.role === 'admin' && (
                <Link to="/admin" className="nav-item">Admin</Link>
              )}
              <Link to="/history" className="nav-item">Orders</Link>
              <div className="nav-item" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                <LogOut size={20} /> Logout
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-item">
              <User size={20} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
