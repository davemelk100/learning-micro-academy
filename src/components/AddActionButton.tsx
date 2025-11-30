import React from "react";
import { Plus } from "lucide-react";

interface AddActionButtonProps {
  onClick: () => void;
  className?: string;
}

export const AddActionButton: React.FC<AddActionButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`hover:opacity-80 transition-opacity p-1 flex items-center space-x-2 ${className}`}
      style={{ color: "#335292" }}
    >
      <div
        className="w-5 h-5 rounded-full border flex items-center justify-center"
        style={{ borderColor: "#335292" }}
      >
        <Plus className="h-5 w-5" />
      </div>
    </button>
  );
};
