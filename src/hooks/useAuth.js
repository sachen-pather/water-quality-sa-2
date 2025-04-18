import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/services/api";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await authApi.checkAuth();
      if (response.data.authenticated) {
        setUser(response.data.user);
      } else {
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setError("Authentication failed. Please log in again.");
      setUser(null);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authApi.login({ email, password });
      if (response.data.status === "success") {
        localStorage.setItem("isLoggedIn", "true");
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem("isLoggedIn");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    // Check auth status on mount if user was previously logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [checkAuth]);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
  };
};

export default useAuth;
