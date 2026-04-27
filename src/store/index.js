import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "@/store/storage";
import authReducer from "@/store/slices/authSlice";
import clubsReducer from "@/store/slices/clubsSlice";
import categoriesReducer from "@/store/slices/categoriesSlice";
import productsReducer from "@/store/slices/productsSlice";
import networkReducer from "@/store/slices/networkSlice";
import shopReducer from "@/store/slices/shopSlice";
import cartReducer from "@/features/cart/cartSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "shop", "cart", "clubs", "categories", "products"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  clubs: clubsReducer,
  categories: categoriesReducer,
  products: productsReducer,
  shop: shopReducer,
  cart: cartReducer,
  network: networkReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
