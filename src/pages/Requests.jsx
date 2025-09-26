import axios from "axios";
import React, { useState, useMemo } from "react";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { removeRequests } from "../utils/requestSlice";
import RequestCard from "../components/RequestCard";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((s) => s.requests);
  const [processing, setProcessing] = useState({});

  const reviewRequest = async (status, id) => {
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
            onAccept={() => reviewRequest("accepted", req._id)}
            onReject={() => reviewRequest("rejected", req._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Requests;