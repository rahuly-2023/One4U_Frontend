// ✅ Home.jsx - UI Updated with Content Width Restriction and Styling Enhancements
import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Components/Header';
import FoodCategorySection from '../Components/FoodCategorySection';
import OrderSummary from '../Components/OrderSummary';
import OrderHistory from '../Components/OrderHistory';
import FilterSortControls from '../Components/FilterSortControls';
import FloatingCart from '../Components/FloatingCart';
import { toast } from 'react-toastify';

function Home() {
  const token = localStorage.getItem('token');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('menu');
  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [searchText, setSearchText] = useState('');

  if (!token) return <Navigate to="/login" />;

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/menu`)
      .then(res => {
        setCategories(res.data);
        setFilteredCategories(res.data);
      })
      .catch(() => toast.error('Failed to load menu'));

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/recommendations`, { Token: token })
      .then(res => {
        setRecommendations(res.data);
        setFilteredRecommendations(res.data);
      })
      .catch(() => toast.error('Could not load recommendations'));
  }, [token]);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearchChange = useCallback(
    debounce((value) => setSearchText(value), 300),
    []
  );

  useEffect(() => {
    let newCategories = JSON.parse(JSON.stringify(categories));

    if (searchText) {
      newCategories = newCategories.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchText.toLowerCase())
        )
      })).filter(cat => cat.items.length > 0);
    }

    if (filterOption) {
      newCategories = newCategories.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          filterOption === 'veg' ? item.isVeg : !item.isVeg
        )
      })).filter(cat => cat.items.length > 0);
    }

    if (sortOption) {
      newCategories = newCategories.map(cat => ({
        ...cat,
        items: cat.items.sort((a, b) =>
          sortOption === 'price-asc' ? a.price - b.price : b.price - a.price
        )
      }));
    }

    setFilteredCategories(newCategories);
  }, [categories, sortOption, filterOption, searchText]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.item._id === item._id);
      if (existing) {
        return prev.map(i => i.item._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.item._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) return removeFromCart(itemId);
    setCart(prev => prev.map(i => i.item._id === itemId ? { ...i, quantity: newQuantity } : i));
  };

  const placeOrder = (tableNumber, specialInstructions) => {
    const orderItems = cart.map(({ item, quantity }) => ({ itemId: item._id, quantity }));
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/order`, {
      items: orderItems,
      Token: token,
      tableNumber,
      specialInstructions
    })
      .then(() => {
        toast.success('Order placed successfully!');
        setCart([]);
      })
      .catch(() => toast.error('Failed to place order'));
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6">
      <div className="max-w-6xl mx-auto">
        <Header onSearch={handleSearchChange} />

        <div className="flex mb-6 border-b border-gray-300 mt-6">
          {['menu', 'cart', 'history'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 capitalize text-sm font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-green-600'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab} {tab === 'cart' && `(${cart.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'menu' && (
          <>
            <FilterSortControls
              onSortChange={setSortOption}
              onFilterChange={setFilterOption}
            />

            {!searchText && recommendations.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Recommended For You</h2>
                <div className="flex overflow-x-auto gap-4 pb-2">
                  {recommendations.map(item => {
                    const cartItem = cart.find(c => c.item._id === item._id);
                    const quantity = cartItem ? cartItem.quantity : 0;
                    return (
                      <div key={item._id} className="min-w-[220px] max-w-[220px] bg-white rounded-2xl shadow p-4">
                        <div className="h-32 w-full overflow-hidden rounded bg-gray-100 mb-2">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                          )}
                        </div>
                        <h3 className="text-base font-semibold mb-1 text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-green-600 font-semibold text-sm">${item.price.toFixed(2)}</span>
                          {quantity === 0 ? (
                            <button onClick={() => addToCart(item)} className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Add</button>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <button onClick={() => updateQuantity(item._id, quantity - 1)} className="w-6 h-6 bg-gray-200 rounded-full hover:bg-gray-300">-</button>
                              <span className="text-sm">{quantity}</span>
                              <button onClick={() => updateQuantity(item._id, quantity + 1)} className="w-6 h-6 bg-green-600 text-white rounded-full hover:bg-green-700">+</button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {filteredCategories.length > 0 ? (
              filteredCategories.map(category => (
                <div id={`cat-${category._id}`} key={category._id}>
                  <FoodCategorySection
                    category={category}
                    cart={cart}
                    onAddToCart={addToCart}
                    onUpdateQuantity={updateQuantity}
                    searchText={searchText}
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 text-lg mt-10">No results found.</div>
            )}
          </>
        )}

        {activeTab === 'cart' && (
          <OrderSummary
            cart={cart}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onPlaceOrder={placeOrder}
          />
        )}

        {activeTab === 'history' && <OrderHistory />}

        <FloatingCart cart={cart} onClick={() => setActiveTab('cart')} />
      </div>
    </div>
  );
}

export default Home;
