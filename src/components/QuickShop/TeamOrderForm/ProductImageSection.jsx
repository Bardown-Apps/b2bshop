import { DocumentTextIcon } from "@heroicons/react/24/outline";

/**
 * Left 20% section: displays product image and Summary Sheet button.
 * Uses product.defaultImageUrl, mediaFiles[0], or variantCombinationImage.
 */
export function ProductImageSection({ product, onSummarySheetClick }) {
  const imageUrl =
    product?.defaultImageUrl ||
    product?.mediaFiles?.[0]?.imageUrl ||
    product?.variantCombinationImage;

  return (
    <div className="flex w-[20%] shrink-0 flex-col border-r border-gray-200 bg-gray-50 p-3">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product?.name || "Product"}
          className="aspect-square w-full rounded-lg object-cover object-center"
        />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500">
          No image
        </div>
      )}
      {product?.name && (
        <p className="mt-2 truncate text-center text-xs text-gray-600">
          {product.name}
        </p>
      )}
      {onSummarySheetClick && (
        <button
          type="button"
          onClick={onSummarySheetClick}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <DocumentTextIcon className="size-4" />
          Summary Sheet
        </button>
      )}
    </div>
  );
}
