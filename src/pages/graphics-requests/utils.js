export const cx = (...cls) => cls.filter(Boolean).join(" ");

export const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");

export function formatTs(ts) {
  if (!ts) return "—";
  const dt = new Date(ts * 1000);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function prettyDate(d) {
  if (!d) return "—";
  let dt;
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split("-").map(Number);
    dt = new Date(y, m - 1, day);
  } else {
    dt = d instanceof Date ? d : new Date(d);
  }
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatGap(seconds = 0) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "just now";
  const units = [
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
    ["s", 1],
  ];
  let remain = Math.floor(seconds);
  const parts = [];
  for (const [label, size] of units) {
    const q = Math.floor(remain / size);
    if (q) {
      parts.push(`${q}${label}`);
      remain -= q * size;
    }
    if (parts.length >= 2) break;
  }
  return parts.length ? parts.join(" ") : "just now";
}

export function bytesToSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export function isImageAsset(a) {
  const fmt = (a?.format || "").toLowerCase();
  const rt = (a?.resource_type || "").toLowerCase();
  return (
    rt === "image" ||
    ["png", "jpg", "jpeg", "webp", "gif", "bmp", "svg"].includes(fmt)
  );
}

export function toDownloadUrl(url, filename) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("res.cloudinary.com")) {
      if (!/\/upload\/fl_attachment\//.test(u.pathname)) {
        u.pathname = u.pathname.replace("/upload/", "/upload/fl_attachment/");
      }
      if (filename) u.searchParams.set("fl_attachment", filename);
    }
    return u.toString();
  } catch {
    return url;
  }
}

export function handleDownload(asset) {
  const fname = asset?.original_filename || asset?.public_id || "file";
  const href = toDownloadUrl(asset?.url || asset?.secure_url || "", fname);
  const a = document.createElement("a");
  a.href = href;
  a.download = fname;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
