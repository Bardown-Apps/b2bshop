import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cx, formatTs, initialsOf } from "../utils";
import { TimeGap } from "./TimeGap";
import { DiffList } from "./DiffList";
import { AssetGrid } from "./AssetGrid";

// Mask email addresses and names in a string (keeps first char visible)
function maskEmailAndNameInText(text) {
  if (!text || typeof text !== "string") return text;
  let masked = text;

  // First, mask email addresses
  const emailRegex = /([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  masked = masked.replace(emailRegex, (match, localPart, domain) => {
    const firstChar = localPart[0] || "";
    const maskedLocal =
      firstChar + "*".repeat(Math.max(3, localPart.length - 1));
    const domainParts = domain.split(".");
    const domainName = domainParts[0] || "";
    const maskedDomain =
      (domainName[0] || "") + "*".repeat(Math.max(2, domainName.length - 1));
    return `${maskedLocal}@${maskedDomain}.${domainParts.slice(1).join(".")}`;
  });

  // Mask names in parentheses: (John Doe) or (John)
  masked = masked.replace(
    /\(([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\)/g,
    (match, name) => {
      const parts = name.split(/\s+/).filter(Boolean);
      const maskedParts = parts.map((part) => {
        if (part.length <= 1) return part;
        return part[0] + "*".repeat(Math.max(2, part.length - 1));
      });
      return `(${maskedParts.join(" ")})`;
    },
  );

  // Mask names that appear after "assigned to" or similar phrases
  // Pattern: "assigned to John Doe" -> "assigned to J*** D***"
  masked = masked.replace(
    /\b(assigned\s+to|assigned|to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
    (match, prefix, name) => {
      const parts = name.split(/\s+/).filter(Boolean);
      const maskedParts = parts.map((part) => {
        if (part.length <= 1) return part;
        return part[0] + "*".repeat(Math.max(2, part.length - 1));
      });
      return `${prefix} ${maskedParts.join(" ")}`;
    },
  );

  return masked;
}

export function ActivitiesDrawer({ open, onClose, job, activity }) {
  const accent = "#000000";
  const sortedActivity = [...(activity || [])].sort(
    (a, b) => (a.timeStamp || 0) - (b.timeStamp || 0),
  );

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="relative flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-base font-semibold text-gray-900">
                      Activities: {job?.id}
                    </DialogTitle>
                    <button
                      type="button"
                      onClick={onClose}
                      className="relative rounded-md text-gray-400 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{
                        "--focus-color": accent,
                      }}
                      onFocus={(e) => {
                        e.target.style.outlineColor = accent;
                      }}
                      onBlur={(e) => {
                        e.target.style.outlineColor = "";
                      }}
                    >
                      <span className="absolute -inset-2.5" />
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                  </div>
                  <p className="text-sm">Title: {job?.title}</p>
                  <p className="text-sm">
                    Created by: {job?.createdBy?.name} ({job?.createdBy?.email})
                  </p>
                </div>

                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  <ul role="list" className="mt-6 space-y-6">
                    {sortedActivity.map((item, idx, arr) => {
                      const prevTs = idx > 0 ? arr[idx - 1]?.timeStamp || 0 : 0;
                      const gapSeconds =
                        idx > 0 && item?.timeStamp && prevTs
                          ? item.timeStamp - prevTs
                          : 0;

                      const person = item.person || {};
                      const avatar = person.img;
                      const name = person.name || "Unknown";
                      const role = person.role || "Unknown";
                      const rawMsg = item.message ?? "Updated";
                      // Mask emails and names in all messages
                      const msg = maskEmailAndNameInText(rawMsg);
                      const isUpdate = msg?.toLowerCase().includes("updated");
                      const showDiff = Boolean(item.dataUpdated);
                      const last = idx === arr.length - 1;

                      const du = item?.dataUpdated || {};

                      // Normalize asset arrays - ensure they're arrays and filter out invalid items
                      const normalizeAssets = (assets) => {
                        if (!assets) return [];
                        // Handle single object
                        if (
                          assets &&
                          typeof assets === "object" &&
                          !Array.isArray(assets)
                        ) {
                          // Check if it's a valid asset object
                          if (
                            assets.public_id ||
                            assets.url ||
                            assets.thumbnail
                          ) {
                            return [assets];
                          }
                          // If it's an object with nested arrays/objects, try to extract
                          if (Array.isArray(assets.to)) return assets.to;
                          if (Array.isArray(assets.from)) return assets.from;
                          return [];
                        }
                        // Handle array
                        if (!Array.isArray(assets)) return [];
                        return assets.filter(
                          (asset) =>
                            asset &&
                            typeof asset === "object" &&
                            (asset.public_id ||
                              asset.url ||
                              asset.thumbnail ||
                              asset.secure_url),
                        );
                      };

                      // Filter out asset fields from diff display (they're handled by AssetGrid)
                      const isAssetField = (key) => {
                        return (
                          key === "userAssets" ||
                          key === "designerAssets" ||
                          key.startsWith("userAssets.") ||
                          key.startsWith("designerAssets.")
                        );
                      };

                      const filterAssetFields = (obj) => {
                        if (!obj || typeof obj !== "object") return obj;
                        const filtered = {};
                        for (const [key, val] of Object.entries(obj)) {
                          if (!isAssetField(key)) {
                            filtered[key] = val;
                          }
                        }
                        return filtered;
                      };

                      const filteredChanged = filterAssetFields(
                        du.changed || {},
                      );
                      const filteredAdded = filterAssetFields(du.added || {});
                      const filteredRemoved = filterAssetFields(
                        du.removed || {},
                      );

                      // Extract asset arrays properly - handle both object and array formats
                      const extractChangedAssets = (changedObj, direction) => {
                        if (!changedObj) return [];
                        // Handle case where changedObj is directly an array
                        if (Array.isArray(changedObj))
                          return normalizeAssets(changedObj);
                        // Handle case where changedObj has .to or .from property
                        if (changedObj[direction])
                          return normalizeAssets(changedObj[direction]);
                        // Handle case where changedObj is a single asset object
                        return normalizeAssets(changedObj);
                      };

                      const userAssetsAdded = [
                        ...normalizeAssets(du.added?.userAssets),
                        ...extractChangedAssets(du.changed?.userAssets, "to"),
                      ];
                      const designerAssetsAdded = [
                        ...normalizeAssets(du.added?.designerAssets),
                        ...extractChangedAssets(
                          du.changed?.designerAssets,
                          "to",
                        ),
                      ];
                      const userAssetsRemoved = [
                        ...normalizeAssets(du.removed?.userAssets),
                        ...extractChangedAssets(du.changed?.userAssets, "from"),
                      ];
                      const designerAssetsRemoved = [
                        ...normalizeAssets(du.removed?.designerAssets),
                        ...extractChangedAssets(
                          du.changed?.designerAssets,
                          "from",
                        ),
                      ];

                      return (
                        <Fragment key={item._id || idx}>
                          {idx > 0 && <TimeGap seconds={gapSeconds} />}

                          <li className="relative flex gap-x-4">
                            <div
                              className={cx(
                                last ? "h-6" : "-bottom-6",
                                "absolute left-0 top-0 flex w-6 justify-center",
                              )}
                            >
                              <div className="w-px bg-gray-200" />
                            </div>

                            {avatar ? (
                              <img
                                alt={name}
                                src={avatar}
                                className="relative mt-3 size-6 flex-none rounded-full bg-gray-100 outline outline-1 -outline-offset-1 outline-black/5"
                              />
                            ) : (
                              <div
                                className="relative mt-3 grid size-6 place-items-center rounded-full text-[10px] font-medium text-white"
                                style={{ backgroundColor: accent }}
                              >
                                {initialsOf(name)}
                              </div>
                            )}

                            <div className="flex-1 rounded-md p-3 ring-1 ring-inset ring-gray-200">
                              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                                <div className="text-xs text-gray-500">
                                  <span className="font-medium text-gray-900">
                                    {name} ({role})
                                  </span>
                                </div>
                                <time className="text-xs text-gray-500">
                                  {formatTs(item.timeStamp)}
                                </time>
                              </div>

                              {!isUpdate && msg && (
                                <p className="mt-1 text-sm text-gray-600">
                                  {msg}
                                </p>
                              )}

                              {showDiff &&
                                (Object.keys(filteredChanged).length > 0 ||
                                  Object.keys(filteredAdded).length > 0 ||
                                  Object.keys(filteredRemoved).length > 0) && (
                                  <DiffList
                                    changed={filteredChanged}
                                    added={filteredAdded}
                                    removed={filteredRemoved}
                                  />
                                )}

                              {userAssetsAdded.length > 0 && (
                                <AssetGrid
                                  title="User assets added"
                                  assets={userAssetsAdded}
                                />
                              )}
                              {designerAssetsAdded.length > 0 && (
                                <AssetGrid
                                  title="Designer assets added"
                                  assets={designerAssetsAdded}
                                />
                              )}
                              {userAssetsRemoved.length > 0 && (
                                <AssetGrid
                                  title="User assets removed"
                                  assets={userAssetsRemoved}
                                  tone="removed"
                                />
                              )}
                              {designerAssetsRemoved.length > 0 && (
                                <AssetGrid
                                  title="Designer assets removed"
                                  assets={designerAssetsRemoved}
                                  tone="removed"
                                />
                              )}
                            </div>
                          </li>
                        </Fragment>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
