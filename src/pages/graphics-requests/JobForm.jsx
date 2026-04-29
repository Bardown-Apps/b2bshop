import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import usePost from "@/hooks/usePost";
import { GRAPHICS_JOBS } from "@/constants/services";
import { GraphicsRequest } from "@/constants/routes";
import {
  CheckCircleIcon,
  ArrowLeftIcon,
  SwatchIcon,
  ArrowDownTrayIcon,
  PencilSquareIcon,
  DocumentIcon,
  TrashIcon,
  ArrowPathIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Card, Banner, AssetPreviewDialog } from "./components";
import openCloudinaryWidget from "@/utils/cloudinary";

// ---- constants
const JOB_TYPES = [
  {
    id: "VECTORIMAGE",
    title: "Vector Image",
    description: "Jersey/hoodie mockups, layout previews",
    meta: "ETA: 24–48h",
    price: 0,
    icon: SwatchIcon,
  },
  // {
  //   id: "SOCIALMEDIA",
  //   title: "Social Media Post",
  //   description: "Post for social media platforms.",
  //   meta: "ETA: 12–24h",
  //   price: 0,
  //   icon: PencilSquareIcon,
  // },
  // {
  //   id: "MFA",
  //   title: "Mock Ready (MFA)",
  //   description: "Seps, bleeds, color callouts",
  //   meta: "ETA: 24h",
  //   icon: DocumentIcon,
  // },
  // {
  //   id: "MFP",
  //   title: "Print Ready (MFP)",
  //   description: "Seps, bleeds, color callouts",
  //   meta: "ETA: 24h",
  //   icon: DocumentIcon,
  // },
  {
    id: "CUSTOM",
    title: "Custom Design",
    description: "Changes to existing artwork or create new",
    meta: "ETA: TBC",
    icon: ArrowPathIcon,
  },
  {
    id: "OTHER",
    title: "Other",
    description: "Anything custom like strory boards, proposals, etc.",
    meta: "ETA: TBC",
    icon: QuestionMarkCircleIcon,
  },
];

// -------- Preview helpers --------
const IMG_EXTS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg",
  "bmp",
  "tiff",
]);
function isImageAsset(asset) {
  if (!asset) return false;
  if (
    asset?.format === "png" ||
    asset?.format === "jpg" ||
    asset?.format === "jpeg"
  )
    return true;
  const fmt = String(asset?.format || "").toLowerCase();
  return IMG_EXTS.has(fmt);
}

// ---- small UI bits
function Page({ children }) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}

function TextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  error,
  disabled = false,
  shopColor = "#6366f1",
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required ? <span className="ml-0.5 text-rose-600">*</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition ${
          error ? "border-rose-400" : "border-gray-300"
        } ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-500" : ""}`}
        style={
          !error && !disabled
            ? {
                "--focus-ring-color": hexToRgba(shopColor, 0.3),
              }
            : {}
        }
        onFocus={(e) => {
          if (!error && !disabled) {
            e.target.style.borderColor = shopColor;
            e.target.style.boxShadow = `0 0 0 2px ${hexToRgba(shopColor, 0.3)}`;
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = "";
            e.target.style.boxShadow = "";
          }
        }}
      />
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required,
  error,
  disabled = false,
  shopColor = "#6366f1",
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required ? <span className="ml-0.5 text-rose-600">*</span> : null}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition ${
          error ? "border-rose-400" : "border-gray-300"
        } ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-500" : ""}`}
        style={
          !error && !disabled
            ? {
                "--focus-ring-color": hexToRgba(shopColor, 0.3),
              }
            : {}
        }
        onFocus={(e) => {
          if (!error && !disabled) {
            e.target.style.borderColor = shopColor;
            e.target.style.boxShadow = `0 0 0 2px ${hexToRgba(shopColor, 0.3)}`;
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = "";
            e.target.style.boxShadow = "";
          }
        }}
      />
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function toAssetObj(info) {
  return {
    public_id: info.public_id,
    url: info.secure_url || info.url,
    format: info.format,
    bytes: info.bytes,
    width: info.width,
    height: info.height,
    original_filename: info.original_filename,
    resource_type: info.resource_type, // image / video / raw
    created_at: info.created_at,
    thumbnail: info.secure_url || info.url,
  };
}

function normalizeOptions(options = []) {
  return options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );
}
const ensureArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

