// components/ui/OpenModalButton.tsx
import { ReactNode } from "react";

interface OpenModalButtonProps {
  label: string;
  icon?: ReactNode;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function OpenModalButton({
  label,
  icon,
  className = "",
  onClick,
  disabled = false
}: OpenModalButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}