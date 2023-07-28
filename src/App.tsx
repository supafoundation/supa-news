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
import ListCategories from "./components/categories/ListCategories";
import ListCellLogs from "./components/cells/ListCellLogs";
import ListSparkLogs from "./components/sparks/ListSparkLogs";
import ListUsers from "./components/users/ListUsers";
import "./main.scss"
import ListLotteryConfigs from "./components/lottery/ListLotteries";

interface GlobalData {
  setLoading: (status: boolean) => void
}

export const context = React.createContext<GlobalData>({setLoading: () => {}});

export default function App() {
  const [isLoading, setLoading] = useState<boolean>(false)

  return (
    <AuthProvider>
        <Spin spinning={isLoading} size="large" style={{marginTop: "30vh", zIndex: 1000}}>
          <context.Provider value={{setLoading}}>
          <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace/>}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/categories" element={<RequireAuth><ListCategories /></RequireAuth>}/>
                <Route path="/news" element={<RequireAuth><ListNews /></RequireAuth>}/>
                <Route path="/cells" element={<RequireAuth><ListCellLogs /></RequireAuth>}/>
                <Route path="/sparks" element={<RequireAuth><ListSparkLogs /></RequireAuth>}/>
                <Route path="/users" element={<RequireAuth><ListUsers /></RequireAuth>}/>
                <Route path="/lottery-config" element={<RequireAuth><ListLotteryConfigs /></RequireAuth>}/>
            </Routes>
          </BrowserRouter>
        </context.Provider>
      </Spin>
    </AuthProvider>
  )
}
