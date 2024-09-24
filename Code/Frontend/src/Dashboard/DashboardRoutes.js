import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import DashboardHome from './DashboardHome';
import UserManagement from './UserManagement';
import Orders from './Orders';
import ProductList from './ProductList';
import ProductManagement from './ProductManagement';
import Profile from '../components/Profile/profile';
import SalesReport from './SalesReport/SalesReport';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route path="home" element={<DashboardHome />} />
        <Route path="user-Management" element={<UserManagement />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<ProductList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="product-management" element={<ProductManagement />} />
        <Route path="sales" element={<SalesReport />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
