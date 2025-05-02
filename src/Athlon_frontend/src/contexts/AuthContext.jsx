import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      const isLoggedIn = await client.isAuthenticated();
      setIsAuthenticated(isLoggedIn);

      if (isLoggedIn) {
        const id = client.getIdentity();
        setIdentity(id);
        setPrincipal(id.getPrincipal().toText());
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async () => {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: async () => {
        const id = authClient.getIdentity();
        setIdentity(id);
        setPrincipal(id.getPrincipal().toText());
        setIsAuthenticated(true);
      },
    });
  };

  const logout = async () => {
    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
    setPrincipal(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        identity,
        principal,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
