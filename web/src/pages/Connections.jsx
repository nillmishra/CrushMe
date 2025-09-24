import axios from "axios";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import ConnectionCard from "../components/ConnectionCard";
import ProfileDetailsCard from "../components/ProfileDetailsCard";

const GENDERS = ["All", "Male", "Female", "Other"];

const Connections = () => {
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.user.user?._id);
  const connections = useSelector((s) => s.connections);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");

  const [selected, setSelected] = useState(null);

  const closeModal = useCallback(() => setSelected(null), []);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeModal();
    if (selected) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, closeModal]);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const fetchConnections = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_BASE_URL}/user/connections`, {
          withCredentials: true,
        });
        const data = Array.isArray(res.data?.data) ? res.data.data : res.data;
        if (!cancelled) dispatch(addConnections(data || []));
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching connections:", err);
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to fetch connections"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchConnections();
    return () => {
      cancelled = true;
    };
  }, [userId, dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (connections || []).filter((u) => {
      const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      const matchesName = !q || name.includes(q);
      const matchesGender =
        genderFilter === "All" ||
        (u.gender || "").toLowerCase() === genderFilter.toLowerCase();
      return matchesName && matchesGender;
    });
  }, [connections, query, genderFilter]);

  return (
    <div className="px-4">
      <Header
        query={query}
        setQuery={setQuery}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
      />

      {loading && (!connections || connections.length === 0) ? (
        <SkeletonGrid />
      ) : error && (!connections || connections.length === 0) ? (
        <div className="alert alert-error mt-6">{error}</div>
      ) : !connections || connections.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <div className="mt-6 text-base-content/70">
          No connections match your filters.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((conn) => (
            <ConnectionCard
              key={conn._id || `${conn.firstName}-${conn.photoUrl}`}
              user={conn}
              onView={setSelected}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {selected ? (
        <ProfileModal user={selected} onClose={closeModal} />
      ) : null}
    </div>
  );
};

function Header({ query, setQuery, genderFilter, setGenderFilter }) {
  return (
    <div className="mx-auto max-w-7xl pt-2">
      <h1 className="text-2xl font-bold">Your Connections</h1>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="join w-full sm:w-auto">
          <input
            type="text"
            className="input input-bordered join-item w-full sm:w-80"
            placeholder="Search by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="select select-bordered join-item"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="mx-auto max-w-7xl mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card bg-base-100 shadow-md overflow-hidden">
          <div className="h-48 skeleton" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-3 w-3/4" />
            <div className="flex gap-2">
              <div className="skeleton h-5 w-16" />
              <div className="skeleton h-5 w-10" />
              <div className="skeleton h-5 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-7xl mt-10 flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-2xl bg-base-300 flex items-center justify-center">
        <span className="text-3xl">🙂</span>
      </div>
      <h2 className="mt-4 text-xl font-semibold">No connections yet</h2>
      <p className="mt-1 text-base-content/70">
        Start exploring and connect with people. Your connections will appear here.
      </p>
    </div>
  );
}

function ProfileModal({ user, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl bg-base-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-4 pt-4">
          <h3 className="text-lg font-semibold">Profile</h3>
          <button className="btn btn-sm btn-ghost" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="p-4">
          <ProfileDetailsCard user={user} />
        </div>
      </div>
    </div>
  );
}

export default Connections;