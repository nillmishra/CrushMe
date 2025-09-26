import React from "react";
import { useSelector } from "react-redux";
import ProfileEdit from "../components/ProfileEdit";
import ShimmerCard from "../components/ShimmerCard";

const Profile = () => {
  const user = useSelector((s) => s.user.user);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <ShimmerCard />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <ProfileEdit user={user} />
    </div>
  );
};

export default Profile;