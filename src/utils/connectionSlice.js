// src/utils/connectionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connections",
  initialState: [],
  reducers: {
    addConnections: (state, action) => {
      return Array.isArray(action.payload) ? action.payload : [];
    },
    clearConnections: () => {
      return [];
    },
  },
});

export const { addConnections, clearConnections } = connectionSlice.actions;
export default connectionSlice.reducer;