import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { cx, formatTs, initialsOf } from "../utils";

const FALLBACK_COLOR = "#000000";

export function CommentsDrawer({
  open,
  onClose,
  job,
  comments,
  commentMsg,
  onCommentChange,
  onSubmitComment,
  userProfile,
}) {
  const accent = FALLBACK_COLOR;

  const sortedComments = [...(comments || [])].sort(
    (a, b) => (a.timeStamp || 0) - (b.timeStamp || 0),
  );
  const hasComments = sortedComments.length > 0;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-gray-900/20" aria-hidden="true" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto flex h-full w-screen max-w-md flex-col bg-white shadow-xl transition duration-300 ease-out data-[closed]:translate-x-full sm:duration-500"
            >
              {/* Header */}
              <div className="shrink-0 border-b border-gray-200 bg-gray-50/80 px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg text-white"
                      style={{ backgroundColor: accent }}
                    >
                      <ChatBubbleLeftIcon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <DialogTitle className="truncate text-base font-semibold text-gray-900">
                        Comments
                      </DialogTitle>
                      <p className="truncate text-xs text-gray-500">
                        {job?.title || "Job"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    style={{ "--tw-ring-color": accent }}
                    aria-label="Close comments"
                  >
                    <XMarkIcon className="size-5" />
                  </button>
                </div>
                {job?.createdBy && (
                  <p className="mt-2 text-xs text-gray-500">
                    Created by{" "}
                    <span className="font-medium text-gray-700">
                      {job.createdBy.name}
                    </span>{" "}
                    <span className="text-gray-400">{job.createdBy.email}</span>
                  </p>
                )}
              </div>

              {/* Comments list */}
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                {!hasComments ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
                    <ChatBubbleLeftIcon className="size-10 text-gray-300" />
                    <p className="mt-2 text-sm font-medium text-gray-500">
                      No comments yet
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Add the first comment below
                    </p>
                  </div>
                ) : (
                  <ul role="list" className="space-y-4">
                    {sortedComments.map((item, idx, arr) => {
                      const person = item.person || {};
                      const avatar = person.img;
                      const name = person.name || "Unknown";
                      const role = person.role || "Unknown";
                      const msg = item.message ?? "Updated";
                      const isUpdate = msg?.toLowerCase().includes("updated");

                      return (
                        <li key={item._id || idx} className="flex gap-3">
                          <div className="shrink-0">
                            {avatar ? (
                              <img
                                alt=""
                                src={avatar}
                                className="size-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                              />
                            ) : (
                              <div
                                className="flex size-8 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm"
                                style={{ backgroundColor: accent }}
                              >
                                {initialsOf(name)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div
                              className={cx(
                                "rounded-lg border px-3 py-2.5",
                                isUpdate
                                  ? "border-gray-100 bg-gray-50 text-gray-500"
                                  : "border-gray-200 bg-white text-gray-900 shadow-sm",
                              )}
                            >
                              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                                <span className="text-xs font-medium text-gray-700">
                                  {name}
                                  <span className="ml-1 font-normal text-gray-400">
                                    · {role}
                                  </span>
                                </span>
                                <time className="text-xs text-gray-400">
                                  {formatTs(item.timeStamp)}
                                </time>
                              </div>
                              {msg && (
                                <p
                                  className={cx(
                                    "mt-1 text-sm leading-snug",
                                    isUpdate
                                      ? "italic text-gray-500"
                                      : "text-gray-700",
                                  )}
                                >
                                  {msg}
                                </p>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* New comment input */}
              <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
                <div className="flex gap-3">
                  {userProfile?.img ? (
                    <img
                      alt=""
                      src={userProfile.img}
                      className="size-8 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div
                      className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: accent }}
                    >
                      {userProfile?.name ? initialsOf(userProfile.name) : "?"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <label htmlFor="comment-drawer" className="sr-only">
                      Add your comment
                    </label>
                    <textarea
                      id="comment-drawer"
                      value={commentMsg}
                      onChange={(e) => onCommentChange(e.target.value)}
                      rows={2}
                      placeholder="Add a comment..."
                      className="block w-full resize-none rounded-lg border border-gray-300 bg-gray-50/50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-0"
                      style={{
                        "--tw-ring-color": accent,
                      }}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={onSubmitComment}
                        disabled={!commentMsg?.trim()}
                        className={cx(
                          "rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2",
                          commentMsg?.trim()
                            ? "opacity-100"
                            : "cursor-not-allowed opacity-50",
                        )}
                        style={{
                          backgroundColor: accent,
                        }}
                        onMouseEnter={(e) => {
                          if (!commentMsg?.trim()) return;
                          const hex = accent.replace("#", "");
                          const full =
                            hex.length === 3
                              ? hex
                                  .split("")
                                  .map((c) => c + c)
                                  .join("")
                              : hex;
                          const r = parseInt(full.slice(0, 2), 16);
                          const g = parseInt(full.slice(2, 4), 16);
                          const b = parseInt(full.slice(4, 6), 16);
                          if (!Number.isNaN(r + g + b)) {
                            e.target.style.backgroundColor = `rgb(${Math.max(
                              0,
                              r - 26,
                            )}, ${Math.max(0, g - 26)}, ${Math.max(
                              0,
                              b - 26,
                            )})`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = accent;
                        }}
                      >
                        Post comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
