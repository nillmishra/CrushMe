import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import appStore from "./utils/appStore";

import Home from "./pages/Home"; // layout with <Outlet />
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Profile from "./pages/Profile"; // uncomment if you have it

// Renders Feed if logged in, otherwise Login
function AuthGate() {
  const user = useSelector((s) => s.user.user);
  return user ? <Feed /> : <Login />;
}

// Optional: Protect specific routes like /feed, /profile
function ProtectedRoute({ children }) {
  const user = useSelector((s) => s.user.user);
  return user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            {/* "/" shows Login or Feed depending on auth */}
            <Route index element={<AuthGate />} />

            {/* Protected routes (optional but recommended) */}
            <Route
              path="feed"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />

            {/* Uncomment if you have Profile.jsx */}
            
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
           
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}