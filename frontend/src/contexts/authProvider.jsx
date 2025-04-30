import React, { useState, useEffect, Children } from "react";
import { AuthContext } from "./authContext";
const base_url = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${base_url}/auth/verify-token`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else if ([401, 403, 404].includes(response.status)) {
        setUser(null);
      } else {
        console.error(
          "Unexpected token verification failure:",
          response.status
        );
        setUser(null);
      }
    } catch (error) {
      console.error("Unexpected token verification failure: ", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${base_url}/auth/login`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        await verifyToken();
      } else if (response.status === 401) {
        throw new Error("Invalid username or password");
      } else {
        throw new Error("Login failed, please try again.");
      }
    } catch (error) {
      console.error("Login error: ", error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      await fetch(`${base_url}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${base_url}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setUser(null);
      } else {
        console.error("Logout failed ", response.status);
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register }}>
      {children}
    </AuthContext.Provider>
  );
};
