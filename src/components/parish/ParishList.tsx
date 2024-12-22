import { Parish } from "../../types/Parish";
import { ParishListItem } from "./ParishListItem";
import { useLocation } from '../../contexts/LocationContext';

interface ParishListProps {
    parishes: Parish[];
    onParishSelect: (parish: Parish) => void;
    loading?: boolean;
}

export function ParishList({ 
    parishes, 
    onParishSelect, 
    loading = false 
}: ParishListProps) {
    const { selectedCountry } = useLocation();

    const filteredParishes = parishes.filter(
        parish => parish.address.country === selectedCountry
    );

    if (loading) {
        return (
            <div className="p-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (filteredParishes.length === 0) {
        return (
            <div className="p-4">
                <p className="text-center text-gray-500">
                    No parishes found in {selectedCountry}
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-auto">
            <div className="p-4 space-y-4">
                {filteredParishes.map((parish) => (
                    <ParishListItem
                        key={parish.id}
                        parish={parish}
                        onClick={() => onParishSelect(parish)}
                    />
                ))}
            </div>
        </div>
    );
}