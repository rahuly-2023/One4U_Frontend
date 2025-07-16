// ✅ Header.jsx - Tailwind UI Enhancements
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = ({ onSearch }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAlarmMenu, setShowAlarmMenu] = useState(false);
  const [showACForm, setShowACForm] = useState(false);
  const [temperature, setTemperature] = useState(24);
  const [showCleanForm, setShowCleanForm] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const updateLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    updateLoginStatus();
    window.addEventListener('auth-changed', updateLoginStatus);

    if (localStorage.getItem('token')) {
      navigate('/home');
    }

    return () => window.removeEventListener('auth-changed', updateLoginStatus);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/login');
  };

  const handleTemperatureSubmit = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/specialrequest`, {
        data: temperature,
        requestType: 'AC',
        Token: localStorage.getItem('token'),
      });
      toast.success('AC request sent successfully');
      setShowACForm(false);
      setShowAlarmMenu(false);
    } catch {
      toast.error('Failed to send AC request');
    }
  };

  const handleCleanSubmit = async (e) => {
    e.preventDefault();
    if (!tableNumber) return alert('Please enter a table number');

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/specialrequest`, {
        data: tableNumber,
        requestType: 'clean',
        Token: localStorage.getItem('token'),
      });
      toast.success('Clean request sent successfully');
      setTableNumber('');
      setShowCleanForm(false);
      setShowAlarmMenu(false);
    } catch {
      toast.error('Failed to send clean request');
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch?.(value);
  };

  return (
    <header className="bg-white shadow  sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-4 justify-between items-center">
        <div className="text-2xl font-bold text-green-600">
          <a href="/home">🍽️ One4U</a>
        </div>

        <div className="relative flex-1 min-w-[200px] md:max-w-xs">
          <input
            type="text"
            placeholder="Search food..."
            value={searchText}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-200"
          />
          {searchText && (
            <button
              onClick={() => {
                setSearchText('');
                onSearch('');
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 text-sm"
            >
              ✕
            </button>
          )}
        </div>

        <ToastContainer />

        <div className="flex items-center gap-4 relative">
          {isLoggedIn ? (
            <>
              <div className="relative">
                <FaBell
                  size={24}
                  className="cursor-pointer text-green-600 hover:text-green-700"
                  onClick={() => {
                    setShowAlarmMenu(!showAlarmMenu);
                    setShowUserMenu(false);
                  }}
                />
                {showAlarmMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50 p-4 space-y-2">
                    <ul className="space-y-1">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded" onClick={() => { setShowACForm(!showACForm); setShowCleanForm(false); }}>AC</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded" onClick={() => { setShowCleanForm(!showCleanForm); setShowACForm(false); }}>Clean</li>
                    </ul>
                    {showCleanForm && (
                      <form onSubmit={handleCleanSubmit} className="mt-2 space-y-2">
                        <input
                          type="text"
                          placeholder="Table No"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Submit</button>
                      </form>
                    )}
                    {showACForm && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <button className="px-3 py-1 bg-red-200 rounded hover:bg-red-300" onClick={() => setTemperature(t => Math.max(t - 1, 16))}>-</button>
                          <span className="text-lg font-semibold">{temperature}°C</span>
                          <button className="px-3 py-1 bg-green-200 rounded hover:bg-green-300" onClick={() => setTemperature(t => Math.min(t + 1, 30))}>+</button>
                        </div>
                        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700" onClick={handleTemperatureSubmit}>Submit</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
                <FaUserCircle
                  size={32}
                  className="cursor-pointer text-green-600 hover:text-green-700"
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowAlarmMenu(false);
                  }}
                />
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                    <ul className="divide-y divide-gray-200">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/profile')}>Profile</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/orders')}>Orders</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/requests')}>Requests</li>
                      <li className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer" onClick={handleLogout}>Logout</li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition" onClick={() => navigate('/login')}>
              Order Now
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
