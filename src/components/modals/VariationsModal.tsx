"use client"
import Image from "next/image";
import { IoMdAdd } from "react-icons/io";
import { ProductsProps } from "@/utils/types/products";
import { showInBrazilianValue } from "@/utils/functions/functions";

interface VariationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductsProps;
  onAddVariation: (product: ProductsProps, variationId: number) => void;
  onRemoveVariation: (product: ProductsProps, variationId: number) => void;
  getVariationQuantity: (productId: string, variationId: number) => number;
}

export function VariationsModal({ 
  isOpen, 
  onClose, 
  product, 
  onAddVariation, 
  onRemoveVariation,
  getVariationQuantity 
}: VariationsModalProps) {
  if (!isOpen || !product || !product.variations) return null;

  return (
    <div
      className="fixed top-0 left-0 flex w-full h-full justify-center items-center transition-all duration-300"
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(2px)',
        opacity: isOpen ? 1 : 0,
        zIndex: isOpen ? 40 : -1,
        pointerEvents: isOpen ? 'auto' : 'none'
      }}
    >
      <div className="container m-3 bg-neutral-100 p-3 rounded-md shadow-lg relative">
        <button
          className="absolute top-0 right-0 text-white rounded-tr-md rounded-bl-md aspect-square w-12 bg-red-800 hover:bg-red-500 transition-all flex justify-center items-center"
          onClick={onClose}
        >
          X
        </button>
        <h3 className="text-xl font-bold mb-3 text-amber-900">
          <span>{product.variationPluralName}</span>
        </h3>
        {product.variations.map(variation => (
          <div key={variation.id} className="flex justify-between items-center not-last-of-type:border-b border-neutral-300 p-2">
            <div className="flex items-center gap-3">
              {variation.image && (
                <div className="relative h-16 w-16">
                  <Image
                    fill={true}
                    src={variation.image}
                    alt={variation.name}
                    loading="lazy"
                    quality={40}
                    className="object-cover rounded-md"
                  />
                </div>
              )}
              <span className="font-semibold">{variation.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold">{showInBrazilianValue(variation.value)}</span>
              <div className="flex gap-1 border border-amber-900 rounded-md overflow-hidden">
                <button
                  className="flex items-center text-white font-bold justify-center w-9 bg-amber-900"
                  onClick={() => onRemoveVariation(product, variation.id)}
                >
                  -
                </button>
                <input
                  type="text"
                  value={getVariationQuantity(product.id, variation.id)}
                  disabled
                  className="w-8 text-center"
                />
                <button
                  className="flex items-center text-white font-bold justify-center w-9 py-2 bg-amber-900"
                  onClick={() => onAddVariation(product, variation.id)}
                >
                  <IoMdAdd size={18}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}