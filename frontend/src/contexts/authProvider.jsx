import React, { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
const base_url = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    console.log("User:", user);
    console.log("Loading:", loading);
  }, [user, loading]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${base_url}/auth/verify-token`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Verified user:", data);
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
      console.error("Token verification network error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${base_url}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        await verifyToken();
        return null;
      }
      const errorData = await response.json();
      return errorData.error || "Login failed, please try again.";
    } catch (error) {
      console.error("Login error:", error);
      return "An unexpected error occurred. Please try again.";
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch(`${base_url}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        return null;
      }
      const errorData = await response.json();
      return errorData.error || "Registration failed. Please try again.";
    } catch (error) {
      console.error(error);
      return "An unexpected error occurred. Please try again.";
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
        console.error("Logout failed with status:", response.status);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register }}>
      {children}
    </AuthContext.Provider>
  );
};
