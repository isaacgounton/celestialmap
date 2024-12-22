import { Product } from "../../types/Product";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  className?: string;
}

export function ProductCard({ product, onClick, className = "" }: ProductCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer ${className}`}
      onClick={onClick}
    >
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="text-gray-600 text-sm">{product.parishName}</p>
        <p className="text-blue-500 font-bold">
          {product.currency}{product.price}
        </p>
      </div>
    </div>
  );
}