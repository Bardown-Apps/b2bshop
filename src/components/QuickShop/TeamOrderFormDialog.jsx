import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  TeamOrderFormHeader,
  TeamOrderFormBody,
  TeamOrderFormFooter,
} from "./TeamOrderForm";
import { SummarySheetModal } from "./TeamOrderForm/SummarySheetModal";

/**
 * Team Order Form dialog: fixed header (title), body (20% image + 80% form),
 * fixed footer. Opens from QuickShop "Order Form" button.
 */
/** Generate a simple unique id for teams/rows */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Create default teams with 5 rows each */
function createDefaultTeams() {
  return Array.from({ length: 5 }, (_, i) => ({
    id: generateId(),
    name: `Team ${i + 1}`,
    rows: Array.from({ length: 5 }, () => ({ id: generateId() })),
  }));
}

export function TeamOrderFormDialog({ open, onClose, product }) {
  const [clubName, setClubName] = useState(product?.name ?? "");
  const [teams, setTeams] = useState([]);
  const [summarySheetOpen, setSummarySheetOpen] = useState(false);

  useEffect(() => {
    if (open && product?.name) {
      setClubName(product.name);
      // Initialize with 5 default teams when dialog opens
      setTeams(createDefaultTeams());
    }
  }, [open, product?.name]);

  const resetForm = useCallback(() => {
    setClubName(product?.name ?? "");
    setTeams([]);
  }, [product?.name]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  if (!product) return null;

  const colorVariant = product?.variants?.find((v) => v?.variant === "Color");
  const colorOptions =
    colorVariant?.values?.map((v) => ({
      value: v?.value,
      label: v?.value,
    })) ?? [];
  const sizeVariant = product?.variants?.find((v) => v?.variant === "Size");
  const sizeOptions =
    sizeVariant?.values?.map((v) => ({
      value: v?.value,
      label: v?.value,
    })) ?? [];

  return (
    <>
      <Dialog open={open} onClose={handleClose} className="relative z-20">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150"
        />
        <DialogPanel
          transition
          className="fixed inset-4 flex flex-col overflow-hidden rounded-xl bg-white shadow-xl data-[closed]:opacity-0 data-[closed]:scale-95 data-[enter]:duration-200 data-[leave]:duration-150 sm:inset-8"
        >
          <TeamOrderFormHeader onClose={handleClose} />
          <TeamOrderFormBody
            product={product}
            clubName={clubName}
            onClubNameChange={setClubName}
            teams={teams}
            onTeamsChange={setTeams}
            onSummarySheetClick={() => setSummarySheetOpen(true)}
          />
          <TeamOrderFormFooter />
        </DialogPanel>
      </Dialog>
      <SummarySheetModal
        open={summarySheetOpen}
        onClose={() => setSummarySheetOpen(false)}
        teams={teams}
        colorOptions={colorOptions}
        sizeOptions={sizeOptions}
        productName={product?.name || ""}
        clubName={clubName}
        customFields={product?.customFields ?? []}
      />
    </>
  );
}
