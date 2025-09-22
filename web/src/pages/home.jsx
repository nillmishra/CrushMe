import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../utils/userSlice";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.user);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile/view`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Not authenticated");
        const data = await response.json();
        if (!cancelled) dispatch(setUser(data));
      } catch {
        // Not logged in -> do nothing; AuthGate will show Login
      }
    };

    if (!user) fetchUser();
    return () => {
      cancelled = true;
    };
  }, [user, dispatch]);

  return (
    <div className="min-h-screen bg-base-200 text-base-content transition-colors duration-300">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Home;