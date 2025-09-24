import React, { useEffect, useMemo, useRef, useState } from "react";

const FALLBACK = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

export default function ProfileDetailsCard({ user }) {
  

  const [imgSrc, setImgSrc] = useState(user.photoUrl || FALLBACK);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    setImgSrc(user.photoUrl || FALLBACK);
    setImgLoaded(false);
    setTriedFallback(false);
  }, [user?.photoUrl]);

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

  const details = useMemo(() => {
    const out = [];
    if (user.about) out.push({ label: "About", value: user.about });
    if (user.email) out.push({ label: "Email", value: user.email });
    if (typeof user.age === "number") out.push({ label: "Age", value: `${user.age}` });
    if (user.gender) out.push({ label: "Gender", value: user.gender });
    if (user.city) out.push({ label: "City", value: user.city });
    if (user.location) out.push({ label: "Location", value: user.location });
    if (user.interestedIn) out.push({ label: "Interested In", value: user.interestedIn });
    if (Array.isArray(user.skills) && user.skills.length > 0) {
      out.push({ label: "Skills", value: user.skills });
    }
    return out;
  }, [user]);

  if (!user) return null;

  return (
    <div className="card bg-base-100 shadow-xl w-full h-full">
      <div className="card-body flex flex-col h-full">
        {/* Header: image left, name/age/gender right */}
        <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6 items-start">
          <div className="relative w-40 h-40 md:w-44 md:h-44 rounded-xl overflow-hidden bg-base-300">
            {!imgLoaded && <div className="absolute inset-0 skeleton z-10" />}
            <img
              ref={imgRef}
              src={imgSrc}
              alt={`${user.firstName || "User"} ${user.lastName || ""}`}
              className="absolute inset-0 h-full w-full object-cover object-center z-0"
              onLoad={() => setImgLoaded(true)}
              onError={() => {
                if (!triedFallback) {
                  setTriedFallback(true);
                  setImgSrc(FALLBACK);
                  setImgLoaded(false);
                } else {
                  setImgLoaded(true);
                }
              }}
              loading="eager"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">
                  {user.firstName || "Unknown"} {user.lastName || ""}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-base-content/80">
                  {typeof user.age === "number" && (
                    <span className="badge badge-outline">{user.age} yrs</span>
                  )}
                  {user.gender && <span className="badge badge-neutral">{user.gender}</span>}
                  {user.interestedIn && (
                    <span className="badge badge-primary badge-outline">
                      Interested in {user.interestedIn}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {user.about && <p className="mt-1 text-base-content/80">{user.about}</p>}
          </div>
        </div>

        <div className="divider my-4">Details</div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {details
            .filter((d) => d.label !== "Skills")
            .map(({ label, value }) => (
              <div key={label} className="space-y-1">
                <dt className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                  {label}
                </dt>
                <dd className="text-sm text-base-content/90 break-words">
                  {Array.isArray(value) ? value.join(", ") : value}
                </dd>
              </div>
            ))}
        </dl>

        {Array.isArray(user.skills) && user.skills.length > 0 && (
          <>
            <div className="divider my-4">Skills</div>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((s) => (
                <span key={s} className="badge">
                  {s}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}