import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { AuthContext } from '../hooks/auth';
import { isAzureActivated } from '../utils/ApiConfigs';


const AzureActivated = await isAzureActivated()
// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(Cookies.get('auth_token'));
  const [isUiLoading, setUiLoader] = useState(false)
  const [useMSAzureSettings, setUseMSAzureSettings] = useState(true)
  useEffect(() => {
    setIsAuthenticated(Cookies.get('auth_token'));
    console.log(AzureActivated)
    setIsAuthenticated(AzureActivated);
  }, [useMSAzureSettings])
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isUiLoading, setUiLoader, useMSAzureSettings, setUseMSAzureSettings }}>
      {children}
    </AuthContext.Provider>
  );
};

