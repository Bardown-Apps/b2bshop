import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HttpService from "@/services/http";
import { USER_CREDIT_AMOUNT } from "@/constants/services";

const useUserCreditAmount = () => {
  const email = useSelector((s) => s?.auth?.user?.email);

  const [data, setData] = useState(0);

  const refetch = useCallback(async () => {
    const response = await HttpService.post(USER_CREDIT_AMOUNT);
    const amount = Number(response?.data?.creditAmount || response?.data || 0);
    setData(Number.isNaN(amount) ? 0 : amount);
    return response?.data;
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, refetch };
};

export default useUserCreditAmount;
