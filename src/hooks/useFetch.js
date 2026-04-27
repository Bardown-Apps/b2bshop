import { useEffect, useState } from "react";
import HttpService from "@/services/http";

export const useFetch = (queryKey, url, options = {}) => {
  const { enabled = true } = options;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(enabled && url));
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (!enabled || !url) {
      setIsLoading(false);
      setIsFetching(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading((prev) => (data ? prev : true));
      setIsFetching(true);
      setError(null);

      try {
        const response = await HttpService.get(url);
        if (!cancelled) {
          setData(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsFetching(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, url, JSON.stringify(queryKey)]);

  return { data, isLoading, isFetching, error };
};
