import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { AuthContext } from '../hooks/auth';


// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(Cookies.get('auth_token'));
  const [isUiLoading, setUiLoader] = useState(false)
  useEffect(() => {
    setIsAuthenticated(Cookies.get('auth_token'));
  }, [])
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isUiLoading, setUiLoader }}>
      {children}
    </AuthContext.Provider>
  );
};

