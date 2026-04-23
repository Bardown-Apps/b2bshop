import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store/hooks";
import { fetchClubs } from "@/store/slices/clubsSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { fetchProducts } from "@/store/slices/productsSlice";

const AUTH_BOOTSTRAP_ACTIONS = [
  { key: "clubs", action: fetchClubs },
  { key: "categories", action: fetchCategories },
  { key: "products", action: fetchProducts },
];

export default function useAuthBootstrapCalls() {
  const dispatch = useAppDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const requestedByTokenRef = useRef(new Map());

  useEffect(() => {
    if (!authToken) return;

    const requestedKeys = requestedByTokenRef.current.get(authToken) ?? new Set();
    AUTH_BOOTSTRAP_ACTIONS.forEach(({ key, action }) => {
      if (requestedKeys.has(key)) return;
      requestedKeys.add(key);
      dispatch(action());
    });
    requestedByTokenRef.current.set(authToken, requestedKeys);
  }, [authToken, dispatch]);
}
