// frontend/src/Components/OrderSummary.jsx


import React, { useState } from 'react';
import { toast } from 'react-toastify';

const OrderSummary = ({ cart, onRemove, onUpdateQuantity, onPlaceOrder }) => {
  const [tableNumber, setTableNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const total = cart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);

  const handlePlaceOrder = () => {
    if (!tableNumber || isNaN(tableNumber)) {
      toast.error('Please enter a valid table number');
      return;
    }
    onPlaceOrder(parseInt(tableNumber), specialInstructions);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-6 mb-6">
            {cart.map(({ item, quantity }) => (
              <div key={item._id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpdateQuantity(item._id, quantity - 1)}
                    className="w-8 h-8 text-lg bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full"
                  >-</button>
                  <span className="text-base font-medium text-gray-800">{quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item._id, quantity + 1)}
                    className="w-8 h-8 text-lg bg-green-600 hover:bg-green-700 text-white rounded-full"
                  >+</button>
                  <button
                    onClick={() => onRemove(item._id)}
                    className="text-sm text-red-500 hover:underline"
                  >Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
              <input
                type="number"
                min="1"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-200"
                placeholder="Enter your table number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-200"
                placeholder="E.g., No onions, extra spicy..."
                rows={3}
              />
            </div>
            <div className="flex justify-between text-lg font-semibold text-gray-800">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderSummary;
