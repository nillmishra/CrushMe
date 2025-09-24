// src/utils/requestSlice.js
import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: [],
  reducers: {
    addRequests: (state, action) => {
      return Array.isArray(action.payload) ? action.payload : [];
    },
    removeRequests: (state, action) => {
      const id = action.payload;
      return state.filter((r) => r._id !== id);
    },
    clearRequests: () => {
      return [];
    },
  },
});

export const { addRequests, removeRequests, clearRequests } = requestSlice.actions;
export default requestSlice.reducer;