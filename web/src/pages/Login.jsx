import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../utils/userSlice";
import { API_BASE_URL } from "../utils/constants";

const Login = () => {
  const [email, setEmail] = useState("alokmishra67@gmail.com");
  const [password, setPassword] = useState("Alok@123");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUser(res.data));
      return navigate("/feed");
    } catch (error) {
      setError(error.response?.data || "Login failed");
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="flex w-full justify-center px-4 py-16 mt-16">
      <div className="card w-full max-w-sm bg-base-100 text-base-content shadow-xl transition-all duration-200 hover:shadow-2xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold">Login</h2>
          <div className="form-control mt-4">
            <label htmlFor="username" className="label ml-1 mb-2">
              <span className="label-text">Email</span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-control mt-4">
            <label htmlFor="username" className="label ml-1 mb-2">
              <span className="label-text">Password</span>
            </label>
            <input
              id="password"
              type="text"
              placeholder="Password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="text-red-500">{error}</p>
          <div className="card-actions mt-2 grid grid-cols-2 gap-3">
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
            <button className="btn btn-ghost">Signup</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
