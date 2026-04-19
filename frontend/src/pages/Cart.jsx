import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate('/login?redirect=checkout'); // simple check, then Checkout routes there.
    navigate('/checkout'); // Let's just directly navigate for this demo assuming logged in or handled.
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
      <div>
        <h2>Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <div className="alert" style={{ marginTop: '20px' }}>
            Your cart is empty <Link to="/" style={{ textDecoration: 'underline' }}>Go Back</Link>
          </div>
        ) : (
          <div style={{ marginTop: '20px' }}>
            {cartItems.map((item) => (
              <div key={item.product} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '40%' }}>
                  <img src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} alt={item.name} style={{ width: '60px', borderRadius: '8px' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/60' }}/>
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                </div>
                <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${item.price}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button className="btn btn-outline" style={{ padding: '5px' }} onClick={() => addToCart(item, -1)} disabled={item.qty === 1}><Minus size={14} /></button>
                  <span>{item.qty}</span>
                  <button className="btn btn-outline" style={{ padding: '5px' }} onClick={() => addToCart(item, 1)} disabled={item.qty === item.stock}><Plus size={14} /></button>
                </div>
                <button className="btn btn-danger" style={{ padding: '8px' }} onClick={() => removeFromCart(item.product)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ height: 'fit-content' }}>
        <div className="card-body">
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginBottom: '15px' }}>
            Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
          </h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
            ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
          </div>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%' }} 
            disabled={cartItems.length === 0}
            onClick={checkoutHandler}
          >
            Proceed To Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
