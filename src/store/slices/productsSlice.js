import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpService from "@/services/http";
import { PRODUCTS } from "@/constants/services";
import { logout } from "@/store/slices/authSlice";

const initialState = {
  list: [],
  status: "idle",
  error: null,
  fetchedForToken: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const authState = getState()?.auth;
      const adminId =
        authState?.user?.adminId || authState?.user?._id || authState?.user?.id;
      const response = await HttpService.post(PRODUCTS, { adminId });
      const payload = response?.data;
      const products = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];

      return {
        products,
        token: getState()?.auth?.token || null,
      };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to fetch products";
      return rejectWithValue(message);
    }
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.products;
        state.fetchedForToken = action.payload.token;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(logout, () => initialState);
  },
});

export default productsSlice.reducer;
