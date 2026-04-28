import { useCallback } from "react";
import usePost from "@/hooks/usePost";
import HttpService from "@/services/http";
import {
  GRAPHICS_JOBS,
  GRAPHICS_ACTIVITIES,
  GRAPHICS_COMMENTS,
} from "@/constants/services";

function normalizeJob(it) {
  const id = it?.id ?? it?._id ?? it?.jobId;
  let assignedArr = [];
  if (Array.isArray(it?.assignedTo)) {
    assignedArr = it.assignedTo.map((v) => {
      if (typeof v === "string") return v;
      if (v?.name && v?.email) return `${v.name} (${v.email})`;
      if (v?.name) return v.name;
      if (v?.email) return v.email;
      return String(v ?? "");
    });
  } else if (it?.assignedTo) {
    const v = it.assignedTo;
    assignedArr = [
      typeof v === "string"
        ? v
        : v?.name && v?.email
          ? `${v.name} (${v.email})`
          : v?.name
            ? v.name
            : v?.email
              ? v.email
              : String(v ?? ""),
    ];
  }
  return {
    id,
    title: it?.title ?? "",
    client: it?.client ?? "",
    brief: it?.brief ?? "",
    status: it?.status ?? "NEW",
    priority: it?.priority ?? "NORMAL",
    dueDate: it?.dueDate ?? null,
    assignedTo: assignedArr,
    reference: it?.reference ?? "",
    type: it?.type ?? "",
    ...it,
  };
}

export default function useGraphicsJobs() {
  const { mutateAsync } = usePost();
  const UI_ONLY_MODE = true;

  const fetchJobs = useCallback(
    async (onError) => {
      if (UI_ONLY_MODE) return [];
      try {
        const result = await mutateAsync({
          url: GRAPHICS_JOBS,
          data: {},
        });
        if (result?.error) {
          onError?.(result.error);
          return [];
        }
        const list = Array.isArray(result?.data)
          ? result.data
          : result?.data?.data ?? result?.data?.items ?? [];
        return list.map(normalizeJob);
      } catch (err) {
        onError?.(err?.message || "Failed to load jobs.");
        return [];
      }
    },
    [mutateAsync]
  );

  const deleteJob = useCallback(
    async (payload, onError) => {
      if (UI_ONLY_MODE) return payload?.id ?? payload?._id ?? null;
      const id = payload?.id ?? payload?._id;
      try {
        await HttpService.delete(GRAPHICS_JOBS, { data: { id } });
        return id;
      } catch (err) {
        onError?.(err?.message || "Delete failed.");
        return null;
      }
    },
    []
  );

  const fetchActivities = useCallback(
    async (id, onError) => {
      if (UI_ONLY_MODE) return [];
      try {
        const result = await mutateAsync({
          url: GRAPHICS_ACTIVITIES,
          data: { id },
        });
        if (result?.error) {
          onError?.(result.error);
          return [];
        }
        return result?.data ?? [];
      } catch (err) {
        onError?.(err?.message || "Failed to load activities.");
        return [];
      }
    },
    [mutateAsync]
  );

  const fetchComments = useCallback(
    async (id, onError) => {
      if (UI_ONLY_MODE) return [];
      try {
        const result = await mutateAsync({
          url: GRAPHICS_COMMENTS,
          data: { id },
        });
        if (result?.error) {
          onError?.(result.error);
          return [];
        }
        return result?.data ?? [];
      } catch (err) {
        onError?.(err?.message || "Failed to load comments.");
        return [];
      }
    },
    [mutateAsync]
  );

  const submitComment = useCallback(
    async (jId, createdBy, message, onError) => {
      if (UI_ONLY_MODE) return [];
      try {
        const result = await mutateAsync({
          url: GRAPHICS_COMMENTS,
          data: { id: jId, createdBy, message },
          isPut: true,
        });
        if (result?.error) {
          onError?.(result.error);
          return null;
        }
        return result?.data ?? [];
      } catch (err) {
        onError?.(err?.message);
        return null;
      }
    },
    [mutateAsync]
  );

  return {
    fetchJobs,
    deleteJob,
    fetchActivities,
    fetchComments,
    submitComment,
  };
}
