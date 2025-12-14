// src/context/AuthContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { loginUser, registerUser } from "../services/api";

const STORAGE_KEY = "lrstore_auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------
  // Restaurar sessão do localStorage no carregamento
  // ---------------------------------------------------
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.user) {
          setUser(parsed.user);
          setToken(parsed.token || null);
        }
      }
    } catch (err) {
      console.error("[AuthContext] Erro ao ler storage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const persistAuth = useCallback((userData, accessToken) => {
    setUser(userData || null);
    setToken(accessToken || null);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: userData, token: accessToken })
      );
    } catch (err) {
      console.error("[AuthContext] Erro ao gravar storage:", err);
    }
  }, []);

  // ---------------------------------------------------
  // LOGIN – aceita (objeto) OU (email, password)
  // ---------------------------------------------------
  const login = useCallback(
    async (payloadOrEmail, maybePassword) => {
      let data;
      if (typeof payloadOrEmail === "string") {
        data = { email: payloadOrEmail, password: maybePassword };
      } else {
        data = payloadOrEmail;
      }

      const res = await loginUser(data);
      // backend: { access_token, token_type, user }
      const loggedUser = res.user || null;
      const accessToken = res.access_token || null;

      if (loggedUser) {
        persistAuth(loggedUser, accessToken);
      }

      return res;
    },
    [persistAuth]
  );

  // ---------------------------------------------------
  // REGISTO – aceita (objeto) OU (name, email, password, phone?)
  // ---------------------------------------------------
  const register = useCallback(
    async (dataOrName, email, password, phone) => {
      let payload;
      if (typeof dataOrName === "string") {
        payload = {
          name: dataOrName,
          email,
          password,
          phone: phone || "",
        };
      } else {
        payload = dataOrName;
      }

      const res = await registerUser(payload);
      return res;
    },
    []
  );

  // ---------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("[AuthContext] Erro ao limpar storage:", err);
    }
  }, []);

  // ---------------------------------------------------
  // UPDATE USER (usado no AccountPage)
  // patch pode ser objeto OU função(prevUser)=>novoUser
  // ---------------------------------------------------
  const updateUser = useCallback(
    (patch) => {
      setUser((prev) => {
        if (!prev) {
          const next =
            typeof patch === "function" ? patch(null) : (patch || null);
          persistAuth(next, token);
          return next;
        }

        const next =
          typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
        persistAuth(next, token);
        return next;
      });
    },
    [persistAuth, token]
  );

  const isAuthenticated = !!user;

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return ctx;
};
