// frontend/src/Components/FloatingCart.jsx

import React from 'react';

const FloatingCart = ({ cart, onClick }) => {
  if (cart.length === 0) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.item.price, 0);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-xl shadow-2xl border border-green-200 ring-2 ring-green-400/30 rounded-3xl w-[90%] max-w-xl z-50 px-6 py-4 flex justify-between items-center transition-all duration-300">
      <div className="text-base text-gray-900 font-semibold">
        <span className="text-green-700">{totalItems}</span> item(s) — <span className="text-green-700">${totalPrice.toFixed(2)}</span>
      </div>
      <button
        onClick={onClick}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
      >
        View Cart
      </button>
    </div>
  );
};

export default FloatingCart;