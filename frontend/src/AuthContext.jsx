// AuthContext.js
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (token, user) => {
    setUser(user);
    setIsAuthenticated(true);
    setToken(token)
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setToken('');
  };

  return (
    <AuthContext.Provider value={{token,user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext)
}

export {useAuth, AuthProvider};
