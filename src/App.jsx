import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import axios from "axios";
import appStore from "./utils/appStore";
import { API_BASE_URL } from "./utils/constants";
import { addRequests } from "./utils/requestSlice";
import { setUser } from "./utils/userSlice";
import ShimmerCard from "./components/ShimmerCard";

import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile"; 
import Connections from "./pages/Connections";
import Requests from "./pages/Requests";

// Set up axios interceptors
axios.interceptors.response.use(
  response => {
    // Check if response contains auth token and store it
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response;
  },
  error => {
    // Handle 401 errors by clearing auth
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  }
);

// App authentication state wrapper
function AppAuthentication() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);
  const user = useSelector(s => s.user.user);

  // Check authentication on app load
  useEffect(() => {
    const checkAuthentication = async () => {
      // Check if we have a token before making any API calls
      const storedToken = localStorage.getItem('authToken');
      if (!storedToken) {
        setAuthChecked(true);
        return;
      }

      try {
        // Set auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        // Get user data using the correct endpoint
        const res = await axios.get(`${API_BASE_URL}/profile/view`, {
          withCredentials: true
        });
        
        if (res.data) {
          // Store user in Redux
          dispatch(setUser(res.data));
          
          // Also fetch requests
          try {
            const requestsRes = await axios.get(
              `${API_BASE_URL}/user/requests/received`,
              { withCredentials: true }
            );
            const requestsData = Array.isArray(requestsRes.data?.data) 
              ? requestsRes.data.data 
              : requestsRes.data;
            dispatch(addRequests(requestsData || []));
          } catch (err) {
            console.error("Error fetching requests:", err);
          }
        }
      } catch (err) {
        if (err.response?.status !== 401) {
          console.log("Auth check failed", err);
        }
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuthentication();

    // Add event listener for when tab becomes visible
    const handleVisibilityChange = () => {
      // Only check authentication when tab becomes visible if we have a user or token
      if (document.visibilityState === 'visible' && (user || localStorage.getItem('authToken'))) {
        checkAuthentication();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

  }, [dispatch, user]);

  // Show loading state while checking authentication
  if (!authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-base-100">
        <ShimmerCard />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

// Routes component
function AppRoutes() {
  const user = useSelector(s => s.user.user);

  return (
    <Routes>
      <Route path="/" element={<Home />}>
        {/* Public routes */}
        <Route index element={user ? <Feed /> : <Login />} />
        <Route path="signup" element={user ? <Navigate to="/feed" replace /> : <Signup />} />

        {/* Protected routes */}
        <Route path="feed" element={user ? <Feed /> : <Navigate to="/" replace />} />
        <Route path="profile" element={user ? <Profile /> : <Navigate to="/" replace />} />
        <Route path="connections" element={user ? <Connections /> : <Navigate to="/" replace />} />
        <Route path="requests" element={user ? <Requests /> : <Navigate to="/" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Main App component
export default function App() {
  return (
    <Provider store={appStore}>
      <AppAuthentication />
    </Provider>
  );
}