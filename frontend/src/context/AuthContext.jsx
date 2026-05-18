import { createContext, useContext, useEffect, useState } from 'react';
import { getItems, getUser, loginRequest } from '../services/api';

const TOKEN_KEY = 'kum_demo_token';
const USER_KEY = 'kum_demo_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    async function hydrateUser() {
      if (!token) {
        setAuthReady(true);
        return;
      }

      try {
        const response = await getUser(token);
        setUser(response.user);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      } catch (error) {
        logout();
      } finally {
        setAuthReady(true);
      }
    }

    hydrateUser();
  }, [token]);

  async function login(email, password) {
    const response = await loginRequest({ email, password });
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    return response;
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  async function fetchItems() {
    return getItems(token);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        authReady,
        isAuthenticated: Boolean(token),
        login,
        logout,
        fetchItems,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
