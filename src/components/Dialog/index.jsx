import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const DURATION = 250;

const Dialog = ({
  open,
  onClose,
  title,
  children,
  hideHeader = false,
  showCloseButton = true,
  overlayClassName = "",
  panelClassName = "",
  headerClassName = "",
  contentClassName = "",
  backdropColor = "rgba(0,0,0,0.5)",
}) => {
  const overlayRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const startClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setMounted(false);
      onClose();
    }, DURATION);
  }, [onClose]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      document.body.style.overflow = "hidden";
    } else if (mounted) {
      startClose();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, mounted, startClose]);

  useEffect(() => {
    if (!mounted) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") startClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [mounted, startClose]);

  if (!mounted) return null;

  const dialogNode = (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all ${overlayClassName}`}
      style={{
        backgroundColor: visible ? backdropColor : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(4px)" : "blur(0px)",
        transitionDuration: `${DURATION}ms`,
      }}
      onClick={(e) => e.target === overlayRef.current && startClose()}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transition-all ${panelClassName}`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "scale(1) translateY(0)"
            : "scale(0.95) translateY(12px)",
          transitionDuration: `${DURATION}ms`,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {!hideHeader && (
          <div
            className={`flex items-center justify-between px-6 pt-6 pb-2 ${headerClassName}`}
          >
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            {showCloseButton && (
              <button
                onClick={startClose}
                className="p-1.5 text-slate-500 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className={`px-6 pb-6 ${contentClassName}`}>{children}</div>
      </div>
    </div>
  );

  return createPortal(dialogNode, document.body);
};

export default Dialog;
