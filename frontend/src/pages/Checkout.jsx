import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [userInfo, cartItems, navigate]);

  const placeOrderHandler = async () => {
    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    
    try {
      const { data } = await api.post('/orders', {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: 'Stripe (Dummy)',
        totalPrice,
      });
      clearCart();
      alert('Order placed successfully!');
      navigate('/history');
    } catch (error) {
      console.error(error);
      alert('Error placing order');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
      <div className="form-container" style={{ margin: 0, maxWidth: '100%' }}>
        <h2 style={{ marginBottom: '20px' }}>Shipping Address</h2>
        <div className="form-group">
          <label>Address</label>
          <input type="text" className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>City</label>
          <input type="text" className="input-field" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Postal Code</label>
          <input type="text" className="input-field" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input type="text" className="input-field" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginBottom: '15px' }}>Order Summary</h2>
          {cartItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>{item.qty} x {item.name}</span>
              <span>${(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', marginTop: '20px', paddingTop: '20px', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
            <span>Total:</span>
            <span>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '30px' }} 
            onClick={placeOrderHandler}
            disabled={!address || !city || !postalCode || !country}
          >
            Pay & Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
