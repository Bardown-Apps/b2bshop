import { useCallback, useEffect, useState } from "react";
import HttpService from "@/services/http";
import { COUNTRIES } from "@/constants/services";

const useCountries = ({ enabled = true } = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(enabled));
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled) return [];

    setIsLoading(true);
    setError(null);

    try {
      const response = await HttpService.post(COUNTRIES, {});
      const countries = Array.isArray(response?.data) ? response.data : [];
      setData(countries);
      return countries;
    } catch (err) {
      setData([]);
      setError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data,
    isLoading,
    isFetching: isLoading,
    error,
    refetch,
  };
};

export default useCountries;
