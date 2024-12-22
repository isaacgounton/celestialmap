import { Parish } from "../../types/Parish";
import { ParishListItem } from "./ParishListItem";

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
    if (loading) {
        return (
            <div className="p-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (parishes.length === 0) {
        return (
            <div className="p-4">
                <p className="text-center text-gray-500">
                    No parishes found
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-auto">
            <div className="p-4 space-y-4">
                {parishes.map((parish) => (
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