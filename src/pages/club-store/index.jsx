import { useRef, useState } from "react";
import ActionButtons from "./ActionButtons";
import ProductGrid from "./ProductGrid";
import { TeamOrderFormStepperDialog } from "@/components/QuickShop/TeamOrderFormStepperDialog";

const ClubStore = () => {
  const productsRef = useRef(null);
  const [teamOrderStepperOpen, setTeamOrderStepperOpen] = useState(false);

  const handleNewOrderClick = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleOrderFormClick = () => {
    setTeamOrderStepperOpen(true);
  };

  return (
    <div className="space-y-8">
      <ActionButtons
        onNewOrderClick={handleNewOrderClick}
        onOrderFormClick={handleOrderFormClick}
      />
      <div ref={productsRef}>
        <ProductGrid />
      </div>
      <TeamOrderFormStepperDialog
        open={teamOrderStepperOpen}
        onClose={() => setTeamOrderStepperOpen(false)}
      />
    </div>
  );
};

export default ClubStore;
