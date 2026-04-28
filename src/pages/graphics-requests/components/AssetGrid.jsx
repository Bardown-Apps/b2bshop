function isImageFormat(fmt) {
  return /^(png|jpe?g|webp|gif|svg)$/i.test(String(fmt || ""));
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 3v12m0 0l4-4m-4 4l-4-4" />
      <path d="M5 21h14" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-10 w-10 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M8 3h5l5 5v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M13 3v6h6" />
    </svg>
  );
}

export function AssetGrid({ title, assets, tone = "added" }) {
  if (!assets?.length) return null;

  const toneClasses = tone === "removed" ? "text-rose-700" : "text-emerald-700";
  const ringTone = tone === "removed" ? "ring-rose-100" : "ring-emerald-100";

  return (
    <div className="mt-3">
      <div className={`text-xs font-medium ${toneClasses}`}>{title}</div>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {assets.map((it, i) => {
          const thumb = it?.thumbnail || it?.url;
          const name = it?.original_filename || it?.public_id || `asset-${i}`;
          const isImg = isImageFormat(it?.format);
          return (
            <div
              key={it?.public_id || `${title}-${i}`}
              className={`group overflow-hidden rounded-lg border bg-white text-center ring-1 ${ringTone}`}
              title={name}
            >
              <div className="truncate px-2 py-1 text-[10px] text-gray-500">
                {(it?.created_at || "").split("T")[0] || ""}
              </div>
              {isImg ? (
                <img
                  src={thumb}
                  alt={name}
                  className="aspect-square w-full object-cover transition group-hover:opacity-90"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center">
                  <FileIcon />
                </div>
              )}
              <div className="truncate px-2 py-1 text-[10px] text-gray-600">
                {name}
              </div>
              <div className="px-2 pb-2">
                <a
                  href={it?.url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] text-gray-700 hover:bg-gray-50"
                >
                  <DownloadIcon />
                  Download
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
