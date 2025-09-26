import React, { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";

const GENDERS = ["Male", "Female", "Other"];
const INTERESTED_IN = ["Male", "Female", "Other", "All"];
const FALLBACK_IMG = "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";

const Signup = () => {
  const navigate = useNavigate();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [interestedIn, setInterestedIn] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [imgPreview, setImgPreview] = useState(FALLBACK_IMG);
  const [imgError, setImgError] = useState(false);

  // Validation
  const validatePassword = (pass) => {
    if (pass.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pass)) return "Password must include an uppercase letter";
    if (!/[a-z]/.test(pass)) return "Password must include a lowercase letter";
    if (!/[0-9]/.test(pass)) return "Password must include a number";
    if (!/[^A-Za-z0-9]/.test(pass)) return "Password must include a special character";
    return "";
  };

  // Handle image URL changes
  const handlePhotoUrlChange = (url) => {
    setPhotoUrl(url);
    
    if (!url) {
      setImgPreview(FALLBACK_IMG);
      setImgError(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      setImgPreview(url);
      setImgError(false);
    };
    img.onerror = () => {
      setImgPreview(FALLBACK_IMG);
      setImgError(true);
    };
    img.src = url;
  };

  // Skills management
  const addSkill = () => {
    const tokens = skillInput.split(",").map((s) => s.trim()).filter(Boolean);
    if (!tokens.length) return;
    setSkills((prev) => Array.from(new Set([...prev, ...tokens])));
    setSkillInput("");
  };
  
  const removeSkill = (s) => setSkills((prev) => prev.filter((x) => x !== s));
  
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  // Form validation
  const canSubmit = useMemo(() => {
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) return false;
    if (password !== confirmPassword) return false;
    if (validatePassword(password)) return false;
    if (age !== "" && (Number(age) < 18 || isNaN(Number(age)))) return false;
    if (!interestedIn) return false;
    if (photoUrl && imgError) return false;
    return true;
  }, [firstName, lastName, email, password, confirmPassword, age, interestedIn, photoUrl, imgError]);

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!canSubmit || isLoading) return;
    
    setError("");
    setPasswordError("");
    setIsLoading(true);
    setSuccess(false);
    
    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
      interestedIn
    };
    
    if (age) payload.age = Number(age);
    if (gender) payload.gender = gender;
    if (about?.trim()) payload.about = about.trim();
    if (photoUrl?.trim()) payload.photoUrl = photoUrl.trim();
    if (skills.length > 0) payload.skills = skills;
    
    try {
      // Send signup request
      await axios.post(`${API_BASE_URL}/signup`, payload);
      
      // Show success message
      setSuccess(true);
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/", { 
          state: { 
            email: email.trim(),
            message: "Account created successfully! Please log in." 
          } 
        });
      }, 1500);
      
    } catch (error) {
      const errorMessage = error.response?.data || "Signup failed";
      setError(typeof errorMessage === 'string' ? errorMessage : "An error occurred during signup");
      console.error("Error signing up:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full justify-center px-4 py-10">
        <div className="card w-full max-w-2xl bg-base-100 text-base-content shadow-xl">
          <div className="card-body">
            <div className="h-8 bg-gradient-to-r from-base-200 via-base-100 to-base-200 animate-shimmer rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 bg-gradient-to-r from-base-200 via-base-100 to-base-200 animate-shimmer rounded-lg"></div>
              ))}
            </div>
            <div className="h-12 mt-6 bg-gradient-to-r from-base-200 via-base-100 to-base-200 animate-shimmer rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center px-4 py-8">
      <div className="card w-full max-w-2xl bg-base-100 text-base-content shadow-xl transition-all duration-200 hover:shadow-2xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold">Create Your Account</h2>
          
          {success && (
            <div className="alert alert-success mt-4">
              <span>Account created successfully! Redirecting to login...</span>
            </div>
          )}
          
          <form onSubmit={handleSignup} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Form fields remain the same as your original code */}
              <div className="form-control">
                <label htmlFor="firstName" className="label ml-1 mb-1">
                  <span className="label-text">First Name*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  className="input input-bordered w-full"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              
              {/* Rest of your form fields go here - unchanged */}
              <div className="form-control">
                <label htmlFor="lastName" className="label ml-1 mb-1">
                  <span className="label-text">Last Name*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  className="input input-bordered w-full"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-control md:col-span-2">
                <label htmlFor="email" className="label ml-1 mb-1">
                  <span className="label-text">Email*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-control">
                <label htmlFor="password" className="label ml-1 mb-1">
                  <span className="label-text">Password*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className={`input input-bordered w-full ${passwordError ? 'input-error' : ''}`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(validatePassword(e.target.value));
                  }}
                  required
                />
                {passwordError && <span className="text-error text-xs mt-1">{passwordError}</span>}
                <p className="text-xs text-base-content/70 mt-1">
                  Must include uppercase, lowercase, number and special character.
                </p>
              </div>
              
              <div className="form-control">
                <label htmlFor="confirmPassword" className="label ml-1 mb-1">
                  <span className="label-text">Confirm Password*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className={`input input-bordered w-full ${
                    confirmPassword && password !== confirmPassword ? 'input-error' : ''
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {confirmPassword && password !== confirmPassword && (
                  <span className="text-error text-xs mt-1">Passwords don't match</span>
                )}
              </div>
              
              <div className="form-control">
                <label htmlFor="age" className="label ml-1 mb-1">
                  <span className="label-text">Age</span>
                </label>
                <input
                  id="age"
                  type="number"
                  min={18}
                  placeholder="18+"
                  className="input input-bordered w-full"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              
              <div className="form-control">
                <label htmlFor="gender" className="label ml-1 mb-1">
                  <span className="label-text">Gender</span>
                </label>
                <select
                  id="gender"
                  className="select select-bordered w-full"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select gender</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-control md:col-span-2">
                <label htmlFor="interestedIn" className="label ml-1 mb-1">
                  <span className="label-text">Interested In*</span>
                </label>
                <select
                  id="interestedIn"
                  className="select select-bordered w-full"
                  value={interestedIn}
                  onChange={(e) => setInterestedIn(e.target.value)}
                  required
                >
                  <option value="">Select preference</option>
                  {INTERESTED_IN.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-control md:col-span-2">
                <label htmlFor="about" className="label ml-1 mb-1">
                  <span className="label-text">About</span>
                </label>
                <textarea
                  id="about"
                  rows={3}
                  className="textarea textarea-bordered w-full"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell something about yourself"
                ></textarea>
              </div>
              
              <div className="form-control md:col-span-2">
                <label className="label ml-1 mb-1">
                  <span className="label-text">Skills</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map((s) => (
                    <div key={s} className="badge badge-outline gap-1">
                      {s}
                      <button
                        type="button"
                        className="ml-1 text-error"
                        onClick={() => removeSkill(s)}
                        aria-label={`Remove ${s}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {skills.length === 0 && (
                    <span className="text-xs text-base-content/60">Add a skill and press Enter</span>
                  )}
                </div>
                <div className="join w-full">
                  <input
                    type="text"
                    className="input input-bordered join-item w-full"
                    placeholder="Type a skill and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                  />
                  <button type="button" className="btn btn-outline join-item" onClick={addSkill}>
                    Add
                  </button>
                </div>
              </div>
              
              <div className="form-control">
                <label htmlFor="photoUrl" className="label ml-1 mb-1">
                  <span className="label-text">Photo URL</span>
                </label>
                <input
                  id="photoUrl"
                  type="url"
                  className={`input input-bordered w-full ${imgError ? 'input-error' : ''}`}
                  value={photoUrl}
                  onChange={(e) => handlePhotoUrlChange(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />
                {imgError && (
                  <span className="text-error text-xs mt-1">Invalid image URL</span>
                )}
              </div>
              
              <div className="flex items-center justify-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-base-300">
                  <img
                    src={imgPreview}
                    alt="Profile preview"
                    className="h-full w-full object-cover object-center"
                    onError={() => setImgPreview(FALLBACK_IMG)}
                  />
                </div>
              </div>
            </div>
            
            {error && (
              <div className="alert alert-error mt-4 py-2 text-sm">
                <span>{error}</span>
              </div>
            )}
            
            <div className="card-actions mt-6">
              <button
                className="btn btn-primary w-full"
                type="submit"
                disabled={!canSubmit || isLoading || success}
              >
                Create Account
              </button>
              
              <div className="text-center w-full mt-4">
                <p className="text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => navigate("/")}
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;