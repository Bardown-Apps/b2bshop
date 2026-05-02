const Invoice = ({ order }) => {
  if (!order) return null;
  const lineItems = Array.isArray(order?.orderedItems)
    ? order.orderedItems
    : [];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">Items</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-slate-700"></th>
              <th className="px-3 py-2 text-left font-semibold text-slate-700">
                Product
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-700">
                Variant
              </th>
              <th className="px-3 py-2 text-right font-semibold text-slate-700">
                Qty
              </th>
              <th className="px-3 py-2 text-right font-semibold text-slate-700">
                Unit Price
              </th>
              <th className="px-3 py-2 text-right font-semibold text-slate-700">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {lineItems.map((item, index) => {
              const quantity = Number(item?.orderedCombination?.qty || 0);
              const unitPrice = Number(
                item?.orderedCombination?.unitPrice || 0,
              );
              const subtotal = quantity * unitPrice;
              const imageUrl =
                item?.defaultImageUrl ||
                item?.image ||
                item?.orderedCombination?.image ||
                "";

              return (
                <tr key={`${item?._id || item?.id || "item"}-${index}`}>
                  <td className="px-3 py-2">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item?.name || "Product image"}
                        className="h-12 w-12 rounded-md border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md border border-dashed border-slate-300 text-[10px] text-slate-400">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-slate-900">
                    {item?.name || "-"}
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    {item?.orderedCombination?.name || "-"}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-700">
                    {quantity || "-"}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-700">
                    ${unitPrice.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-slate-900">
                    ${subtotal.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!lineItems.length ? (
          <div className="p-4 text-sm text-slate-500">No line items found.</div>
        ) : null}
      </div>
    </div>
  );
};

export default Invoice;
