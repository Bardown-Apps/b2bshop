import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpService from "@/services/http";
import { CLUBS } from "@/constants/services";
import { logout } from "@/store/slices/authSlice";

const initialState = {
  list: [],
  status: "idle",
  error: null,
  fetchedForToken: null,
};

export const fetchClubs = createAsyncThunk(
  "clubs/fetchClubs",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await HttpService.post(CLUBS, {});
      const payload = response?.data;
      const clubs = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];

      return {
        clubs,
        token: getState()?.auth?.token || null,
      };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to fetch clubs";
      return rejectWithValue(message);
    }
  },
);

const clubsSlice = createSlice({
  name: "clubs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClubs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchClubs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.clubs;
        state.fetchedForToken = action.payload.token;
      })
      .addCase(fetchClubs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(logout, () => initialState);
  },
});

export default clubsSlice.reducer;
