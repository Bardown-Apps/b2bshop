import { useEffect } from "react";
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl border bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function IconButton({
  title,
  onClick,
  children,
  className = "",
  variant = "ghost",
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg p-2 transition focus-visible:outline-none focus-visible:ring-2";
  const style =
    variant === "ghost"
      ? "hover:bg-gray-100 text-gray-700"
      : variant === "solid"
        ? "text-white"
        : "";

  const focusRingColor = "#6366f1";
  const solidBgColor = "#000000";

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`${base} ${style} ${className}`}
      style={
        variant === "solid"
          ? {
              backgroundColor: solidBgColor,
              "--focus-ring-color": `${focusRingColor}66`,
            }
          : {
              "--focus-ring-color": `${focusRingColor}66`,
            }
      }
      onMouseEnter={(e) => {
        if (variant === "solid") {
          const color = "#000000";
          // Darken the color by 10%
          const hex = color.replace("#", "");
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
            e.target.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
          }
        }
      }}
      onMouseLeave={(e) => {
        if (variant === "solid") {
          e.target.style.backgroundColor = solidBgColor;
        }
      }}
      onFocus={(e) => {
        e.target.style.boxShadow = `0 0 0 2px ${focusRingColor}66`;
      }}
      onBlur={(e) => {
        e.target.style.boxShadow = "";
      }}
    >
      {children}
    </button>
  );
}

const CHIP_COLORS = {
  indigo: "bg-black text-white ring-1 ring-black",
  emerald: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  rose: "bg-black text-white ring-1 ring-rose-100",
  sky: "bg-black text-white ring-1 ring-sky-100",
  gray: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
};

// Helper function to convert hex to rgba with opacity
function hexToRgba(hex, opacity) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(79, 70, 229, ${opacity})`;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function Chip({ children, color = "indigo", customColor }) {
  if (color === "custom" && customColor) {
    return (
      <span
        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1"
        style={{
          backgroundColor: hexToRgba(customColor, 0.1),
          color: customColor,
          borderColor: hexToRgba(customColor, 0.2),
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${CHIP_COLORS[color] ?? CHIP_COLORS.gray}`}
    >
      {children}
    </span>
  );
}

export function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl border bg-white p-0 shadow-sm">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h3 className="text-sm font-medium">{title}</h3>
            <IconButton title="Close" onClick={onClose}>
              <XMarkIcon className="h-5 w-5" />
            </IconButton>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

const BANNER_STYLES = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warn: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
};

export function Banner({ kind = "success", message, onClose }) {
  const Icon = kind === "success" ? CheckCircleIcon : ExclamationTriangleIcon;
  return (
    <div
      className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${BANNER_STYLES[kind] ?? BANNER_STYLES.error}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">{message}</div>
      <button onClick={onClose} className="shrink-0 text-xs underline">
        Dismiss
      </button>
    </div>
  );
}
