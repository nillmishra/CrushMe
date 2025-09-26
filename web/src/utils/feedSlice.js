import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [],
  reducers: {
    addFeed: (state, action) => {
      // replace with whatever array we pass in
      return Array.isArray(action.payload) ? action.payload : [];
    },
    removeFeed: () => {
      return [];
    },
    removeUserFeed: (state, action) => {
      const id = action.payload;
      return state.filter((u) => (u._id || u.id) !== id);
    },
  },
});

export const { addFeed, removeFeed, removeUserFeed } = feedSlice.actions;
export default feedSlice.reducer;