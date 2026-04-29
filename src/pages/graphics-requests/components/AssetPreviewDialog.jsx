import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Dialog from "@/components/Dialog";

export function AssetPreviewDialog({
  preview,
  onClose,
  accentColor = "#93c5fd",
}) {
  return (
    <Dialog open={!!preview} onClose={onClose}>
      {preview ? (
        <div className="flex h-full flex-col">
          {preview.isImage ? (
            <div className="flex h-full w-full items-center justify-center p-3 sm:p-5">
              <img
                src={preview.url}
                alt={preview.name}
                className="h-full w-full rounded-xl border border-white/10 object-contain shadow-2xl"
              />
            </div>
          ) : (
            <iframe
              title="File Preview"
              src={preview.url}
              className="h-full w-full"
            />
          )}
        </div>
      ) : null}
    </Dialog>
  );
}
