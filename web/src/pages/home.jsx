import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../utils/userSlice";
import axios from "axios";
import ShimmerCard from "../components/ShimmerCard";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.user);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      // Check for token before making the API call
      const hasToken = localStorage.getItem('authToken');
      
      if (!hasToken) {
        setAuthChecked(true);
        return;
      }
      
      try {
        const res = await axios.get(`${API_BASE_URL}/profile/view`, {
          withCredentials: true,
          signal: controller.signal,
        });
        dispatch(setUser(res.data));
      } catch (err) {
        // Ignore 401 (not logged in) and aborted requests
        if (axios.isCancel?.(err) || err.code === "ERR_CANCELED") return;
        if (err.response?.status !== 401) {
          console.error("Auth check failed:", err);
        }
      } finally {
        setAuthChecked(true);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setAuthChecked(true);
    }

    return () => controller.abort();
  }, [user, dispatch]);

  return (
    <div className="flex min-h-screen flex-col bg-base-200 text-base-content transition-colors duration-300">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 mb-20">
        {authChecked ? <Outlet /> : <ShimmerCard />}
      </main>
      <Footer />
    </div>
  );
};

export default Home;