function CustomSelect({
  id,
  label,
  value, // array
  onChange, // (array) => void
  options = [],
  required,
  disabled = false,
  error,
  placeholder = "Select…",
  shopColor = "#6366f1",
}) {
  const opts = normalizeOptions(options);
  const values = ensureArray(value).map(String);
  const selectedSet = new Set(values);
  const displayLabels =
    values
      .map((v) => opts.find((o) => String(o.value) === v)?.label)
      .filter(Boolean) || [];

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function onDoc(e) {
      if (!rootRef.current) return;
      if (rootRef.current.contains(e.target)) return;
      setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Keep activeIndex in range
  useEffect(() => {
    if (!opts.length) return;
    setActiveIndex((i) => Math.min(Math.max(i, 0), opts.length - 1));
  }, [opts.length]);

  function toggle(val) {
    const key = String(val);
    const next = new Set(selectedSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange?.(Array.from(next));
  }

  function clearTag(val) {
    const key = String(val);
    const next = values.filter((v) => v !== key);
    onChange?.(next);
  }

  function onButtonKeyDown(e) {
    if (disabled) return;
    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => {
        const el = listRef.current?.querySelector('[data-active="true"]');
        el?.scrollIntoView({ block: "nearest" });
      });
    }
  }

  function onListKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const pick = opts[activeIndex];
      if (pick) toggle(pick.value);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, opts.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(opts.length - 1);
      return;
    }
  }

  return (
    <div ref={rootRef}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required ? <span className="ml-0.5 text-rose-600">*</span> : null}
        </label>
      ) : null}

      {/* Hidden multi-select for native validity & form semantics */}
      <select
        id={id}
        name={`${id}[]`}
        multiple
        value={values}
        onChange={() => {}}
        required={required}
        disabled={disabled}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      >
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Trigger */}
      <button
        type="button"
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={onButtonKeyDown}
        disabled={disabled}
        className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-left text-sm outline-none transition ${
          error ? "border-rose-400" : "border-gray-300"
        } ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-500" : ""}`}
        style={
          !error && !disabled
            ? {
                "--focus-ring-color": hexToRgba(shopColor, 0.3),
              }
            : {}
        }
        onFocus={(e) => {
          if (!error && !disabled) {
            e.target.style.borderColor = shopColor;
            e.target.style.boxShadow = `0 0 0 2px ${hexToRgba(shopColor, 0.3)}`;
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = "";
            e.target.style.boxShadow = "";
          }
        }}
      >
        {displayLabels.length ? (
          <div className="flex flex-wrap gap-1">
            {displayLabels.map((lbl, i) => (
              <span
                key={`${id}-tag-${i}-${lbl}`}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs ring-1"
                style={{
                  backgroundColor: hexToRgba(shopColor, 0.1),
                  color: shopColor,
                  borderColor: hexToRgba(shopColor, 0.2),
                }}
              >
                {lbl}
                <XMarkIcon
                  className="h-3.5 w-3.5 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearTag(values[i]);
                  }}
                />
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <ChevronDownIcon className="float-right ml-auto inline-block h-4 w-4 text-gray-400" />
      </button>

      {/* Listbox */}
      {open ? (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          aria-multiselectable="true"
          tabIndex={-1}
          ref={listRef}
          onKeyDown={onListKeyDown}
          className="absolute z-50 mt-2 max-h-60 w-[20%] overflow-auto rounded-xl border border-gray-200 bg-white p-1 text-sm shadow-lg focus:outline-none"
        >
          {opts.map((o, idx) => {
            const active = idx === activeIndex;
            const isSelected = selectedSet.has(String(o.value));
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isSelected}
                data-active={active ? "true" : undefined}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => toggle(o.value)}
                className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 ${
                  isSelected ? "font-medium" : "text-gray-700"
                }`}
                style={{
                  backgroundColor: active ? hexToRgba(shopColor, 0.1) : "",
                  color: isSelected ? shopColor : undefined,
                }}
              >
                <CheckIcon
                  className={`h-4 w-4 ${
                    isSelected ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    color: isSelected ? shopColor : undefined,
                  }}
                />
                <span>{o.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}

      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function SingleSelect({
  id,
  label,
  value, // string
  onChange, // (string) => void
  options = [],
  required,
  disabled = false,
  error,
  placeholder = "Select…",
  shopColor = "#6366f1",
}) {
  const opts = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );
  const selected = opts.find((o) => String(o.value) === String(value)) || null;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    Math.max(
      0,
      opts.findIndex((o) => String(o.value) === String(value)),
    ),
  );

  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!rootRef.current) return;
      if (rootRef.current.contains(e.target)) return;
      setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (!opts.length) return;
    setActiveIndex((i) => Math.min(Math.max(i, 0), opts.length - 1));
  }, [opts.length]);

  function commit(val) {
    onChange?.(val);
    setOpen(false);
    requestAnimationFrame(() => buttonRef.current?.focus());
  }

  function onButtonKeyDown(e) {
    if (disabled) return;
    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
      const idx = opts.findIndex((o) => String(o.value) === String(value));
      setActiveIndex(idx >= 0 ? idx : 0);
      requestAnimationFrame(() => {
        const el = listRef.current?.querySelector('[data-active="true"]');
        el?.scrollIntoView({ block: "nearest" });
      });
    }
  }

  function onListKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const pick = opts[activeIndex];
      if (pick) commit(pick.value);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, opts.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(opts.length - 1);
      return;
    }
  }

  return (
    <div ref={rootRef}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required ? <span className="ml-0.5 text-rose-600">*</span> : null}
        </label>
      ) : null}

      {/* Hidden native select for semantics/validation */}
      <select
        id={id}
        name={id}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Trigger */}
      <button
        type="button"
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={onButtonKeyDown}
        disabled={disabled}
        className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-left text-sm outline-none transition ${
          error ? "border-rose-400" : "border-gray-300"
        } ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-500" : ""}`}
        style={
          !error && !disabled
            ? {
                "--focus-ring-color": hexToRgba(shopColor, 0.3),
              }
            : {}
        }
        onFocus={(e) => {
          if (!error && !disabled) {
            e.target.style.borderColor = shopColor;
            e.target.style.boxShadow = `0 0 0 2px ${hexToRgba(shopColor, 0.3)}`;
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = "";
            e.target.style.boxShadow = "";
          }
        }}
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDownIcon className="float-right ml-auto inline-block h-4 w-4 text-gray-400" />
      </button>

      {/* Listbox */}
      {open ? (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          tabIndex={-1}
          ref={listRef}
          onKeyDown={onListKeyDown}
          className="absolute z-50 mt-2 max-h-60 w-[20%] overflow-auto rounded-xl border border-gray-200 bg-white p-1 text-sm shadow-lg focus:outline-none"
        >
          {opts.map((o, idx) => {
            const active = idx === activeIndex;
            const isSelected = String(o.value) === String(value);
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isSelected}
                data-active={active ? "true" : undefined}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => commit(o.value)}
                className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 ${
                  isSelected ? "font-medium" : "text-gray-700"
                }`}
                style={{
                  backgroundColor: active ? hexToRgba(shopColor, 0.1) : "",
                  color: isSelected ? shopColor : undefined,
                }}
              >
                <CheckIcon
                  className={`h-4 w-4 ${
                    isSelected ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    color: isSelected ? shopColor : undefined,
                  }}
                />
                <span>{o.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}

      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

// Helper function to convert hex to rgba with opacity
function hexToRgba(hex, opacity) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(79, 70, 229, ${opacity})`;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default function GraphicsJobForm({ mode: modeProp }) {
  const navigate = useNavigate();
  const params = useParams();
  const { mutateAsync } = usePost();
  const user = useSelector((state) => state.auth?.user);

  const mode = modeProp ?? (params?.id && params.id !== "new" ? "edit" : "add");
  const isEdit = mode === "edit";

  // Shop color defaults
  const shopColor = "#111827";
  const shopColorDark = "#000000";

  // Helper to pass shopColor to form components
  const formProps = { shopColor };

  // ---- Preview dialog state ----
  const [preview, setPreview] = useState(null);
  // preview = { url, name, isImage }

  function openPreview(asset) {
    if (!asset?.url) return;
    setPreview({
      url: asset.url,
      name: asset.original_filename || asset.public_id || "Preview",
      isImage: isImageAsset(asset),
    });
  }

  // ---- FORM: single for `status`, multi for `priority`; single for `assignedTo`
  const [form, setForm] = useState({
    type: "",

    title: "",
    client: "",
    reference: "",
    brief: "",

    // common
    status: "NEW", // single-select now
    priority: ["NORMAL"], // keep multi
    dueDate: "",

    // assignment single
    assignedTo: "",

    // VECTORIMAGE
    artSize: "",
    pantoneColors: "",
    outputType: [],
    logoApplication: [],
    backgroundTexture: [],
    colorTextures: [],
    spotColorSeparation: [],
    photoProcessing: [],

    // SOCIALMEDIA
    socialMediaType: [],

    // MFA + MFP
    sportType: [],
    productType: [],
    size: [],
    factory: [],
    productName: "",
    pantoneColor: "",
    apparelBaseColor: "",
    apparelSecondaryColor: "",
    apparelThirdColor: "",
    teckPack: "",

    // MFP extra
    orderType: [],

    // CUSTOM
    customItem: [],

    // OTHER
    higherApproval: "",
    userAssets: [],
    designerAssets: [],
  });

  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [oldJobData, setOldJobData] = useState({});
  const [loading, setLoading] = useState(isEdit); // load when editing

  async function fetchJob(id, email) {
    setLoading(true);
    try {
      const result = await mutateAsync({
        url: GRAPHICS_JOBS,
        data: { id, email },
      });
      if (result?.error) {
        setBanner({
          kind: "error",
          message: result.error || "Failed to load job.",
        });
        setLoading(false);
        return;
      }
      const list = Array.isArray(result?.data)
        ? result.data
        : (result?.data?.data ?? result?.data?.items ?? []);
      const found = list.find((j) => j.id == id);
      if (found) {
        const dueDateLocal = found?.dueDate
          ? new Date(found.dueDate).toISOString().slice(0, 10)
          : "";

        const coerce = (v) => (Array.isArray(v) ? v : v ? [v] : []);

        setOldJobData(found);
        setForm((prev) => ({
          ...prev,
          ...found,
          dueDate: dueDateLocal,

          // status → single string (use last of array if server stored history)
          status: Array.isArray(found?.status)
            ? found.status[found.status.length - 1] || "NEW"
            : found?.status || "NEW",

          // keep priority as multi
          priority: coerce(found?.priority ?? "NORMAL"),

          // assignedTo is already a single display string per your flow
          assignedTo: found?.assignedTo ?? "",

          outputType: coerce(found?.outputType),
          logoApplication: coerce(found?.logoApplication),
          backgroundTexture: coerce(found?.backgroundTexture),
          colorTextures: coerce(found?.colorTextures),
          spotColorSeparation: coerce(found?.spotColorSeparation),
          photoProcessing: coerce(found?.photoProcessing),
          socialMediaType: coerce(found?.socialMediaType),

          sportType: coerce(found?.sportType),
          productType: coerce(found?.productType),
          size: coerce(found?.size),
          factory: coerce(found?.factory),
          orderType: coerce(found?.orderType),
          customItem: coerce(found?.customItem),
        }));
      } else {
        setBanner({
          kind: "warn",
          message: "Job not found. Creating a new one instead.",
        });
      }
    } catch (e) {
      setBanner({ kind: "error", message: e.message || "Failed to load job." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isEdit && params?.id) fetchJob(params.id, user?.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, params?.id, user?.email]);

  function validate(j) {
    const errs = {};
    if (!j.type) errs.type = "Select a job type";
    if (!j.title?.trim()) errs.title = "Title is required";
    if (!j.client?.trim()) errs.client = "Client is required";
    if (!j.dueDate?.trim()) errs.dueDate = "Due date is required";
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(j.dueDate))
      errs.dueDate = "Use YYYY-MM-DD";

    // status is single now
    if (!j.status) errs.status = "Select a status";

    // priority remains multi
    if (!Array.isArray(j.priority) || j.priority.length === 0)
      errs.priority = "Pick at least one priority";

    return errs;
  }

  function isObject(v) {
    return v && typeof v === "object" && !Array.isArray(v);
  }

  function deepEqual(a, b) {
    if (a === b) return true;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++)
        if (!deepEqual(a[i], b[i])) return false;
      return true;
    }
    if (isObject(a) && isObject(b)) {
      const ak = Object.keys(a),
        bk = Object.keys(b);
      if (ak.length !== bk.length) return false;
      for (const k of ak) if (!deepEqual(a[k], b[k])) return false;
      return true;
    }
    return false;
  }

  function diffObjects(a, b, path = []) {
    const changed = {},
      added = {},
      removed = {};
    const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
    for (const k of keys) {
      const pa = a?.[k],
        pb = b?.[k];
      const p = [...path, k].join(".");
      if (!(k in a)) {
        added[p] = pb;
      } else if (!(k in b)) {
        removed[p] = pa;
      } else if (isObject(pa) && isObject(pb)) {
        const d = diffObjects(pa, pb, [...path, k]);
        Object.assign(changed, d.changed);
        Object.assign(added, d.added);
        Object.assign(removed, d.removed);
      } else if (Array.isArray(pa) && Array.isArray(pb)) {
        if (!deepEqual(pa, pb)) changed[p] = { from: pa, to: pb };
      } else if (!deepEqual(pa, pb)) {
        changed[p] = { from: pa, to: pb };
      }
    }
    return { changed, added, removed };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      const payload = {
        id: isEdit ? params?.id : Math.floor(Date.now() / 1000),
        ...form,
      };

      const dataUpdated = diffObjects(oldJobData, form);

      // Don't send Mongo _id back
      delete payload?._id;

      setLoading(true);
      if (isEdit) {
        const result = await mutateAsync({
          url: GRAPHICS_JOBS,
          data: {
            ...payload,
            dataUpdated,
            email: user?.email,
          },
          isPatch: true,
        });
        if (result?.error) {
          setBanner({ kind: "error", message: result.error || "Save failed." });
          setLoading(false);
          return;
        }
        setBanner({ kind: "success", message: "Graphics job updated." });
      } else {
        const result = await mutateAsync({
          url: GRAPHICS_JOBS,
          data: {
            ...payload,
            message: "Job Created",
            createdBy: { ...user },
          },
          isPut: isEdit ? false : true,
          isPatch: isEdit ? true : false,
        });
        if (result?.error) {
          setBanner({ kind: "error", message: result.error || "Save failed." });
          setLoading(false);
          return;
        }
        setBanner({ kind: "success", message: "Graphics job created." });
      }
      setLoading(false);
      setTimeout(() => navigate(GraphicsRequest.path), 500);
    } catch (err) {
      setLoading(false);
      setBanner({ kind: "error", message: err.message || "Save failed." });
    }
  }

  // Open Cloudinary Upload Widget and push results into the chosen array (uses src/utils/cloudinary)
  async function openUpload(target /* 'user' | 'designer' */) {
    try {
      const folder = `B2BLab/Graphicslab/${user?.email}/${
        target === "user" ? "UserAssets" : "DesignerAssets"
      }`;

      openCloudinaryWidget({
        folder,
        multiple: true,
        sources: ["local"],
        maxFileSize: 5500000,
        clientAllowedFormats: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
          "image/svg+xml",
          "application/pdf",
          "application/illustrator",
          "image/vnd.adobe.photoshop",
        ],
        cb: (info) => {
          const asset = toAssetObj(info);
          setForm((prev) => {
            if (target === "designer") {
              return {
                ...prev,
                designerAssets: [...(prev.designerAssets || []), asset],
              };
            }
            return {
              ...prev,
              userAssets: [...(prev.userAssets || []), asset],
            };
          });
        },
      });
    } catch (e) {
      setBanner({
        kind: "error",
        message: e?.message || "Upload widget failed to load.",
      });
    }
  }

  function toDownloadUrl(url, filename) {
    try {
      const u = new URL(url);
      // Force Cloudinary to download (fl_attachment)
      if (u.hostname.includes("res.cloudinary.com")) {
        if (!/\/upload\/fl_attachment\//.test(u.pathname)) {
          u.pathname = u.pathname.replace("/upload/", "/upload/fl_attachment/");
        }
        // Optional: set a filename
        if (filename) u.searchParams.set("fl_attachment", filename);
      }
      return u.toString();
    } catch {
      return url;
    }
  }

  function handleDownload(asset) {
    const fname = asset?.original_filename || asset?.public_id || "file";
    const href = toDownloadUrl(asset?.url, fname);

    const a = document.createElement("a");
    a.href = href;
    a.download = fname; // browsers may ignore if cross-origin, but we also used fl_attachment
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function handleRemoveAsset(kind, ident) {
    // kind: "user" | "designer"
    setForm((prev) => {
      const key = kind === "designer" ? "designerAssets" : "userAssets";
      const list = Array.isArray(prev[key]) ? prev[key] : [];
      const next = list.filter((item, idx) => {
        const pid = item?.public_id ?? idx;
        return pid !== ident && idx !== ident; // support removing by public_id or index
      });
      return { ...prev, [key]: next };
    });
  }

  return (
    <Page>
      <div className="mb-4 flex items-center gap-2">
        <button
          className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
          onClick={() => navigate(GraphicsRequest.path)}
          type="button"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </button>
        <h1 className="text-xl font-semibold">
          {isEdit ? "Edit Graphics Job" : "Create Graphics Job"}
        </h1>
      </div>

      {banner ? (
        <div className="mb-4">
          <Banner
            kind={banner.kind}
            message={banner.message}
            onClose={() => setBanner(null)}
          />
        </div>
      ) : null}

      <Card className="p-5">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading…</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Job Type radio cards with icons (single select) */}
            <fieldset>
              <legend className="text-sm font-semibold text-gray-900">
                {isEdit ? "Selected Job Type" : "Select Job Type"}:&nbsp;
                <span className="text-gray-600">{form?.type || "—"}</span>
              </legend>
              {errors.type ? (
                <p className="mt-1 text-xs text-rose-600">{errors.type}</p>
              ) : null}

              {isEdit ? null : (
                <div className="mt-4 grid grid-cols-1 gap-y-3 sm:grid-cols-3 sm:gap-4">
                  {JOB_TYPES.map((jt) => {
                    const checked = form.type === jt.id;
                    const Icon = jt.icon || QuestionMarkCircleIcon;
                    return (
                      <button
                        key={jt.id}
                        type="button"
                        aria-label={jt.title}
                        aria-description={`${jt.description} (${jt.meta})`}
                        onClick={() => setForm({ ...form, type: jt.id })}
                        className={`group relative flex w-full items-start gap-3 rounded-lg border bg-white p-4 text-left transition ${
                          checked
                            ? "outline outline-2 outline-offset-2"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={
                          checked
                            ? {
                                borderColor: shopColor,
                                outlineColor: shopColor,
                              }
                            : {}
                        }
                      >
                        <div
                          className="grid size-9 shrink-0 place-items-center rounded-md transition"
                          style={{
                            backgroundColor: checked
                              ? shopColor
                              : hexToRgba(shopColor, 0.1),
                            color: checked ? "white" : shopColor,
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 pr-6">
                          <span className="block text-sm font-medium text-gray-900">
                            {jt.title}
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            {jt.description}
                          </span>
                          <span className="mt-3 block text-xs font-medium text-gray-700">
                            {jt.meta}
                          </span>
                        </div>
                        <CheckCircleIcon
                          aria-hidden="true"
                          className={`size-5 ${
                            checked ? "visible" : "invisible"
                          }`}
                          style={{ color: shopColor }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </fieldset>

            {form?.type ? (
              <>
                {/* Main fields */}
                <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-3 sm:gap-4">
                  <TextField
                    id="title"
                    label="Title"
                    value={form.title}
                    onChange={(v) => setForm({ ...form, title: v })}
                    placeholder="e.g., Jersey mockup for Falcons"
                    required
                    error={errors.title}
                    {...formProps}
                  />
                  <TextField
                    id="client"
                    label="Client"
                    value={form.client}
                    onChange={(v) => setForm({ ...form, client: v })}
                    placeholder="e.g., Falcons Sports Club"
                    required
                    error={errors.client}
                    {...formProps}
                  />
                  <TextField
                    id="reference"
                    label="Reference (optional)"
                    value={form.reference}
                    onChange={(v) => setForm({ ...form, reference: v })}
                    placeholder="PO-12345"
                    {...formProps}
                  />
                </div>

                {form?.type === "VECTORIMAGE" ? (
                  <>
                    <div className="flex items-center">
                      <div className="relative flex justify-start">
                        <span className="bg-white pr-2 text-sm text-gray-500">
                          {form?.type}
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-4 sm:gap-4">
                      <TextField
                        id="artSize"
                        label="Art Size (optional)"
                        value={form.artSize}
                        onChange={(v) => setForm({ ...form, artSize: v })}
                        placeholder="e.g., 10 X 10 inch"
                        {...formProps}
                      />
                      <TextField
                        id="pantoneColors"
                        label="Pantone Colors (optional)"
                        value={form.pantoneColors}
                        onChange={(v) => setForm({ ...form, pantoneColors: v })}
                        placeholder="e.g., #000, #fff, red, blue"
                        {...formProps}
                      />
                      <CustomSelect
                        id="outputType"
                        label="Output Type"
                        value={form.outputType}
                        onChange={(v) => setForm({ ...form, outputType: v })}
                        options={[
                          "JPG",
                          "PNG",
                          "PDF",
                          "ILLUSTRATOR (AI)",
                          "SVG",
                        ]}
                        {...formProps}
                      />
                      <CustomSelect
                        id="logoApplication"
                        label="Logo Application"
                        value={form.logoApplication}
                        onChange={(v) =>
                          setForm({ ...form, logoApplication: v })
                        }
                        options={[
                          "Embroidery",
                          "Embroidery Patch",
                          "Woven Patch",
                          "Sublimation Patch",
                          "Twill/ Embroidery",
                          "Twill",
                          "Sublimated",
                          "Screenprint",
                          "Heat Press",
                          "DTF",
                        ]}
                        {...formProps}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-4 sm:gap-4">
                      <CustomSelect
                        id="backgroundTexture"
                        label="Background or Textures"
                        value={form.backgroundTexture}
                        onChange={(v) =>
                          setForm({ ...form, backgroundTexture: v })
                        }
                        options={[
                          "Remove background and textures",
                          "Vector background and textures",
                          "Vector design textures only",
                        ]}
                        {...formProps}
                      />
                      <CustomSelect
                        id="colorTextures"
                        label="Color or Textures"
                        value={form.colorTextures}
                        onChange={(v) => setForm({ ...form, colorTextures: v })}
                        options={[
                          "Black and White",
                          "Spot Colors",
                          "Spot Colors with Gradients",
                          "CMYK",
                          "RGB",
                          "Pantone Coated",
                        ]}
                        {...formProps}
                      />
                      <CustomSelect
                        id="spotColorSeparation"
                        label="Spot Color Separation"
                        value={form.spotColorSeparation}
                        onChange={(v) =>
                          setForm({ ...form, spotColorSeparation: v })
                        }
                        options={["Yes", "No"]}
                        {...formProps}
                      />
                      <CustomSelect
                        id="photoProcessing"
                        label="Photo Processing"
                        value={form.photoProcessing}
                        onChange={(v) =>
                          setForm({ ...form, photoProcessing: v })
                        }
                        options={[
                          "Vector Everything",
                          "Place photos and vector everything else",
                        ]}
                        {...formProps}
                      />
                    </div>
                    <div className="flex items-center">
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                      <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-sm text-gray-500">
                          Continue
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                    </div>
                  </>
                ) : null}

                {form?.type === "SOCIALMEDIA" ? (
                  <>
                    <div className="flex items-center">
                      <div className="relative flex justify-start">
                        <span className="bg-white pr-2 text-sm text-gray-500">
                          {form?.type}
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-3 sm:gap-4">
                      <TextField
                        id="artSize"
                        label="Art Size (optional)"
                        value={form.artSize}
                        onChange={(v) => setForm({ ...form, artSize: v })}
                        placeholder="e.g., 10 X 10 inch"
                        {...formProps}
                      />
                      <CustomSelect
                        id="socialMediaType"
                        label="Type of Social Media"
                        value={form.socialMediaType}
                        onChange={(v) =>
                          setForm({ ...form, socialMediaType: v })
                        }
                        options={[
                          "Social Media Post",
                          "Web Banner",
                          "Web Button",
                          "Web image",
                          "Flyer",
                          "Backdrop",
                        ]}
                        {...formProps}
                      />
                      <CustomSelect
                        id="outputType"
                        label="Output Type"
                        value={form.outputType}
                        onChange={(v) => setForm({ ...form, outputType: v })}
                        options={[
                          "JPG",
                          "PNG",
                          "PDF",
                          "ILLUSTRATOR (AI)",
                          "SVG",
                        ]}
                      />
                    </div>

                    <div className="flex items-center">
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                      <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-sm text-gray-500">
                          Continue
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                    </div>
                  </>
                ) : null}

                {form?.type === "MFA" ? (
                  <>
                    <div className="flex items-center">
                      <div className="relative flex justify-start">
                        <span className="bg-white pr-2 text-sm text-gray-500">
                          {form?.type}
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-3 sm:gap-4">
                      <CustomSelect
                        id="sportType"
                        label="Type of Sport"
                        value={form.sportType}
                        onChange={(v) => setForm({ ...form, sportType: v })}
                        options={[
                          "Hockey",
                          "Baseball",
                          "Laccrosse",
                          "Collegiate",
                        ]}
                        {...formProps}
                      />
                      <CustomSelect
                        id="productType"
                        label="Type of Product"
                        value={form.productType}
                        onChange={(v) => setForm({ ...form, productType: v })}
                        options={[
                          "Hats",
                          "Fleece Item",
                          "Streatwear Hoodies",
                          "Knitwear",
                          "Jersey",
                          "Shorts",
                        ]}
                        {...formProps}
                      />
                      <TextField
                        id="productName"
                        label="Product Name or Code"
                        value={form.productName}
                        onChange={(v) => setForm({ ...form, productName: v })}
                        placeholder="eg., (BB-1060B) Curved Brim Flex Fit, (AP-1040B) Art Attack Hoodie"
                        {...formProps}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-3 sm:gap-4">
                      <CustomSelect
                        id="size"
                        label="Size"
                        value={form.size}
                        onChange={(v) => setForm({ ...form, size: v })}
                        options={["Adult", "Youth", "Both"]}
                        {...formProps}
                      />
                      <TextField
                        id="pantoneColor"
                        label="Pantone Color"
                        value={form.pantoneColor}
                        onChange={(v) => setForm({ ...form, pantoneColor: v })}
                        placeholder="eg., #fff, red, blue"
                        {...formProps}
                      />
                      <CustomSelect
                        id="factory"
                        label="Factory"
                        value={form.factory}
                        onChange={(v) => setForm({ ...form, factory: v })}
                        options={[
                          "Local",
                          "Alan",
                          "Sally",
                          "Hussain",
                          "Willian",
                        ]}
                        {...formProps}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-3 sm:gap-4">
                      <TextField
                        id="apparelBaseColor"
                        label="Apparel Base Color"
                        value={form.apparelBaseColor}
                        onChange={(v) =>
                          setForm({ ...form, apparelBaseColor: v })
                        }
                        placeholder="eg., #fff, red, blue"
                        {...formProps}
                      />
                      <TextField
                        id="apparelSecondaryColor"
                        label="Apparel Secondary Color"
                        value={form.apparelSecondaryColor}
                        onChange={(v) =>
                          setForm({ ...form, apparelSecondaryColor: v })
                        }
                        placeholder="eg., #fff, red, blue"
                        {...formProps}
                      />
                      <TextField
                        id="apparelThirdColor"
                        label="Apparel Third Color"
                        value={form.apparelThirdColor}
                        onChange={(v) =>
                          setForm({ ...form, apparelThirdColor: v })
                        }
                        placeholder="eg., #fff, red, blue"
                        {...formProps}
                      />
                    </div>

                    <div className="flex items-center">
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                      <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-sm text-gray-500">
                          Continue
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                    </div>
                  </>
                ) : null}

                {form?.type === "MFP" ? (
                  <>
                    <div className="flex items-center">
                      <div className="relative flex justify-start">
                        <span className="bg-white pr-2 text-sm text-gray-500">
                          {form?.type}
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-4 sm:gap-4">
                      <CustomSelect
                        id="orderType"
                        label="Type of Order"
                        value={form.orderType}
                        onChange={(v) => setForm({ ...form, orderType: v })}
                        options={["New", "ReOrder"]}
                        {...formProps}
                      />
                      <CustomSelect
                        id="sportType"
                        label="Type of Sport"
                        value={form.sportType}
                        onChange={(v) => setForm({ ...form, sportType: v })}
                        options={[
                          "Hockey",
                          "Baseball",
                          "Laccrosse",
                          "Collegiate",
                        ]}
                        {...formProps}
                      />
                      <CustomSelect
                        id="productType"
                        label="Type of Product"
                        value={form.productType}
                        onChange={(v) => setForm({ ...form, productType: v })}
                        options={[
                          "Hats",
                          "Fleece Item",
                          "Streatwear Hoodies",
                          "Knitwear",
                          "Jersey",
                          "Shorts",
                        ]}
                        {...formProps}
                      />
                      <TextField
                        id="productName"
                        label="Product Name or Code"
                        value={form.productName}
                        onChange={(v) => setForm({ ...form, productName: v })}
                        placeholder="eg., (BB-1060B) Curved Brim Flex Fit, (AP-1040B) Art Attack Hoodie"
                        {...formProps}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-3 sm:gap-4">
                      <CustomSelect
                        id="size"
                        label="Size"
                        value={form.size}
                        onChange={(v) => setForm({ ...form, size: v })}
                        options={["Adult", "Youth", "Both"]}
                        {...formProps}
                      />
                      <TextField
                        id="pantoneColor"
                        label="Pantone Color"
                        value={form.pantoneColor}
                        onChange={(v) => setForm({ ...form, pantoneColor: v })}
                        placeholder="eg., #fff, red, blue"
                        {...formProps}
                      />
                      <CustomSelect
                        id="factory"
                        label="Factory"
                        value={form.factory}
                        onChange={(v) => setForm({ ...form, factory: v })}
                        options={[
                          "Local",
                          "Alan",
                          "Sally",
                          "Hussain",
                          "William",
                        ]}
                        {...formProps}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-3 sm:gap-4">
                      <TextField
                        id="apparelBaseColor"
                        label="Apparel Base Color"
                        value={form.apparelBaseColor}
                        onChange={(v) =>
                          setForm({ ...form, apparelBaseColor: v })
                        }
                        placeholder="eg., #fff, red, blue"
                        {...formProps}
                      />
                      <TextField
                        id="apparelSecondaryColor"
                        label="Apparel Secondary Color"
                        value={form.apparelSecondaryColor}
                        onChange={(v) =>
                          setForm({ ...form, apparelSecondaryColor: v })
                        }
                        placeholder="eg., #fff, red, blue"
                        {...formProps}
                      />
                      <TextField
                        id="apparelThirdColor"
                        label="Apparel Third Color"
                        value={form.apparelThirdColor}
                        onChange={(v) =>
                          setForm({ ...form, apparelThirdColor: v })
                        }
                        placeholder="eg., #fff, red, blue"
                        {...formProps}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-3 sm:gap-4">
                      <CustomSelect
                        id="logoApplication"
                        label="Logo Application"
                        value={form.logoApplication}
                        onChange={(v) =>
                          setForm({ ...form, logoApplication: v })
                        }
                        options={[
                          "Embroidery",
                          "Embroidery Patch",
                          "Woven Patch",
                          "Sublimation Patch",
                          "Twill/ Embroidery",
                          "Twill",
                          "Sublimated",
                          "Screenprint",
                          "Heat Press",
                          "DTF",
                        ]}
                        {...formProps}
                      />
                      <TextField
                        id="teckPack"
                        label="Techpack & Fabric Code"
                        value={form.teckPack}
                        onChange={(v) => setForm({ ...form, teckPack: v })}
                        placeholder=""
                        {...formProps}
                      />
                      <TextField
                        id="artSize"
                        label="Art Size (optional)"
                        value={form.artSize}
                        onChange={(v) => setForm({ ...form, artSize: v })}
                        placeholder="e.g., 10 X 10 inch"
                        {...formProps}
                      />
                    </div>

                    <div className="flex items-center">
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                      <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-sm text-gray-500">
                          Continue
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                    </div>
                  </>
                ) : null}

                {form?.type === "CUSTOM" ? (
                  <>
                    <div className="flex items-center">
                      <div className="relative flex justify-start">
                        <span className="bg-white pr-2 text-sm text-gray-500">
                          {form?.type}
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-4">
                      <CustomSelect
                        id="customItem"
                        label="Type of Custom Item"
                        value={form.customItem}
                        onChange={(v) => setForm({ ...form, customItem: v })}
                        options={[
                          "Sell Sheet",
                          "Catalogue",
                          "Presentaion",
                          "Custom MFP",
                          "Custom Mockups",
                          "Custom Pattern",
                        ]}
                        {...formProps}
                      />
                      <CustomSelect
                        id="outputType"
                        label="Output Type"
                        value={form.outputType}
                        onChange={(v) => setForm({ ...form, outputType: v })}
                        options={[
                          "JPG",
                          "PNG",
                          "PDF",
                          "ILLUSTRATOR (AI)",
                          "SVG",
                        ]}
                      />
                    </div>

                    <div className="flex items-center">
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                      <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-sm text-gray-500">
                          Continue
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                    </div>
                  </>
                ) : null}

                {form?.type === "OTHER" ? (
                  <>
                    <div className="flex items-center">
                      <div className="relative flex justify-start">
                        <span className="bg-white pr-2 text-sm text-gray-500">
                          {form?.type}
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-1 sm:gap-4">
                      <TextField
                        id="higherApproval"
                        label="Approval From Senior Authority"
                        value={form.higherApproval}
                        onChange={(v) =>
                          setForm({ ...form, higherApproval: v })
                        }
                        placeholder="eg., Manager, CEO, etc."
                        {...formProps}
                      />
                    </div>

                    <div className="flex items-center">
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                      <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-sm text-gray-500">
                          Continue
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="w-full border-t border-gray-300"
                      />
                    </div>
                  </>
                ) : null}

                <TextAreaField
                  id="brief"
                  label="Brief / Notes"
                  value={form.brief}
                  onChange={(v) => setForm({ ...form, brief: v })}
                  placeholder="Add requirements, links, brand guidelines, etc."
                  {...formProps}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Status is SINGLE now */}
                  <SingleSelect
                    id="status"
                    label="Status"
                    value={form.status}
                    onChange={(v) => setForm({ ...form, status: v })}
                    options={
                      isEdit
                        ? [
                            "NEW",
                            "ACCEPT",
                            "DECLINED",
                            "IN_PROGRESS",
                            "PROOF_SENT",
                            "REVISION",
                            "CANCELLED",
                            "DONE",
                          ]
                        : ["NEW"]
                    }
                    error={errors.status}
                    {...formProps}
                  />

                  {/* Priority remains MULTI */}
                  <CustomSelect
                    id="priority"
                    label="Priority"
                    value={form.priority}
                    onChange={(v) => setForm({ ...form, priority: v })}
                    options={["NORMAL", "RUSH"]}
                    error={errors.priority}
                    {...formProps}
                  />

                  <TextField
                    id="dueDate"
                    type="date"
                    label="Due Date"
                    value={form.dueDate || ""}
                    onChange={(v) => setForm({ ...form, dueDate: v })}
                    error={errors.dueDate}
                    required
                    {...formProps}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* USER ASSETS */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User Assets
                    </label>

                    <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {(form.userAssets || []).map((it, i) => {
                        const ident = it?.public_id ?? i; // stable key to remove
                        const isImage =
                          it?.format === "png" ||
                          it?.format === "jpg" ||
                          it?.format === "jpeg";
                        return (
                          <div
                            key={it.public_id || i}
                            className="group relative w-[100%] overflow-hidden rounded-lg border border-dashed border-gray-400 bg-white text-center"
                            title={it.original_filename}
                          >
                            <button
                              type="button"
                              onClick={() => handleRemoveAsset("user", ident)}
                              aria-label="Remove asset"
                              className="absolute right-1 top-1 inline-flex items-center rounded-md bg-white/90 p-1 text-gray-700 opacity-0 shadow ring-1 ring-gray-300 transition hover:bg-white group-hover:opacity-100"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>

                            <div className="truncate bg-gray-900 px-2 py-1 text-[10px] font-bold text-gray-50">
                              {it?.created_at?.split?.("T")?.[0] || ""}
                            </div>

                            {isImage ? (
                              <img
                                src={it.thumbnail}
                                alt={it.original_filename || "asset"}
                                className="aspect-square w-full object-cover transition group-hover:opacity-90"
                              />
                            ) : (
                              <DocumentTextIcon
                                aria-hidden="true"
                                className="mx-auto my-2 block size-12"
                              />
                            )}

                            <div className="truncate px-2 py-1 text-[10px] text-gray-500">
                              {it.original_filename || it.public_id}
                            </div>

                            <div className="pb-2">
                              <button
                                type="button"
                                onClick={() => handleDownload(it)}
                                className="inline-flex w-[80%] items-center justify-center gap-1 rounded-md border border-gray-400 px-2 py-1 text-center text-xs font-medium text-gray-700 hover:bg-gray-50"
                              >
                                <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                                Download
                              </button>
                            </div>
                            <div className="pb-2">
                              <button
                                type="button"
                                onClick={() => openPreview(it)}
                                className="inline-flex w-[80%] items-center justify-center gap-1 rounded-md border border-gray-400 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                              >
                                <EyeIcon className="h-3.5 w-3.5" />
                                Preview
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => openUpload("user")}
                        className="flex aspect-square w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-400 text-gray-600 hover:bg-gray-50"
                        title="Upload to User Assets"
                      >
                        <CloudArrowUpIcon
                          aria-hidden="true"
                          className="size-10"
                        />
                      </button>
                    </div>
                  </div>

                  {/* DESIGNER ASSETS */}

                  <div>
                    <label className="text sm block font-medium text-gray-700">
                      Designer Assets
                    </label>

                    <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {(form.designerAssets || []).map((it, i) => {
                        const ident = it?.public_id ?? i;
                        const isImage =
                          it?.format === "png" ||
                          it?.format === "jpg" ||
                          it?.format === "jpeg";

                        return (
                          <div
                            key={it.public_id || i}
                            className="group relative w-[100%] overflow-hidden rounded-lg border border-dashed border-gray-400 bg-white text-center"
                            title={it.original_filename}
                          >
                            {/* <button
                              type="button"
                              onClick={() =>
                                handleRemoveAsset("designer", ident)
                              }
                              aria-label="Remove asset"
                              className="absolute right-1 top-1 inline-flex items-center rounded-md bg-white/90 p-1 text-gray-700 opacity-0 shadow ring-1 ring-gray-300 transition hover:bg-white group-hover:opacity-100"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button> */}

                            <div className="truncate bg-gray-900 px-2 py-1 text-[10px] font-bold text-gray-50">
                              {it?.created_at?.split?.("T")?.[0] || ""}
                            </div>

                            {isImage ? (
                              <img
                                src={it.thumbnail}
                                alt={it.original_filename || "asset"}
                                className="aspect-square w-full object-cover transition group-hover:opacity-90"
                              />
                            ) : (
                              <DocumentTextIcon
                                aria-hidden="true"
                                className="mx-auto my-2 block size-12"
                              />
                            )}

                            <div className="truncate px-2 py-1 text-[10px] text-gray-500">
                              {it.original_filename || it.public_id}
                            </div>

                            <div className="pb-2">
                              <button
                                type="button"
                                onClick={() => handleDownload(it)}
                                className="inline-flex w-[80%] items-center justify-center gap-1 rounded-md border border-gray-400 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                              >
                                <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                                Download
                              </button>
                            </div>
                            <div className="pb-2">
                              <button
                                type="button"
                                onClick={() => openPreview(it)}
                                className="inline-flex w-[80%] items-center justify-center gap-1 rounded-md border border-gray-400 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                              >
                                <EyeIcon className="h-3.5 w-3.5" />
                                Preview
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {user?.role === "DESIGNER" && (
                        <button
                          type="button"
                          onClick={() => openUpload("designer")}
                          className="flex aspect-square w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-400 text-gray-600 hover:bg-gray-50"
                          title="Upload to Designer Assets"
                        >
                          <CloudArrowUpIcon
                            aria-hidden="true"
                            className="size-10"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="rounded-xl border px-4 py-2 text-sm"
                    onClick={() => navigate(GraphicsRequest.path)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl px-4 py-2 text-sm font-medium text-white"
                    style={{
                      backgroundColor: shopColorDark,
                    }}
                    onMouseEnter={(e) => {
                      const color = shopColorDark;
                      const rgb = color.match(/\d+/g);
                      if (rgb && rgb.length === 3) {
                        const r = Math.max(0, parseInt(rgb[0]) - 26);
                        const g = Math.max(0, parseInt(rgb[1]) - 26);
                        const b = Math.max(0, parseInt(rgb[2]) - 26);
                        e.target.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = shopColorDark;
                    }}
                  >
                    {isEdit ? "Save changes" : "Create job"}
                  </button>
                </div>
              </>
            ) : null}
          </form>
        )}
      </Card>

      <AssetPreviewDialog
        preview={preview}
        onClose={() => setPreview(null)}
        accentColor={hexToRgba(shopColor, 0.8)}
      />
    </Page>
  );
}
