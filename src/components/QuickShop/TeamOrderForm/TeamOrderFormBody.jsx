import { ProductImageSection } from "./ProductImageSection";
import { FormSection } from "./FormSection";

/**
 * Body: 20% product image (fixed left), 80% form (scrollable).
 * Header and footer are rendered by the dialog; this is body only.
 */
export function TeamOrderFormBody({
  product,
  clubName,
  onClubNameChange,
  teams,
  onTeamsChange,
  onSummarySheetClick,
}) {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <ProductImageSection product={product} onSummarySheetClick={onSummarySheetClick} />
      <FormSection
        product={product}
        clubName={clubName}
        onClubNameChange={onClubNameChange}
        teams={teams}
        onTeamsChange={onTeamsChange}
      />
    </div>
  );
}
