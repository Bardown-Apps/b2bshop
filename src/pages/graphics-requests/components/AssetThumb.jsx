import { DocumentTextIcon, ArrowTopRightOnSquareIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { isImageAsset, bytesToSize, handleDownload } from "../utils";

export function AssetThumb({ asset }) {
  const name = asset?.original_filename || asset?.public_id || "asset";
  const date = asset?.created_at?.split?.("T")?.[0] || "";
  const size = bytesToSize(asset?.bytes);
  const thumbSrc =
    asset?.thumbnail ||
    (isImageAsset(asset) ? asset?.url || asset?.secure_url : null);

  return (
    <div className="group overflow-hidden rounded-lg border bg-white">
      <div className="flex items-center justify-between px-2 pt-1">
        <div className="truncate text-[10px] text-gray-500">{date}</div>
        {size && <div className="text-[10px] text-gray-400">{size}</div>}
      </div>

      {thumbSrc ? (
        <a
          href={asset?.url || asset?.secure_url || "#"}
          target="_blank"
          rel="noreferrer"
          className="block"
          title={name}
        >
          <img
            src={thumbSrc}
            alt={name}
            className="aspect-square w-full object-cover transition group-hover:opacity-90"
          />
        </a>
      ) : (
        <div className="flex aspect-square items-center justify-center">
          <DocumentTextIcon className="h-10 w-10 text-gray-400" />
        </div>
      )}

      <div className="flex items-center justify-between gap-2 px-2 pb-2">
        <div className="truncate text-[10px] text-gray-600" title={name}>
          {name}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <a
            href={asset?.url || asset?.secure_url || "#"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-md border px-2 py-1 text-[10px] text-gray-700 hover:bg-gray-50"
            title="Open"
          >
            <ArrowTopRightOnSquareIcon className="mr-1 h-3.5 w-3.5" />
            Open
          </a>
          <button
            type="button"
            onClick={() => handleDownload(asset)}
            className="inline-flex items-center rounded-md border px-2 py-1 text-[10px] text-gray-700 hover:bg-gray-50"
            title="Download"
          >
            <ArrowDownTrayIcon className="mr-1 h-3.5 w-3.5" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export function AssetSection({ title, assets }) {
  if (!Array.isArray(assets) || assets.length === 0) return null;
  return (
    <div className="mt-2">
      <div className="mb-1 text-xs font-medium text-gray-700">{title}</div>
      <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
        {assets.map((a, i) => (
          <AssetThumb key={a.public_id || a.url || i} asset={a} />
        ))}
      </div>
    </div>
  );
}
