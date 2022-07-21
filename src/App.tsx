import Login from "./components/auth/Login";
import {
  BrowserRouter,
  Navigate,
  Route, Routes,
} from "react-router-dom";
import ListNews from "./components/news/ListNews";
import React, { useState } from "react";
import { Spin } from "antd";
import AuthProvider, { RequireAuth } from "./components/auth/AuthProvider";

interface GlobalData {
  setLoading: (status: boolean) => void
}

export const context = React.createContext<GlobalData>({setLoading: () => {}});

export default function App() {
  const [isLoading, setLoading] = useState<boolean>(false)

  return (
    <AuthProvider>
        <Spin spinning={isLoading} size="large" style={{marginTop: "30vh"}}>
        <context.Provider value={{setLoading}}>
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Navigate to="/login" replace/>}/>
              <Route path="/login" element={<Login />}/>
              <Route path="/news" element={<RequireAuth><ListNews /></RequireAuth>}/>
          </Routes>
        </BrowserRouter>
      </context.Provider>
      </Spin>
    </AuthProvider>
  )
}
