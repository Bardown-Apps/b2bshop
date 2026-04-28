import { useRef } from "react";
import ActionButtons from "./ActionButtons";
import ProductGrid from "./ProductGrid";

const ClubStore = () => {
  const productsRef = useRef(null);

  const handleNewOrderClick = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-8">
      <ActionButtons onNewOrderClick={handleNewOrderClick} />
      <div ref={productsRef}>
        <ProductGrid />
      </div>
    </div>
  );
};

export default ClubStore;
