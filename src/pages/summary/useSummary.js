import { useState } from "react";
import { useSelector } from "react-redux";
import usePost from "@/hooks/usePost";
import { ORDER } from "@/constants/services";

const useSummary = () => {
  const [order, setOrder] = useState();

  const { mutateAsync } = usePost();

  const getOrderFromStorage = (orderNumber) => {
    try {
      const saved = sessionStorage.getItem(`summary-order-${orderNumber}`);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  };

  const fetchOrderDetails = async (orderNumber) => {
    try {
      const { data } = await mutateAsync({
        url: ORDER,
        data: {
          orderNumber,
        },
      });

      if (Array.isArray(data) && data.length > 0) {
        setOrder(data[0]);
        return;
      }
      if (data && typeof data === "object") {
        setOrder(data);
        return;
      }
    } catch {
      // If API contract differs or request fails, use checkout snapshot fallback.
    }

    setOrder(getOrderFromStorage(orderNumber));
  };

  return { fetchOrderDetails, order };
};

export default useSummary;
