import { useCallback, useEffect, useState } from "react";
import HttpService from "@/services/http";
import { RULES } from "@/constants/services";

const useRules = ({ enabled = true } = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(enabled));
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled) return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await HttpService.post(RULES, {});
      const rules = response?.data || null;
      setData(rules);
      return rules;
    } catch (err) {
      setData(null);
      setError(err);
      return null;
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

export default useRules;
