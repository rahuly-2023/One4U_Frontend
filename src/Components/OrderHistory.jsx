// frontend/src/Components/OrderHistory.jsx


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

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

    const socket = io(`${import.meta.env,VITE_API_ADMIN_BASE_URL}`);
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?._id) {
      socket.emit('register-user', user._id);
    }

    socket.on('order-updated', ({ orderId, status }) => {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status } : order
        )
      );

      toast.info(`Your order ${orderId.substring(18, 24)} is now ${status.toUpperCase()}`, {
        position: "top-right",
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored"
      });
    });

    

    return () => socket.disconnect();
  }, []);

  if (loading) return <div className="text-center text-gray-500 py-8">Loading order history...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-3">Your Order History</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No past orders found</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left text-gray-800">
            <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-6 py-4 font-mono text-gray-900">
                    {order._id.substring(18, 24)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.quantity}x {item.item ? item.item.name : "Item Removed"}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-700">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide shadow-sm
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'}`}
                    >
                      {order.status}
                    </span>

                    {order.status === 'pending' && (
                      <button
                        className="ml-2 inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-red-100 text-red-700 hover:bg-red-200 transition"
                        onClick={async () => {
                          try {
                            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/orders/${order._id}/status`, {
                              status: 'cancelled'
                            });
                            toast.success("Order cancelled successfully");
                          } catch {
                            toast.error("Cancellation failed");
                          }
                        }}
                      >
                        Cancel
                      </button>
                    )}
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
