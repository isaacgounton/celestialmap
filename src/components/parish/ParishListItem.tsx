import { Parish } from "../../types/Parish";
import { HiPhone, HiMail, HiGlobe, HiLocationMarker, HiPencil, HiTrash } from "react-icons/hi";

interface ParishListItemProps {
  parish: Parish;
  onClick: () => void;
  isAdmin?: boolean;
  onEdit?: (parish: Parish) => void;
  onDelete?: (parishId: string) => void;
}

export function ParishListItem({ parish, onClick, isAdmin, onEdit, onDelete }: ParishListItemProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      onClick={onClick}
    >
      {parish.photos && parish.photos.length > 0 && (
        <div className="h-48 overflow-hidden">
          <img 
            src={parish.photos[0]} 
            alt={parish.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{parish.name}</h3>
          {parish.featured && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Featured</span>
          )}
        </div>

        <div className="mt-2 space-y-2">
          <div className="flex items-start text-gray-600">
            <HiLocationMarker className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
            <p className="text-sm">
              {parish.address.street}, {parish.address.city}, {parish.address.province}
            </p>
          </div>

          {parish.phone && (
            <div className="flex items-center text-gray-600">
              <HiPhone className="w-5 h-5 mr-2" />
              <p className="text-sm">{parish.phone}</p>
            </div>
          )}

          {parish.email && (
            <div className="flex items-center text-gray-600">
              <HiMail className="w-5 h-5 mr-2" />
              <p className="text-sm">{parish.email}</p>
            </div>
          )}

          {parish.website && (
            <div className="flex items-center text-gray-600">
              <HiGlobe className="w-5 h-5 mr-2" />
              <a 
                href={parish.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={(e) => e.stopPropagation()}
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(parish);
              }}
              className="p-2 text-gray-600 hover:text-blue-600"
              aria-label={`Edit ${parish.name}`}
              title="Edit parish"
            >
              <HiPencil className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this parish?')) {
                  onDelete?.(parish.id);
                }
              }}
              className="p-2 text-gray-600 hover:text-red-600"
              aria-label={`Delete ${parish.name}`}
              title="Delete parish"
            >
              <HiTrash className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}