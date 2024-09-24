import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { fetchCartItems, addToCart, updateCartItem, removeCartItem } from './api/cartService';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return { ...state, cart: action.payload };

    case 'ADD_TO_CART':
      const existingItemIndex = state.cart.findIndex(
        (item) => item._id === action.payload._id
      );
      let updatedCart;
      if (existingItemIndex >= 0) {
        updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        updatedCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save to localStorage
      return { ...state, cart: updatedCart };

    case 'REMOVE_FROM_CART':
      const filteredCart = state.cart.filter((x) => x._id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(filteredCart)); // Save to localStorage
      return { ...state, cart: filteredCart };

    case 'UPDATE_CART_QUANTITY':
      const cartWithUpdatedQuantity = state.cart.map((item) =>
        item._id === action.payload.product._id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(cartWithUpdatedQuantity)); // Save to localStorage
      return { ...state, cart: cartWithUpdatedQuantity };
    case 'CLEAR_CART':
      localStorage.removeItem('cart');
      return { ...state, cart: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { cart: [] });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);