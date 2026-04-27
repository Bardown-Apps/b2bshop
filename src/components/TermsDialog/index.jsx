import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

const TermsDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Terms & Conditions
          </DialogTitle>
          <p className="mt-3 text-sm text-slate-600">
            Please review your organization terms and conditions before placing your order.
          </p>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default TermsDialog;
