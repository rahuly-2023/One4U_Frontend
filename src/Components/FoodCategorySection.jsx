// ✅ FoodCategorySection.jsx - Smooth Scroll + Responsive Cards with Dots
import React, { useRef, useEffect, useState } from 'react';

const FoodItemCard = ({ item, cart, onAddToCart, onUpdateQuantity }) => {
  const cartItem = cart.find(cartItem => cartItem.item._id === item._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="w-[240px] flex-shrink-0 bg-white rounded-2xl shadow hover:shadow-md transition p-4">
      <div className="h-36 w-full overflow-hidden rounded-lg bg-gray-100 mb-3">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-green-600 font-bold text-sm">${item.price.toFixed(2)}</span>
        {quantity === 0 ? (
          <button onClick={() => onAddToCart(item)} className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition">Add</button>
        ) : (
          <div className="flex items-center space-x-2">
            <button onClick={() => onUpdateQuantity(item._id, quantity - 1)} className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full font-bold">-</button>
            <span className="text-sm text-gray-800 font-medium">{quantity}</span>
            <button onClick={() => onUpdateQuantity(item._id, quantity + 1)} className="w-6 h-6 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold">+</button>
          </div>
        )}
      </div>
    </div>
  );
};

const FoodCategorySection = ({ category, cart, onAddToCart, onUpdateQuantity }) => {
  const scrollRef = useRef();
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      setCanScroll(true);
    } else {
      setCanScroll(false);
    }
  }, [category.items]);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.offsetWidth * 0.9;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="mb-12 relative">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
        {canScroll && (
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold text-gray-600 flex items-center justify-center shadow">←</button>
            <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold text-gray-600 flex items-center justify-center shadow">→</button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        {category.items?.map(item => (
          <FoodItemCard
            key={item._id}
            item={item}
            cart={cart}
            onAddToCart={onAddToCart}
            onUpdateQuantity={onUpdateQuantity}
          />
        ))}
      </div>
    </section>
  );
};

export default FoodCategorySection;