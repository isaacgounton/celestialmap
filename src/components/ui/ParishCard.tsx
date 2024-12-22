import { Parish } from "../../types/Parish";

interface ParishCardProps {
    parish: Parish;
    onTap: () => void;
}

export function ParishCard({ parish, onTap }: ParishCardProps) {
    const formattedAddress = `${parish.address.street}, ${parish.address.city}, ${parish.address.province}`;
    
    return (
        <div 
            className="bg-white p-4 rounded-lg shadow-md m-2 grid grid-cols-[auto,1fr] gap-4 cursor-pointer"
            onClick={onTap}
        >
            <img
                src={parish.photos[0]}
                alt={parish.name}
                className="w-16 h-16 rounded-lg row-span-2"
            />
            <h3 className="font-bold text-lg">
                {parish.name}
            </h3>
            <p className="text-gray-600">
                {formattedAddress}
            </p>
        </div>
    );
}