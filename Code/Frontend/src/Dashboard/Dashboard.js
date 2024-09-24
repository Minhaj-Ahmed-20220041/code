import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Dashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../src/authContext';
import logo from '../images/logo.png'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { state: authState, dispatch } = useAuth();
  const username = localStorage.getItem('username');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [activeRouteName, setActiveRouteName] = useState("");

  useEffect(() => {
    const routeNames = {
      "/dashboard/home": "Dashboard Home",
      "/dashboard/user-management": "User Management",
      "/dashboard/orders": "Orders",
      "/dashboard/products": "Product List",
      "/dashboard/profile": "Profile",
      "/dashboard/product-management": "Add Product",
      "/dashboard/sales": "Sales",
    };

    setActiveRouteName(routeNames[location.pathname] || "Dashboard");
  }, [location.pathname]);


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    dispatch({ type: 'LOGOUT' });
    let redirectPath = '/';
    redirectPath = new URLSearchParams(location.search).get('redirect') || '/login';
    navigate(redirectPath, { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`dashboard ${sidebarOpen ? '' : 'sidebar-closed'}`}>
      <aside className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <nav>
          <ul>
            <li id="dashboard-li" className={isActive("/dashboard/home") ? "active" : ""}>
              <Link to="home"><i className="fa fa-home"></i> Dashboard</Link>
            </li>
            <li id="product-list-li" className={isActive("/dashboard/products") ? "active" : ""}>
              <Link to="products"><i className="fa fa-list-ul"></i> List Product</Link>
            </li>
            <li id="product-management-li" className={isActive("/dashboard/product-management") ? "active" : ""}>
              <Link to="product-management"><i className="fa fa-plus"></i> Add Product</Link>
            </li>
            <li id="orders-li" className={isActive("/dashboard/orders") ? "active" : ""}>
              <Link to="orders"><i className="fa-solid fa-box"></i> Order Management</Link>
            </li>
            <li id="user-management-li" className={isActive("/dashboard/user-management") ? "active" : ""}>
              <Link to="user-management"><i className="fa fa-users"></i> User Management</Link>
            </li>
            <li id="sales-report-li" className={isActive("/dashboard/sales") ? "active" : ""}>
              <Link to="sales"><i className="fa-solid fa-chart-simple"></i> Sales</Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">

        </div>
        <button
          className="toggle-btn"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <i className="fa fa-times" aria-hidden="true"></i> : <i className="fa fa-bars" aria-hidden="true"></i>}
        </button>
      </aside>
      <main className="main-content">
        <header className="admin-dashboard-header">
          <h3>{activeRouteName}</h3>
          {authState.isLoggedIn ? (
            <div className="admin-dropdown-wrapper" ref={dropdownRef}>
              <button
                className="admin-dropdown-toggle"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <i className="fas fa-user"></i> <span>{username}</span>
              </button>
              {showDropdown && (
                <ul className="admin-dropdown-menu show">
                  <li key="profile"><Link to="#">Profile</Link></li>
                  <li key="logout"><Link to="/login"></Link><button onClick={handleLogout}>Logout <i className="fa fa-sign-out"></i></button></li>
                </ul>
              )}
            </div>
          ) : (
            <div>
              <Link to="/login"><i className="fas fa-sign-in-alt"></i> Login</Link>
            </div>
          )}
        </header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
