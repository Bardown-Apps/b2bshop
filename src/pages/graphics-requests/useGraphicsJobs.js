import { useCallback } from "react";
import usePost from "@/hooks/usePost";
import HttpService from "@/services/http";
import {
  GRAPHICS_JOBS,
  GRAPHICS_ACTIVITIES,
  GRAPHICS_COMMENTS,
} from "@/constants/services";

function isUnauthorizedResponse(result) {
  return (
    result?.success === false &&
    String(result?.message || "").toLowerCase() === "unauthorized"
  );
}

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

  const fetchJobs = useCallback(
    async (onError, pagination = {}, email = "", onUnauthorized) => {
      const { take = 10, skip = 0 } = pagination;
      try {
        const result = await mutateAsync({
          url: GRAPHICS_JOBS,
          data: { take, skip, email },
        });

        if (isUnauthorizedResponse(result?.data)) {
          onUnauthorized?.();
          return [];
        }
        if (result?.error) {
          onError?.(result.error);
          return [];
        }
        if (result?.success === false && result?.message) {
          onError?.(result.message);
          return [];
        }
        const list = Array.isArray(result?.data)
          ? result.data
          : (result?.data?.data ?? result?.data?.items ?? []);
        return list.map(normalizeJob);
      } catch (err) {
        onError?.(err?.message || "Failed to load jobs.");
        return [];
      }
    },
    [mutateAsync],
  );

  const deleteJob = useCallback(async (payload, onError) => {
    const id = payload?.id ?? payload?._id;
    try {
      await HttpService.delete(GRAPHICS_JOBS, { data: { id } });
      return id;
    } catch (err) {
      onError?.(err?.message || "Delete failed.");
      return null;
    }
  }, []);

  const fetchActivities = useCallback(
    async (id, email, onError, onUnauthorized) => {
      try {
        const result = await mutateAsync({
          url: GRAPHICS_ACTIVITIES,
          data: { id, email },
        });
        if (isUnauthorizedResponse(result?.data)) {
          onUnauthorized?.();
          return [];
        }
        if (result?.error) {
          onError?.(result.error);
          return [];
        }
        if (result?.success === false && result?.message) {
          onError?.(result.message);
          return [];
        }
        return result?.data ?? [];
      } catch (err) {
        onError?.(err?.message || "Failed to load activities.");
        return [];
      }
    },
    [mutateAsync],
  );

  const fetchComments = useCallback(
    async (id, email, onError, onUnauthorized) => {
      try {
        const result = await mutateAsync({
          url: GRAPHICS_COMMENTS,
          data: { id, email },
        });
        if (isUnauthorizedResponse(result?.data)) {
          onUnauthorized?.();
          return [];
        }
        if (result?.error) {
          onError?.(result.error);
          return [];
        }
        if (result?.success === false && result?.message) {
          onError?.(result.message);
          return [];
        }
        return result?.data ?? [];
      } catch (err) {
        onError?.(err?.message || "Failed to load comments.");
        return [];
      }
    },
    [mutateAsync],
  );

  const submitComment = useCallback(
    async (jId, email, createdBy, message, onError, onUnauthorized) => {
      try {
        const result = await mutateAsync({
          url: GRAPHICS_COMMENTS,
          data: { id: jId, email, createdBy, message },
          isPut: true,
        });
        if (isUnauthorizedResponse(result?.data)) {
          onUnauthorized?.();
          return null;
        }
        if (result?.error) {
          onError?.(result.error);
          return null;
        }
        if (result?.success === false && result?.message) {
          onError?.(result.message);
          return null;
        }
        return result?.data ?? [];
      } catch (err) {
        onError?.(err?.message);
        return null;
      }
    },
    [mutateAsync],
  );

  return {
    fetchJobs,
    deleteJob,
    fetchActivities,
    fetchComments,
    submitComment,
  };
}
