// frontend/src/App.jsx


import React from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/Home';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
          <Route path="/signup" element={<PublicRoute> <Signup /> </PublicRoute>} />
          <Route path="/login" element={<PublicRoute> <Login /> </PublicRoute>} />
          <Route path="/Home" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
