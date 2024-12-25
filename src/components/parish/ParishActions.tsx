import { Parish } from "../../types/Parish";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface ParishActionsProps {
  parish: Parish;
  onEdit: () => void;
  onDelete: () => void;
}

export function ParishActions({ parish, onEdit, onDelete }: ParishActionsProps) {
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${parish.name}?`)) {
      onDelete();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
        title="Edit Parish"
      >
        <PencilIcon className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
        title="Delete Parish"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
