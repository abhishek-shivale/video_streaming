import React, { useState, useCallback, useEffect } from "react";
import { AuthState } from "@repo/types";
import { AuthContext } from "./AuthContext_";
import { axiosInstance } from "@/instance/axios.instance";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setState({ user: JSON.parse(storedUser), isAuthenticated: true });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    if (data.success) {
      const userData = { ...data.data };
      localStorage.setItem("user", JSON.stringify(userData));
      setState({ user: userData, isAuthenticated: true });
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const { data } = await axiosInstance.post("/auth/register", {
        email,
        password,
        name,
      });

      if (data.success) {
        const userData = { ...data.data };
        localStorage.setItem("user", JSON.stringify(userData));
        setState({ user: userData, isAuthenticated: true });
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setState({ user: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
