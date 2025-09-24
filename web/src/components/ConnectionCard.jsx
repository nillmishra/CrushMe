// src/components/ConnectionCard.jsx
import React, { useEffect, useRef, useState } from "react";

const FALLBACK =
  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

export default function ConnectionCard({ user, onView }) {
  const [imgSrc, setImgSrc] = useState(user.photoUrl || FALLBACK);
  const [loaded, setLoaded] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    setImgSrc(user.photoUrl || FALLBACK);
    setLoaded(false);
    setTriedFallback(!user.photoUrl);
  }, [user?.photoUrl]);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete && el.naturalWidth > 0) {
      setLoaded(true);
      return;
    }
    if (typeof el.decode === "function") {
      el.decode().then(() => setLoaded(true)).catch(() => {});
    }
  }, [imgSrc]);

  if (!user) return null;

  return (
    <div className="group card bg-base-100 shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border border-base-300 w-72 h-[440px] flex flex-col">
      <div className="relative h-72 w-full overflow-hidden flex-shrink-0">
        {!loaded && <div className="absolute inset-0 skeleton z-10" />}

        <img
          ref={imgRef}
          src={imgSrc}
          alt={`${user.firstName || "User"} ${user.lastName || ""}`}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (!triedFallback) {
              setTriedFallback(true);
              setImgSrc(FALLBACK);
              setLoaded(false);
            } else {
              setLoaded(true);
            }
          }}
          loading="lazy"
        />

        {loaded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        )}

        {loaded && (
          <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
            <h3 className="text-white text-xl font-semibold drop-shadow-lg">
              {user.firstName} {user.lastName}
            </h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {typeof user.age === "number" && (
                <span className="badge badge-sm bg-white/20 text-white border-0 backdrop-blur-sm">
                  {user.age} yrs
                </span>
              )}
              {user.gender && (
                <span className="badge badge-sm bg-white/20 text-white border-0 backdrop-blur-sm">
                  {user.gender}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="card-body p-3 flex-1 flex flex-col gap-2">
        <p className="text-sm text-base-content/80 line-clamp-2">
          {user.about || "No bio provided."}
        </p>

        {Array.isArray(user.skills) && user.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {user.skills.slice(0, 4).map((s, idx) => (
              <span key={`${s}-${idx}`} className="badge badge-outline badge-xs">
                {s}
              </span>
            ))}
            {user.skills.length > 4 && (
              <span className="badge badge-ghost badge-xs">
                +{user.skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        {onView && (
          <div className="card-actions mt-auto gap-2">
            <button className="btn btn-xs btn-primary flex-1">Message</button>
            <button
              type="button"
              className="btn btn-xs btn-secondary flex-1"
              onClick={() => onView(user)}
            >
              View Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}