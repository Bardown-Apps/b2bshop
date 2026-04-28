export function DiffList({ changed = {}, added = {}, removed = {} }) {
  const hasChanges =
    Object.keys(changed).length ||
    Object.keys(added).length ||
    Object.keys(removed).length;

  if (!hasChanges) return null;

  return (
    <div className="mt-2 space-y-2">
      {Object.keys(changed).length > 0 && (
        <div>
          <div className="mb-1 text-xs font-medium text-amber-700">Changed</div>
          <ul className="space-y-1">
            {Object.entries(changed).map(([key, val]) => (
              <li key={key} className="text-xs text-gray-700">
                <span className="font-medium text-gray-900">{key}:</span>{" "}
                <span className="rounded bg-rose-50 px-1.5 py-0.5 text-rose-700 ring-1 ring-rose-100">
                  {String(val.from)}
                </span>{" "}
                <span className="mx-1 text-gray-400">→</span>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700 ring-1 ring-emerald-100">
                  {String(val.to)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {Object.keys(added).length > 0 && (
        <div>
          <div className="mb-1 text-xs font-medium text-emerald-700">Added</div>
          <ul className="space-y-1">
            {Object.entries(added).map(([key, val]) => (
              <li key={key} className="text-xs text-gray-700">
                <span className="font-medium text-gray-900">{key}:</span>{" "}
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700 ring-1 ring-emerald-100">
                  {typeof val === "object" ? JSON.stringify(val) : String(val)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {Object.keys(removed).length > 0 && (
        <div>
          <div className="mb-1 text-xs font-medium text-rose-700">Removed</div>
          <ul className="space-y-1">
            {Object.entries(removed).map(([key, val]) => (
              <li key={key} className="text-xs text-gray-700">
                <span className="font-medium text-gray-900">{key}:</span>{" "}
                <span className="rounded bg-rose-50 px-1.5 py-0.5 text-rose-700 line-through ring-1 ring-rose-100">
                  {typeof val === "object" ? JSON.stringify(val) : String(val)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
