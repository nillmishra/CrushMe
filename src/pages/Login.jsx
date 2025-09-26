import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";
import { loginUser } from "../utils/authUtils";
import { addRequests } from "../utils/requestSlice";
import { addFeed } from "../utils/feedSlice";
import { preloadImage } from "../utils/helpers";

const Login = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(location.state?.message || "");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Login
      const res = await axios.post(
        `${API_BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      
      dispatch(loginUser(res.data));

      // Fetch requests
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

      // Fetch and preload first feed user
      try {
        const feedRes = await axios.get(`${API_BASE_URL}/user/feed`, {
          params: { page: 1, limit: 10 },
          withCredentials: true,
        });
        
        const feedData = feedRes.data?.data || [];
        if (feedData.length > 0) {
          // Store first user image in session storage
          if (feedData[0].photoUrl) {
            sessionStorage.setItem('currentUserImage', feedData[0].photoUrl);
            await preloadImage(feedData[0].photoUrl);
          }
          dispatch(addFeed(feedData));
        }
      } catch (err) {
        console.error("Error prefetching feed:", err);
      }

      // Navigate after everything is loaded
      navigate("/feed");
      
    } catch (error) {
      setError(error.response?.data || "Login failed");
      console.error("Error logging in:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full justify-center px-4 py-16 mt-10">
        <div className="card w-full max-w-sm bg-base-100 text-base-content shadow-xl">
          <div className="card-body">
            <div className="h-8 bg-gradient-to-r from-base-200 via-base-100 to-base-200 animate-shimmer rounded-lg"></div>
            <div className="space-y-4 mt-4">
              <div className="h-4 w-1/4 bg-gradient-to-r from-base-200 via-base-100 to-base-200 animate-shimmer rounded"></div>
              <div className="h-10 bg-gradient-to-r from-base-200 via-base-100 to-base-200 animate-shimmer rounded-lg"></div>
              <div className="h-4 w-1/4 bg-gradient-to-r from-base-200 via-base-100 to-base-200 animate-shimmer rounded"></div>
              <div className="h-10 bg-gradient-to-r from-base-200 via-base-100 to-base-200 animate-shimmer rounded-lg"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="h-10 bg-gradient-to-r from-base-200 via-base-100 to-base-200 animate-shimmer rounded-lg"></div>
              <div className="h-10 bg-gradient-to-r from-base-200 via-base-100 to-base-200 animate-shimmer rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center px-4 py-16 mt-10">
      <div className="card w-full max-w-sm bg-base-100 text-base-content shadow-xl transition-all duration-200 hover:shadow-2xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold">Login</h2>
          
          {message && (
            <div className="alert alert-success mt-4 py-2">
              <span>{message}</span>
            </div>
          )}
          
          <div className="form-control mt-4">
            <label htmlFor="email" className="label ml-1 mb-2">
              <span className="label-text">Email</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-control mt-4">
            <label htmlFor="password" className="label ml-1 mb-2">
              <span className="label-text">Password</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-error text-sm mt-2">{error}</p>}
          <div className="card-actions mt-4 grid grid-cols-2 gap-3">
            <button 
              className="btn btn-primary" 
              onClick={handleLogin}
              disabled={isLoading}
            >
              Login
            </button>
            <button 
              className="btn btn-ghost" 
              onClick={() => navigate("/signup")} 
              disabled={isLoading}
            >
              Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;