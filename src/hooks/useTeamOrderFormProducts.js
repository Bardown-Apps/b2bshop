import { useCallback, useEffect, useRef, useState } from "react";
import usePost from "@/hooks/usePost";
import { PRODUCTS } from "@/constants/services";

const MIN_LOADER_MS = 250;

export default function useTeamOrderFormProducts({
  open,
  clubId,
  take = 100,
  skip = 0,
}) {
  const { mutateAsync } = usePost();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchedKeyRef = useRef(null);

  const fetchProducts = useCallback(async (force = false) => {
    if (!(open && clubId)) {
      setProducts((prev) => (prev.length > 0 ? [] : prev));
      if (fetchedKeyRef.current !== null) {
        fetchedKeyRef.current = null;
      }
      if (isLoading) setIsLoading(false);
      return [];
    }

    const requestKey = `${clubId}:${take}:${skip}`;
    if (!force && fetchedKeyRef.current === requestKey) {
      return [];
    }

    fetchedKeyRef.current = requestKey;
    setIsLoading(true);
    const startedAt = Date.now();
    try {
      const result = await mutateAsync({
        url: PRODUCTS,
        data: { take, skip, clubId },
      });
      const list = Array.isArray(result?.data)
        ? result.data
        : (result?.data?.data ?? result?.data?.items ?? []);
      const normalized = Array.isArray(list) ? list : [];
      setProducts(normalized);
      return normalized;
    } catch {
      fetchedKeyRef.current = null;
      setProducts([]);
      return [];
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_LOADER_MS) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_LOADER_MS - elapsed),
        );
      }
      setIsLoading(false);
    }
  }, [open, clubId, take, skip, mutateAsync, isLoading]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    refetch: () => fetchProducts(true),
  };
}
