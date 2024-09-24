import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { useAuth } from '../../authContext';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../cartContext';
import logo from '../../images/logo.png';
import SearchBar from '../Searchbar/SearchBar';
import Modal from '../Modal/Modal';
import ChangePassword from '../ChangePassword/ChangePassword';

const Header = () => {
  const { state: authState, dispatch } = useAuth();
  const username = localStorage.getItem('username');
  const [showDropdown, setShowDropdown] = useState(false);
  const { state: cartState } = useCart();
  const cartLength = cartState.cart ? cartState.cart.length : 0;
  const dropdownRef = useRef(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  const [changePasswordModal, setChangePasswordModal] = useState(false);

  const closeModal = () => setChangePasswordModal(false);

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchKeyword.trim() !== '') {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('sessionToken');
    dispatch({ type: 'LOGOUT' });
    dispatch({ type: 'LOGOUT' });
    setShowDropdown(false); // Hide the dropdown after logout
    let redirectPath = '/';
    redirectPath = new URLSearchParams(location.search).get('redirect') || '/login';
    navigate(redirectPath, { replace: true });
  };

  // Close dropdown if clicked outside
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

  return (
    <nav className='header'>
      <div className="logo-wrapper">
        <Link to="/">
          <img src={logo} alt="GadgetZone Logo" className="logo" />
        </Link>
      </div>
      <SearchBar searchKey={searchKeyword} onSearchChange={handleSearchChange} onSearchClick={handleSearchClick} />
      <div className="user-links-wrapper">
        <Link to="/store"><i className="fas fa-map-marker-alt"></i> Stores</Link>
        <Link to="/cart"><i className="fas fa-shopping-cart"></i> Cart ({cartLength})</Link>
        {authState.isLoggedIn ? (
          <div className="dropdown-wrapper" ref={dropdownRef}>
            <div className="dropdown">
              <button
                className="dropdown-toggle"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <i className="fas fa-user"></i> <span>{username}</span>
              </button>
              {showDropdown && (
                <ul className="dropdown-menu show">
                  <li key="profile"><Link to="/profile">Profile</Link></li>
                  <li key="cart"><Link to="/cart">Cart</Link></li>
                  <li key="order-history"><Link to="/order-history">My Orders</Link></li>
                  <li key="change-password" onClick={() => setChangePasswordModal(true)}><Link to="#">Change Password</Link></li>
                  <li key="logout"><button onClick={handleLogout}>Logout <i className="fa fa-sign-out"></i></button></li>
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div>
            <Link to="/login"><i className="fas fa-sign-in-alt"></i> Login</Link>
          </div>
        )}
      </div>

      {changePasswordModal && (
        <Modal isOpen={changePasswordModal} onClose={closeModal}>
            <ChangePassword onClose={closeModal}/>
        </Modal>
      )}
    </nav>
  );
};

export default Header;