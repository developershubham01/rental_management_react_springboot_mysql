import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("rentify_token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("rentify_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (!token) {
      return;
    }
    client
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data);
        localStorage.setItem("rentify_user", JSON.stringify(data));
      })
      .catch(() => logout());
  }, [token]);

  const login = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem("rentify_token", payload.token);
    localStorage.setItem("rentify_user", JSON.stringify(payload.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("rentify_token");
    localStorage.removeItem("rentify_user");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        isAdmin: user?.role === "ROLE_ADMIN",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

