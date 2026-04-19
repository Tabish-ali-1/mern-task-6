import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, Search } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const { addToCart } = useContext(CartContext);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get(`/products?keyword=${keyword}&category=${category}`);
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword, category]);

  const categories = ['Electronics', 'Clothing', 'Books', 'Home'];

  return (
    <>
      <div className="hero">
        <h1>Welcome to ShopSphere</h1>
        <p>Premium quality products tailored just for you. Discover our exclusive collections and enjoy a seamless shopping experience.</p>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
          <Search size={20} style={{ position: 'absolute', left: '15px', top: '12px', color: 'var(--text-muted)' }} />
        </div>
        <select
          className="input-field"
          style={{ width: '200px' }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid">
        {products.map((product) => (
          <div key={product._id} className="card">
            <Link to={`/product/${product._id}`} className="card-img-wrapper" style={{ display: 'block', backgroundColor: 'transparent' }}>
              <img
                src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
                alt={product.name}
                className="card-img"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
              />
            </Link>
            <div className="card-body">
              <Link to={`/product/${product._id}`} className="card-title">
                {product.name}
              </Link>
              <div style={{ flexGrow: 1 }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <span className="card-price">${product.price.toFixed(2)}</span>
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 15px' }}
                  onClick={() => addToCart(product, 1)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart size={16} /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No products found matching your criteria.
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
