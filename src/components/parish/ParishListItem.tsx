import { Parish } from "../../types/Parish";
import { ParishActions } from "./ParishActions";

function formatAddress(address: Parish['address']) {
    if (!address) return '';
    const { street, city, province, postalCode, country } = address;
    return `${street}, ${city}, ${province} ${postalCode}, ${country}`.trim();
}

interface ParishListItemProps {
    parish: Parish;
    onClick: () => void;
    isAdmin?: boolean;
    onEdit?: (parish: Parish) => void;
    onDelete?: (parishId: string) => void;
}

export function ParishListItem({ 
    parish, 
    onClick, 
    isAdmin = false,
    onEdit,
    onDelete 
}: ParishListItemProps) {
    return (
        <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between">
                <div 
                    onClick={onClick}
                    className="flex items-start space-x-4 flex-1 cursor-pointer"
                >
                    {parish.photos?.[0] && (
                        <img
                            src={parish.photos[0]}
                            alt={parish.name}
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                    )}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {parish.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {formatAddress(parish.address)}
                        </p>
                    </div>
                </div>
                
                {isAdmin && (
                    <ParishActions
                        parish={parish}
                        onEdit={() => onEdit?.(parish)}
                        onDelete={() => onDelete?.(parish.id)}
                    />
                )}
            </div>
        </div>
    );
}