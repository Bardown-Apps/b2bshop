import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import HttpService from "@/services/http";
import { PRODUCTS } from "@/constants/services";

const normalizeProductResponse = (response, prodId) => {
  const payload = response?.data;
  const data = payload?.data;

  if (Array.isArray(data)) {
    return data.find((item) => String(item?.prodId) === String(prodId)) || null;
  }

  if (data && typeof data === "object") {
    if (String(data?.prodId) === String(prodId)) {
      return data;
    }

    if (Array.isArray(data?.products)) {
      return (
        data.products.find((item) => String(item?.prodId) === String(prodId)) ||
        null
      );
    }
  }

  if (Array.isArray(payload)) {
    return (
      payload.find((item) => String(item?.prodId) === String(prodId)) || null
    );
  }

  return null;
};

const useProduct = () => {
  const { prodId } = useParams();
  const requestIdRef = useRef(0);
  const authUser = useSelector((state) => state.auth.user);
  const adminId = useMemo(
    () => authUser?.adminId || authUser?._id || authUser?.id,
    [authUser],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!prodId) {
      setProduct(null);
      setError("Invalid product id");
      setLoading(false);
      return;
    }

    const currentRequestId = requestIdRef.current + 1;
    requestIdRef.current = currentRequestId;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const payload = {
          prodId,
          ...(adminId ? { adminId } : {}),
        };
        const response = await HttpService.post(PRODUCTS, payload);
        const selectedProduct = normalizeProductResponse(response, prodId);

        if (requestIdRef.current === currentRequestId) {
          if (selectedProduct) {
            setProduct(selectedProduct);
          } else {
            setProduct(null);
            setError("Product not found");
          }
        }
      } catch (err) {
        if (requestIdRef.current === currentRequestId) {
          setProduct(null);
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to fetch product",
          );
        }
      } finally {
        if (requestIdRef.current === currentRequestId) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      if (requestIdRef.current === currentRequestId) {
        setLoading(false);
      }
    };
  }, [prodId, adminId]);

  return {
    prodId,
    product,
    setProduct,
    loading,
    error,
  };
};

export default useProduct;
