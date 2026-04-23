import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpService from "@/services/http";
import { CATEGORIES } from "@/constants/services";
import { logout } from "@/store/slices/authSlice";

const initialState = {
  list: [],
  status: "idle",
  error: null,
  fetchedForToken: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await HttpService.post(CATEGORIES, {});
      const payload = response?.data;
      const categories = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];

      return {
        categories,
        token: getState()?.auth?.token || null,
      };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to fetch categories";
      return rejectWithValue(message);
    }
  },
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.categories;
        state.fetchedForToken = action.payload.token;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(logout, () => initialState);
  },
});

export default categoriesSlice.reducer;
