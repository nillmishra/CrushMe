// src/components/ProfileEdit.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { API_BASE_URL } from "../utils/constants";
import { setUser } from "../utils/userSlice";

const GENDERS = ["Male", "Female", "Other"];
const INTERESTED_IN = ["Male", "Female", "Other", "All"];
const FALLBACK_IMG = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

export default function ProfileEdit({ user }) {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [age, setAge] = useState(user?.age ?? "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [interestedIn, setInterestedIn] = useState(user?.interestedIn || "");
  const [skills, setSkills] = useState(
    Array.isArray(user?.skills)
      ? user.skills
      : user?.skills
      ? String(user.skills).split(",").map((s) => s.trim()).filter(Boolean)
      : []
  );
  const [skillInput, setSkillInput] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [imgSrc, setImgSrc] = useState(photoUrl || FALLBACK_IMG);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    setImgSrc(photoUrl || FALLBACK_IMG);
    setImgLoaded(false);
    setTriedFallback(!photoUrl);
  }, [photoUrl]);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete && el.naturalWidth > 0) {
      setImgLoaded(true);
      return;
    }
    if (typeof el.decode === "function") {
      el.decode().then(() => setImgLoaded(true)).catch(() => {});
    }
  }, [imgSrc]);

  const canSave = useMemo(() => {
    if (!firstName?.trim() || !lastName?.trim()) return false;
    if (!interestedIn || !INTERESTED_IN.includes(interestedIn)) return false;
    if (age !== "" && Number(age) < 18) return false;
    if (gender && !GENDERS.includes(gender)) return false;
    return true;
  }, [firstName, lastName, interestedIn, age, gender]);

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

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!canSave || saving) return;

    setError("");
    setSaved(false);
    setSaving(true);

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: age === "" ? undefined : Number(age),
      gender: gender || undefined,
      about: about?.trim(),
      skills,
      photoUrl: photoUrl?.trim(),
      interestedIn,
    };

    try {
      const res = await axios.put(`${API_BASE_URL}/profile/edit`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      const updatedUser = res.data?.user || res.data?.data || res.data;
      dispatch(setUser(updatedUser));
      setSaved(true);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === "string" ? err.response.data : "") ||
        err.message || "Failed to save";
      setError(msg);
      console.error("Profile update failed (PUT):", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left: form */}
      <form onSubmit={handleSave} className="lg:col-span-7 card w-full h-full min-h-[520px] bg-base-100 text-base-content shadow-xl">
        <div className="card-body flex flex-col h-full">
          <h2 className="card-title text-2xl font-bold">Edit Profile</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="form-control">
              <label className="label ml-1 mb-1"><span className="label-text">First Name</span></label>
              <input className="input input-bordered w-full" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="form-control">
              <label className="label ml-1 mb-1"><span className="label-text">Last Name</span></label>
              <input className="input input-bordered w-full" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
            <div className="form-control">
              <label className="label ml-1 mb-1"><span className="label-text">Age</span></label>
              <input type="number" min={18} className="input input-bordered w-full" value={age} onChange={(e) => setAge(e.target.value)} placeholder="18+" />
            </div>
            <div className="form-control">
              <label className="label ml-1 mb-1"><span className="label-text">Gender</span></label>
              <select className="select select-bordered w-full" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select gender</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-control sm:col-span-2">
              <label className="label ml-1 mb-1"><span className="label-text">About</span></label>
              <textarea rows={3} className="textarea textarea-bordered w-full" value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Tell something about yourself" />
            </div>
            <div className="form-control sm:col-span-2">
              <label className="label ml-1 mb-1"><span className="label-text">Skills</span></label>
              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((s) => (
                  <div key={s} className="badge badge-outline gap-1">
                    {s}
                    <button type="button" className="ml-1 text-error" onClick={() => removeSkill(s)} aria-label={`Remove ${s}`}>×</button>
                  </div>
                ))}
                {skills.length === 0 && <span className="text-xs text-base-content/60">Add a skill and press Enter</span>}
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
                <button type="button" className="btn btn-outline join-item" onClick={addSkill}>Add</button>
              </div>
            </div>
            <div className="form-control sm:col-span-2">
              <label className="label ml-1 mb-1"><span className="label-text">Photo URL</span></label>
              <input type="url" className="input input-bordered w-full" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://example.com/photo.jpg" />
            </div>
            <div className="form-control sm:col-span-2">
              <label className="label ml-1 mb-1"><span className="label-text">Interested In</span></label>
              <select className="select select-bordered w-full" value={interestedIn} onChange={(e) => setInterestedIn(e.target.value)} required>
                <option value="">Select preference</option>
                {INTERESTED_IN.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {error && <div className="alert alert-error mt-3 py-2 text-sm"><span>{error}</span></div>}
          {saved && !error && <div className="alert alert-success mt-3 py-2 text-sm"><span>Profile updated</span></div>}

          <div className="card-actions mt-auto grid grid-cols-2 gap-3">
            <button className="btn btn-primary" type="submit" disabled={!canSave || saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                setFirstName(user?.firstName || "");
                setLastName(user?.lastName || "");
                setAge(user?.age ?? "");
                setGender(user?.gender || "");
                setAbout(user?.about || "");
                setSkills(Array.isArray(user?.skills) ? user.skills : []);
                setPhotoUrl(user?.photoUrl || "");
                setInterestedIn(user?.interestedIn || "");
                setSkillInput("");
                setError("");
                setSaved(false);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* Right: live preview */}
      <aside className="lg:col-span-5 card bg-base-100 shadow-xl w-full h-full min-h-[520px]">
        <div className="card-body flex flex-col h-full">
          <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6 items-start">
            <div className="relative w-40 h-40 md:w-44 md:h-44 rounded-xl overflow-hidden bg-base-300">
              {!imgLoaded && <div className="absolute inset-0 skeleton z-10" />}
              <img
                ref={imgRef}
                src={imgSrc}
                alt={`${firstName || "User"} ${lastName || ""}`}
                className="absolute inset-0 h-full w-full object-cover object-center z-0"
                onLoad={() => setImgLoaded(true)}
                onError={() => {
                  if (!triedFallback) {
                    setTriedFallback(true);
                    setImgSrc(FALLBACK_IMG);
                    setImgLoaded(false);
                  } else {
                    setImgLoaded(true);
                  }
                }}
                loading="eager"
              />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold">
                {firstName || "Unknown"} {lastName || ""}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-base-content/80">
                {age && !isNaN(Number(age)) && <span className="badge badge-outline">{age} yrs</span>}
                {gender && <span className="badge badge-neutral">{gender}</span>}
                {interestedIn && <span className="badge badge-primary badge-outline">Interested in {interestedIn}</span>}
              </div>
              {about && <p className="mt-1 text-base-content/80">{about}</p>}
              {user?.email && <p className="text-sm text-base-content/70">Email: {user.email}</p>}
            </div>
          </div>

          <div className="divider my-4">Skills</div>
          {Array.isArray(skills) && skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => <span key={s} className="badge">{s}</span>)}
            </div>
          ) : (
            <p className="text-sm text-base-content/70">No skills yet.</p>
          )}
        </div>
      </aside>
    </div>
  );
}