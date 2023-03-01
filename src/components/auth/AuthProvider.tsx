import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

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
  let [token, setToken] = useState<string | null>(localStorage.getItem("access_token"));

  const signin = (token: string, callback: VoidFunction) => {
      localStorage.setItem("access_token", token);
      setToken(token)
      callback()
  }

  const signout = (callback: VoidFunction) => {
    localStorage.removeItem("access_token");
    callback()
  };

  const checkToken = (callback: VoidFunction) => {
    const token = localStorage.getItem("access_token");
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