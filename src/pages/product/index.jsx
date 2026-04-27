import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import useProduct from "./useProduct";
import QuickShop from "@/components/QuickShop";

const Product = () => {
  const { product, setProduct, error } = useProduct();

  useEffect(() => {
    document.title = product?.name || "Loading...";
  }, [product]);

  if (error || !product) {
    return null;
  }

  return <QuickShop product={product} setProduct={setProduct} />;
};

export default Product;
