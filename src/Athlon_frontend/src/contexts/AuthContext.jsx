import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../../../declarations/Athlon_backend";
import { INTERNET_IDENTITY_URL } from "../constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actor, setActor] = useState(null);
  const [userData, setUserData] = useState(null);

  const initAuth = async () => {
    const client = await AuthClient.create();
    setAuthClient(client);

    const isLoggedIn = await client.isAuthenticated();
    setIsAuthenticated(isLoggedIn);

    let actorInstance;

    if (isLoggedIn) {
      const id = client.getIdentity();
      const principalUser = id.getPrincipal();

      setIdentity(id);
      setPrincipal(principalUser);

      actorInstance = createActor(canisterId, {
        agentOptions: { identity: id },
      });

      try {
        const user = await actorInstance.getUserById(id.getPrincipal());
        if (user && user[0]) {
          setUserData(user[0]);
        }
      } catch (e) {
        console.error("Error fetching user:", e);
      }
    } else {
      actorInstance = createActor(canisterId);
    }

    setActor(actorInstance);
    setLoading(false);
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async () => {
    setLoading(true);
    await authClient.login({
      identityProvider: INTERNET_IDENTITY_URL,
      onSuccess: async () => {
        const id = authClient.getIdentity();
        const principalText = id.getPrincipal();

        setIdentity(id);
        setPrincipal(principalText);
        setIsAuthenticated(true);

        const canisterActor = createActor(canisterId, {
          agentOptions: { identity: id },
        });

        setActor(canisterActor);

        try {
          const user = await canisterActor.getUserById(principalText);
          if (user && user[0]) {
            setUserData(user[0]);
          }
        } catch (e) {
          console.error("Error fetching user:", e);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const refreshUserData = async () => {
    if (!actor || !principal) return;
    try {
      const user = await actor.getUserById(principal);
      if (user && user[0]) {
        setUserData(user[0]);
      }
    } catch (e) {
      console.error("Error refreshing user:", e);
    }
  };

  const logout = async () => {
    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
    setPrincipal(null);
    setUserData(null);
    setActor(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        identity,
        principal,
        actor,
        userData,
        login,
        logout,
        loading,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
