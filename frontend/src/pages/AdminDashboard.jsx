import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState(null);

  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/');
    } else {
      fetchProducts();
    }
  }, [userInfo, navigate]);

  const fetchProducts = async () => {
    const { data } = await api.get('/products');
    setProducts(data.products);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('stock', stock);
    if (image) {
      formData.append('image', image);
    }

    try {
      if (isEditing) {
        await api.put(`/products/${currentId}`, formData);
      } else {
        await api.post('/products', formData);
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error(error);
        alert('Error deleting product');
      }
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentId(product._id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setCategory(product.category);
    setStock(product.stock);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId('');
    setName('');
    setPrice(0);
    setDescription('');
    setCategory('');
    setStock(0);
    setImage(null);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Admin Dashboard</h2>
      
      <div className="form-container" style={{ maxWidth: '100%', marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px' }}>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={submitHandler} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" className="input-field" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input type="text" className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" className="input-field" value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea className="input-field" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Image Upload</label>
            <input type="file" className="input-field" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">
              <Plus size={18} /> {isEditing ? 'Update Product' : 'Add Product'}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-outline" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h3>Manage Products</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id.substring(0, 8)}...</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>
                  <button className="btn btn-outline" style={{ padding: '6px', marginRight: '10px' }} onClick={() => handleEdit(product)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn btn-danger" style={{ padding: '6px' }} onClick={() => deleteHandler(product._id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
