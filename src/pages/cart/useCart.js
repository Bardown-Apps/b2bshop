import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import usePost from "@/hooks/usePost";
import { CART } from "@/constants/services";
import { Checkout } from "@/constants/routes";
import { setCartItemsCount } from "@/features/cart/cartSlice";

const useCart = () => {
  const [loading, setLoading] = useState(false);
  const { mutateAsync } = usePost();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({
    mode: "all",
  });

  const onSubmit = () => {
    navigate(Checkout.path);
  };

  const addToCart = async (payload) => {
    setLoading(true);

    const { data } = await mutateAsync({
      url: CART,
      data: {
        ...payload,
      },
      isPut: true,
    });

    setLoading(false);

    await fetchCartData();

    return data;
  };

  const updateCart = async (payload) => {
    const { data } = await mutateAsync({
      url: CART,
      data: {
        ...payload,
      },
      isPatch: true,
    });

    return data;
  };

  const fetchCartData = async () => {
    const { data } = await mutateAsync({
      url: CART,
      data: {},
    });

    dispatch(setCartItemsCount({ count: data?.length }));

    return data;
  };

  const deleteProductFromCart = async (payload) => {
    await mutateAsync({
      url: CART,
      data: {
        ...payload,
      },
      isDelete: true,
    });

    await fetchCartData();
  };

  return {
    addToCart,
    loading,
    control,
    handleSubmit,
    onSubmit,
    fetchCartData,
    setValue,
    isValid,
    deleteProductFromCart,
    watch,
    updateCart,
  };
};

export default useCart;
