import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestSlice";
import RequestCard from "../components/RequestCard";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((s) => s.requests); // array
  const userId = useSelector((s) => s.user.user?._id);

  const [loading, setLoading] = useState(false);
  // { [id]: 'accepted' | 'rejected' }
  const [processing, setProcessing] = useState({});

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
      const data = Array.isArray(res.data?.data) ? res.data.data : res.data;
      dispatch(addRequests(data || []));
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const reviewRequest = async (status, id) => {
    // prevent double submit per card
    if (processing[id]) return;

    setProcessing((p) => ({ ...p, [id]: status }));
    try {
      await axios.post(
        `${API_BASE_URL}/request/review/${status}/${id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequests(id));
    } catch (err) {
      console.error("Error reviewing request:", err);
      alert(err.response?.data?.message || "Failed to review request");
    } finally {
      setProcessing((p) => {
        const next = { ...p };
        delete next[id];
        return next;
      });
    }
  };

  const list = useMemo(() => requests, [requests]);

  if (loading && list.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <SkeletonGrid />
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">Received Requests</h1>
        <p className="text-base-content/70">No requests found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-bold">Received Requests</h1>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.map((req) => (
          <RequestCard
            key={req._id}
            req={req}
            acceptLoading={processing[req._id] === "accepted"}
            rejectLoading={processing[req._id] === "rejected"}
            // If you want the other button to stay clickable, set to false
            // disableOtherWhileLoading={false}
            onAccept={() => reviewRequest("accepted", req._id)}
            onReject={() => reviewRequest("rejected", req._id)}
          />
        ))}
      </div>
    </div>
  );
};

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="group card bg-base-100 shadow-md overflow-hidden border border-base-300"
        >
          <div className="relative h-48 w-full overflow-hidden">
            <div className="absolute inset-0 skeleton" />
          </div>
          <div className="card-body p-4 space-y-3">
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

export default Requests;