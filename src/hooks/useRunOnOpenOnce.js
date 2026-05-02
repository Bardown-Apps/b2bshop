import { useEffect, useRef } from "react";

const useRunOnOpenOnce = ({
  isOpen,
  onOpen,
  resetOnClose = true,
}) => {
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      if (resetOnClose) {
        hasRunRef.current = false;
      }
      return;
    }

    if (hasRunRef.current) return;
    hasRunRef.current = true;

    onOpen?.();
  }, [isOpen, onOpen, resetOnClose]);
};

export default useRunOnOpenOnce;
