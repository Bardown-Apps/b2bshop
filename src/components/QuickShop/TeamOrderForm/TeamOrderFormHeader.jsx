import { XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Fixed header for Team Order Form dialog.
 * Title: "Team Order Form", close button on the right.
 */
export function TeamOrderFormHeader({ onClose }) {
  return (
    <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      <h2 className="text-lg font-semibold text-gray-900">Team Order Form</h2>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        aria-label="Close"
      >
        <XMarkIcon className="size-5" />
      </button>
    </div>
  );
}
