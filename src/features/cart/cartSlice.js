import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itemsCount: 0,
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItemsCount: (state, action) => {
      state.itemsCount = action.payload.count;
    },
    setItems: (state, action) => {
      state.items = [...action.payload.items];
    },
    clear: (state) => {
      state.itemsCount = initialState.itemsCount;
      state.items = initialState.items;
    },
  },
});

export const { setCartItemsCount, setItems, clear } = cartSlice.actions;

export default cartSlice.reducer;
