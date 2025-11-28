// src/components/ProductCard.tsx
import React from "react";
import Link from "next/link";
import { Product } from "@/data/product";

interface ProductCardProps {
  product?: Product; // make it optional for safety
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Prevent errors if product is undefined
  if (!product) return null;

  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <Link href={`/products/${product.id}`}>
        <div className="w-full h-48 overflow-hidden">
          <img
            src={product.imageUrl || "/placeholder.png"} // fallback image
            alt={product.name}
            className="w-full h-full object-cover cursor-pointer"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
          <p className="text-blue-600 font-bold mt-2">${product.price}</p>
        </div>

        {/* Button */}
        <Link href={`/products/${product.id}`}>
          <button
            className={`mt-auto w-full py-2 rounded-lg transition ${
              product.available
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!product.available}
          >
            {product.available ? "Add to Cart" : "Out of Stock"}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
