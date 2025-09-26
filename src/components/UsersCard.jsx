// UserCard.jsx
import React, { useEffect, useRef, useState } from "react";

export default function UserCard({
  user,
  processing = null,
  onIgnore,
  onInterested,
}) {
  const fallback =
    "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";

  const [imgSrc, setImgSrc] = useState(user?.photoUrl || fallback);
  const [loaded, setLoaded] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const imgRef = useRef(null);

  // Store current image in sessionStorage to persist across refreshes
  useEffect(() => {
    if (user?.photoUrl) {
      sessionStorage.setItem('currentUserImage', user.photoUrl);
    }
  }, [user?.photoUrl]);

  // Initialize image source on mount, prioritizing the cached image
  useEffect(() => {
    // Try to get the last shown image from session storage
    const cachedImage = sessionStorage.getItem('currentUserImage');
    
    if (initialLoad && cachedImage) {
      // Start with cached image if available
      setImgSrc(cachedImage);
      // Preload the actual image in background
      const preloader = new Image();
      preloader.src = user?.photoUrl || fallback;
      
      // Once real image is loaded, switch to it
      if (user?.photoUrl !== cachedImage) {
        preloader.onload = () => {
          setImgSrc(user.photoUrl);
        };
      }
      
      // Only do this logic once
      setInitialLoad(false);
    } else {
      // Standard image update on user change
      setImgSrc(user?.photoUrl || fallback);
    }
    
    // Check if image is already cached in browser
    const img = new Image();
    img.src = user?.photoUrl || fallback;
    if (img.complete) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [user?.photoUrl, initialLoad]);

  // Handle already loaded images on mount
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, []);

  if (!user) return null;

  const isIgnoring = processing === "ignored";
  const isInterested = processing === "interested";
  const isProcessing = processing !== null;

  return (
    <div 
      className="relative w-[420px] h-[72vh] rounded-2xl overflow-hidden shadow-2xl bg-base-300 mt-2"
      aria-busy={!loaded}
      aria-label="User card"
    >
      {/* Only show skeleton when image isn't loaded AND we don't have a previous image */}
      {!loaded && !sessionStorage.getItem('currentUserImage') && 
        <div className="absolute inset-0 skeleton z-30" />
      }

      <img
        ref={imgRef}
        src={imgSrc}
        alt={user.firstName || "User"}
        className={`absolute inset-0 h-full w-full object-cover object-center z-10 ${loaded ? 'opacity-100' : 'opacity-80'}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setImgSrc(fallback);
          setLoaded(true); // Show fallback immediately
        }}
        loading="eager" // Always eager for current card
        fetchPriority="high"
        decoding="async"
      />

      {/* Always render UI elements, even during loading */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20" />

      <div className="absolute inset-x-0 bottom-0 z-30 p-6 space-y-3">
        <div>
          <h3 className="text-white text-3xl font-semibold drop-shadow">
            {user.firstName || "Unknown"}
            {user.age ? (
              <span className="text-white/80 text-2xl">, {user.age}</span>
            ) : null}
          </h3>
          {user.about ? (
            <p className="mt-1 text-white/80 drop-shadow">{user.about}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="btn btn-outline outline-white btn-sm text-white"
            onClick={() => onIgnore?.(user)}
            disabled={isProcessing}
          >
            {isIgnoring && (
              <span className="loading loading-spinner loading-xs mr-1" />
            )}
            Ignore
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onInterested?.(user)}
            disabled={isProcessing}
          >
            {isInterested && (
              <span className="loading loading-spinner loading-xs mr-1" />
            )}
            Interested
          </button>
        </div>
      </div>
    </div>
  );
}