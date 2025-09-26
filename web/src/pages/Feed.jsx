import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import UserCard from "../components/UsersCard";
import ShimmerCard from "../components/ShimmerCard";
import { preloadImage } from "../utils/helpers";

const PAGE_LIMIT = 10;

const Feed = () => {
  const feed = useSelector((s) => s.feed);
  const dispatch = useDispatch();
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processing, setProcessing] = useState(null);

  const currentUser = feed[currentIndex];

  const fetchAllUsers = async (page = 1, existingData = []) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/feed`, {
        params: { 
          page: page,
          limit: PAGE_LIMIT 
        },
        withCredentials: true,
      });

      const data = res.data?.data || [];
      const hasMore = res.data?.hasMore || false;
      const allData = [...existingData, ...data];

      dispatch(addFeed(allData));

      if (hasMore && data.length > 0) {
        setTimeout(() => {
          fetchAllUsers(page + 1, allData);
        }, 100);
      }

    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load if no feed data
  useEffect(() => {
    if (feed.length === 0) {
      setIsLoading(true);
      fetchAllUsers(1, []);
    }
  }, []);

  // Preload next images
  useEffect(() => {
    const preloadNext = async () => {
      for (let i = 1; i <= 3; i++) {
        const nextUser = feed[currentIndex + i];
        if (nextUser?.photoUrl) {
          await preloadImage(nextUser.photoUrl);
        }
      }
    };
    
    if (feed.length > 0) {
      preloadNext();
    }
  }, [currentIndex, feed]);

  const handleAction = async (status) => {
    if (!currentUser?._id || processing) return;
    
    setProcessing(status);

    try {
      // Preload next image before transitioning
      const nextUser = feed[currentIndex + 1];
      if (nextUser?.photoUrl) {
        await preloadImage(nextUser.photoUrl);
        sessionStorage.setItem('currentUserImage', nextUser.photoUrl);
      }

      axios.post(
        `${API_BASE_URL}/request/send/${status}/${currentUser._id}`,
        {},
        { withCredentials: true }
      ).catch(err => console.error("Failed to send request:", err));

      if (currentIndex < feed.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
        setIsLoading(true);
        dispatch(addFeed([]));
        fetchAllUsers(1, []);
      }
      
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setTimeout(() => setProcessing(null), 300);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <ShimmerCard />
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <UserCard
        key={`${currentUser?._id}-${currentIndex}`}
        user={currentUser}
        eager={true}
        processing={processing}
        onIgnore={() => handleAction("ignored")}
        onInterested={() => handleAction("interested")}
      />
    </div>
  );
};

export default Feed;