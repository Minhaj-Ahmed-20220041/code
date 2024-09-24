import React, { createContext, useReducer, useContext } from 'react';

// Define action types
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

// Define reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return { isLoggedIn: true, username: action.payload };
    case LOGOUT:
      return { isLoggedIn: false, username: null };
    default:
      return state;
  }
};

// Create initial state
const initialState = {
  isLoggedIn: false,
  username: null,
};

// Create context
const authContext = createContext();

// Create provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <authContext.Provider value={{ state, dispatch }}>
      {children}
    </authContext.Provider>
  );
};

// Custom hook to consume AuthContext
export const useAuth = () => useContext(authContext);
