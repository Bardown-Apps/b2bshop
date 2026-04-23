import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pendingRequests: 0,
};

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    requestStarted: (state) => {
      state.pendingRequests += 1;
    },
    requestFinished: (state) => {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1);
    },
    resetRequests: (state) => {
      state.pendingRequests = 0;
    },
  },
});

export const { requestStarted, requestFinished, resetRequests } =
  networkSlice.actions;
export default networkSlice.reducer;
