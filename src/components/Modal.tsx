// Modal.tsx
import clsx from "clsx";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  width: string
}

export default function Modal({ isOpen, onClose, children, width }: ModalProps) {
  // Create a div for the portal if it doesn't exist
  const modalRoot = document.getElementById("modal-root")!;
  
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/90  z-50"
      onClick={onClose} // click on overlay closes modal
    >
      <div
        className={clsx(["bg-darkest p-6 rounded shadow-lg ", width])}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
      >
        {children}
      </div>
    </div>,
    modalRoot
  );
}
