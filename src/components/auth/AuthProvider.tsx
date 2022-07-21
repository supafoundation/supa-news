import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthService from "../../services/AuthService";

interface AuthContextType {
    token: any;
    signin: (token: string, callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
    checkToken: (callback: VoidFunction) => void;
}

const AuthContext = React.createContext<AuthContextType>({
  token: "",
  signin: () => {},
  signout: () => {},
  checkToken: () => {}
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  let [token, setToken] = useState<string | null>("");

  const signin = (token: string, callback: VoidFunction) => {
      const service = new AuthService()
      service.saveTokenInLocalStorage(token)
      setToken(token)
      callback()
  }

  const signout = (callback: VoidFunction) => {
    const service = new AuthService()
    service.removeTokenInLocalStorage()
    callback()
  };

  const checkToken = (callback: VoidFunction) => {
    const service = new AuthService()
    const token = service.getTokenInLocalStorage()
    setToken(token)
    if(token){
      callback()
    }
  };

  let value = { token, signin, signout, checkToken };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return React.useContext(AuthContext);
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}