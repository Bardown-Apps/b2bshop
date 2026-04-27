import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    set: (_state, action) => {
      const payload = action.payload;
      if (!payload || typeof payload !== "object") {
        return {};
      }
      return { ...payload };
    },
    clear: () => {
      return {};
    },
  },
});

export const { set, clear } = shopSlice.actions;
export default shopSlice.reducer;
