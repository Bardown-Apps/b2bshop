import { DocumentTextIcon } from "@heroicons/react/24/outline";

function getImageUrl(product) {
  return (
    product?.defaultImageUrl ||
    product?.mediaFiles?.[0]?.imageUrl ||
    product?.variantCombinationImage
  );
}

/**
 * Left 20% section: displays product image(s) and Summary Sheet button.
 */
export function ProductImageSection({
  product,
  selectedProducts = [],
  onSummarySheetClick,
}) {
  const imageUrl = getImageUrl(product);
  const thumbnailProducts = (selectedProducts || []).filter(Boolean);

  return (
    <div className="flex w-[20%] shrink-0 flex-col border-r border-gray-200 bg-gray-50 p-3">
      {onSummarySheetClick && (
        <button
          type="button"
          onClick={onSummarySheetClick}
          className="my-3 flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <DocumentTextIcon className="size-4" />
          Summary Sheet
        </button>
      )}

      {thumbnailProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 overflow-y-auto">
          {thumbnailProducts.map((item, idx) => {
            const thumbUrl = getImageUrl(item);
            return (
              <div
                key={item?.prodId ?? item?.id ?? item?.name ?? idx}
                className="space-y-1"
              >
                {thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt={item?.name || "Product"}
                    className="aspect-square w-full rounded-lg object-cover object-center"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
                    No image
                  </div>
                )}
                {item?.name && (
                  <p className="truncate text-center text-[11px] text-gray-600">
                    {item.name}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : imageUrl ? (
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
      {product?.name && thumbnailProducts.length === 0 && (
        <p className="mt-2 truncate text-center text-xs text-gray-600">
          {product.name}
        </p>
      )}
    </div>
  );
}
