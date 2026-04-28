import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  PlayIcon,
  TrashIcon,
  BriefcaseIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

import useGraphicsJobs from "./useGraphicsJobs";
import { prettyDate } from "./utils";
import {
  Card,
  IconButton,
  Chip,
  Modal,
  Banner,
  ActivitiesDrawer,
  CommentsDrawer,
} from "./components";
import { GraphicsJob } from "@/constants/routes";

function getJobStatus(s) {
  const val = Array.isArray(s) ? s[s.length - 1] : s;
  return String(val || "").toUpperCase();
}

function statusChip(status) {
  const s = Array.isArray(status)
    ? String(status[status.length - 1])
    : String(status);
  const u = (s || "").toUpperCase();
  const map = {
    NEW: "sky",
    IN_PROGRESS: "indigo",
    PROOF_SENT: "amber",
    REVISION: "rose",
    CANCELLED: "rose",
    DONE: "emerald",
  };
  return <Chip color={map[u] || "gray"}>{u || "—"}</Chip>;
}

export default function GraphicsJobsList() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const {
    fetchJobs,
    deleteJob: deleteJobApi,
    fetchActivities: fetchActivitiesApi,
    fetchComments: fetchCommentsApi,
    submitComment: submitCommentApi,
  } = useGraphicsJobs();

  const [selectedJob, setSelectedJob] = useState({});
  const [leftDrawer, setLeftDrawer] = useState(false);
  const [activity, setActivity] = useState([]);
  const [commentDrawer, setCommentDrawer] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentMsg, setCommentMsg] = useState("");
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [banner, setBanner] = useState(null);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const userProfile = useMemo(() => {
    return {
      name: user?.name,
      email: user?.email,
      role: user?.role,
    };
  }, [user]);

  useEffect(() => {
    fetchJobs((msg) => setBanner({ kind: "error", message: msg })).then(
      setJobs,
    );
  }, [fetchJobs]);

  const allStatuses = useMemo(() => {
    const set = new Set(
      (jobs || []).map((j) => getJobStatus(j.status)).filter(Boolean),
    );
    return ["ALL", ...Array.from(set)];
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let base = jobs;
    if (statusFilter !== "ALL") {
      base = base.filter((j) => getJobStatus(j.status) === statusFilter);
    }
    if (!q) return base;
    return base.filter((j) =>
      [
        j.title,
        j.client,
        j.status,
        j.priority,
        j.reference,
        ...(Array.isArray(j.assignedTo) ? j.assignedTo : []),
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [jobs, search, statusFilter]);

  const handleFetchActivities = async (id) => {
    const data = await fetchActivitiesApi(id, (msg) =>
      setBanner({ kind: "error", message: msg }),
    );
    setActivity(data || []);
  };

  const handleFetchComments = async (id) => {
    const data = await fetchCommentsApi(id, (msg) =>
      setBanner({ kind: "error", message: msg }),
    );
    setComments(data || []);
  };

  const handleSubmitComment = async () => {
    const jobId = selectedJob?.id;
    if (!jobId) return;
    const data = await submitCommentApi(
      jobId,
      { ...userProfile, role: "USER" },
      commentMsg,
    );
    if (data) {
      setCommentMsg("");
      setComments(data);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = await deleteJobApi(deleteTarget, (msg) =>
      setBanner({ kind: "error", message: msg }),
    );
    setDeleteOpen(false);
    if (id) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
      setBanner({ kind: "success", message: "Graphics job deleted." });
    }
    setTimeout(() => setBanner(null), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: "#000000" }}
            >
              <BriefcaseIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Graphics Jobs</h1>
              <p className="text-sm text-gray-500">
                View, create, and manage graphics work.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm outline-none focus:ring-2"
                style={{
                  "--focus-color": "#6366f1",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#6366f1";
                  e.target.style.boxShadow = "0 0 0 2px #6366f14d";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "";
                  e.target.style.boxShadow = "";
                }}
                title="Filter by status"
                aria-label="Filter by status"
              >
                {allStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s === "ALL" ? "All statuses" : s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                ▾
              </span>
            </div>

            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2"
                onFocus={(e) => {
                  e.target.style.borderColor = "#6366f1";
                  e.target.style.boxShadow = "0 0 0 2px #6366f14d";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "";
                  e.target.style.boxShadow = "";
                }}
                placeholder="Search title, client, status…"
              />
            </div>

            <IconButton
              title="Add job"
              onClick={() => navigate(GraphicsJob.new())}
              variant="solid"
              className="sm:ml-2"
            >
              <UserPlusIcon className="h-5 w-5" />
            </IconButton>
          </div>
        </div>

        {banner && (
          <div className="mt-4">
            <Banner
              kind={banner.kind}
              message={banner.message}
              onClose={() => setBanner(null)}
            />
          </div>
        )}

        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Job</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Due</th>
                  <th className="px-4 py-3 font-medium">Created/Assigned</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-gray-500"
                      colSpan={7}
                    >
                      No graphics jobs found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((j) => {
                    const createdBy = `${j?.createdBy?.name ?? "—"} (${
                      j?.createdBy?.email ?? "—"
                    })`;
                    const assigned = Array.isArray(j.assignedTo)
                      ? j.assignedTo[0]
                      : j.assignedTo;
                    return (
                      <tr key={j.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="mt-0.5 text-xs text-gray-500">
                            ID: {j?.id || "—"}
                          </div>
                          <div className="font-medium text-gray-900">
                            {j.title}
                          </div>
                          <div className="mt-0.5 text-xs text-gray-500">
                            Ref: {j?.type || "—"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {j.client || "—"}
                        </td>
                        <td className="px-4 py-3">{statusChip(j.status)}</td>
                        <td className="px-4 py-3">
                          {String(j.priority).toUpperCase() === "RUSH" ? (
                            <Chip color="rose">RUSH</Chip>
                          ) : (
                            <Chip color="gray">NORMAL</Chip>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {prettyDate(j.dueDate)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-800">
                            {createdBy}
                          </div>
                          {/* <hr className="my-1" />
                          <div className="text-sm text-gray-800">
                            {assigned || (
                              <span className="text-gray-400">Unassigned</span>
                            )}
                          </div> */}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <IconButton
                              title="Edit"
                              onClick={() => navigate(GraphicsJob.edit(j.id))}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>

                            {/* {userProfile?.role === "MANAGER" && (
                              <IconButton
                                title="Delete"
                                onClick={() => {
                                  setDeleteTarget(j);
                                  setDeleteOpen(true);
                                }}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </IconButton>
                            )} */}

                            <IconButton
                              title="Comments"
                              onClick={() => {
                                setCommentDrawer(true);
                                setSelectedJob(j);
                                handleFetchComments(j?.id);
                              }}
                            >
                              <ChatBubbleLeftRightIcon className="h-4 w-4" />
                            </IconButton>

                            <IconButton
                              title="Quick Track"
                              onClick={() => {
                                setLeftDrawer(true);
                                setSelectedJob(j);
                                handleFetchActivities(j?.id);
                              }}
                            >
                              <PlayIcon className="h-4 w-4" />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Modal
        open={deleteOpen}
        title="Delete graphics job"
        onClose={() => setDeleteOpen(false)}
      >
        <p className="text-sm text-gray-600">
          Delete{" "}
          <span className="font-medium text-gray-900">
            {deleteTarget?.title}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            className="rounded-xl border px-4 py-2 text-sm"
            onClick={() => setDeleteOpen(false)}
          >
            Cancel
          </button>
          <button
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </Modal>

      <ActivitiesDrawer
        open={leftDrawer}
        onClose={() => setLeftDrawer(false)}
        job={selectedJob}
        activity={activity}
      />

      <CommentsDrawer
        open={commentDrawer}
        onClose={() => setCommentDrawer(false)}
        job={selectedJob}
        comments={comments}
        commentMsg={commentMsg}
        onCommentChange={setCommentMsg}
        onSubmitComment={handleSubmitComment}
        userProfile={userProfile}
      />
    </div>
  );
}
