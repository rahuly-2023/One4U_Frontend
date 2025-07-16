// ✅ OrderHistory.jsx - Tailwind CSS UI Enhancement
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        toast.error('Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) return <div className="text-center text-gray-500 py-8">Loading order history...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Order History</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No past orders found</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{order._id.substring(18, 24)}</td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-5 space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index}>{item.quantity}x {item.item ? item.item.name : "Item Removed"}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-700">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide 
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}
                    >
                      {order.status}
                    </span>
                  </td>
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
