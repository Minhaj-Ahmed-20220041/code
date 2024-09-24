import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import Profile from './components/Profile/profile';
import Register from './components/Login/RegistrationPage';
import RegistrationSuccessPage from './components/Login/RegistrationSuccessPage';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth, AuthProvider } from './authContext';
import ForgotPasswordForm from './components/Login/ForgetPassword/ForgetPasswordForm';
import EnterVerificationCodePage from './components/Login/ForgetPassword/EnterVerificationCodePage';
import ResetPasswordPage from './components/Login/ForgetPassword/ResetPasswordPage';
import PasswordResetSuccessPage from './components/Login/ForgetPassword/PasswordResetSuccessPage';
import ProductDetails from './components/ProductDetails/ProductDetails';
import { CartProvider } from './cartContext';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import SearchResult from './components/SearchResult/SearchResult';
import OrderHistory from './components/Orders/OrderHistory';
import OrderDetail from './components/Orders/OrderDetail';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeroSection from './components/HeroSection/HeroSection';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import DashboardRoutes from './Dashboard/DashboardRoutes';
import Store from './components/Store/Store';

const AppContent = () => {
  const { state, dispatch } = useAuth();
  const [products, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    if (token) {
      dispatch({ type: 'LOGIN' });
    }
  }, [dispatch]);

  useEffect(() => {
    setProducts([
      { id: 1, title: 'Sony WH-1000XM4', description: 'Noise cancelling wireless headphones.', price: '$348.00', image: 'https://images-na.ssl-images-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg', category: 'Electronics' },
      { id: 2, title: 'Logitech MX Master 3', description: 'Advanced wireless mouse for precision and comfort.', price: '$99.99', image: 'https://images-na.ssl-images-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg', category: 'Accessories' },
      { id: 3, title: 'Apple MacBook Air', description: '13-inch, 8GB RAM, 256GB SSD, Apple M1 chip.', price: '$999.99', image: 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mba13-spacegray-config-202402?wid=820&hei=498&fmt=jpeg&qlt=90&.v=1708371033138', category: 'Computers' },
      { id: 4, title: 'Samsung Galaxy Watch 3', description: 'Smartwatch with advanced health monitoring.', price: '$399.99', image: 'https://images-na.ssl-images-amazon.com/images/I/71jN27mYlhL._AC_SL1500_.jpg', category: 'Wearables' },
      { id: 5, title: 'Dell UltraSharp U2720Q', description: '27-inch 4K UHD monitor with wide color coverage.', price: '$539.99', image: 'https://images-na.ssl-images-amazon.com/images/I/71vFKBpKakL._AC_SL1500_.jpg', category: 'Computers' },
      { id: 6, title: 'Jabra Elite 75t', description: 'True wireless earbuds with charging case.', price: '$149.99', image: 'https://express.generation-e.com.au/cdn/shop/products/Jabra-Engage-75-Physical-Jabra-Stereo-2_540x.jpg?v=1672261871', category: 'Electronics' },
      { id: 7, title: 'Fitbit Charge 4', description: 'Fitness and activity tracker with built-in GPS.', price: '$129.95', image: 'https://images-na.ssl-images-amazon.com/images/I/71smqRr0pmL._AC_SL1500_.jpg', category: 'Wearables' },
      { id: 8, title: 'Nintendo Switch', description: 'Hybrid gaming console for home and on-the-go gaming.', price: '$299.99', image: 'https://images-na.ssl-images-amazon.com/images/I/61-PblYntsL._AC_SL1500_.jpg', category: 'Gaming' },
      { id: 9, title: 'WD My Passport', description: '2TB portable external hard drive.', price: '$62.99', image: 'https://images-na.ssl-images-amazon.com/images/I/61IBBVJvSDL._AC_SL1500_.jpg', category: 'Accessories' },
      { id: 10, title: 'Bose SoundLink Revolve', description: 'Portable Bluetooth speaker with 360° sound.', price: '$199.00', image: 'https://assets.kogan.com/images/horizonstore/HOS-858366-5130/1-b124c4105e-1_7f76fcda-91e2-48df-b972-d605f7543aed.png?auto=webp&bg-color=fff&canvas=1200.0%2C800.0&dpr=1.0&enable=upscale&fit=bounds&height=800&quality=90&width=1200', category: 'Electronics' }
    ]);
  }, []);

  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboardRoute && <Header />}
      <Routes>
        <Route path="/dashboard/*" element={<DashboardRoutes />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registration-success" element={<RegistrationSuccessPage />} />
        <Route path="/forget-password" element={<ForgotPasswordForm />} />
        <Route path="/enter-verification-code" element={<EnterVerificationCodePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccessPage />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/store" element={<Store />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
        </Route>
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/order/:orderId" element={<OrderDetail />} />
      </Routes>
      {!isDashboardRoute && <Footer />}
      <ToastContainer />
    </>
  );
};

const App = () => (
  <AuthProvider>
    <CartProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </CartProvider>
  </AuthProvider>
);

export default App;
