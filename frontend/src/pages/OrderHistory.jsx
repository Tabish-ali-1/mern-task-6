import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      const fetchOrders = async () => {
        try {
          const { data } = await api.get('/orders/myorders');
          setOrders(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchOrders();
    }
  }, [userInfo, navigate]);

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>My Orders</h2>
      {orders.length === 0 ? (
        <div className="alert">You have no orders yet.</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>ITEMS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.substring(0, 8)}...</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.isPaid ? (
                      <span style={{ color: 'var(--success)' }}>Yes</span>
                    ) : (
                      <span style={{ color: 'var(--danger)' }}>No</span>
                    )}
                  </td>
                  <td>{order.orderItems.length} items</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
