"use client"
import Image from "next/image";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  productName: string;
}

export function ImageModal({ isOpen, onClose, imageUrl, productName }: ImageModalProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="fixed top-0 left-0 flex w-full h-full justify-center items-center transition-all duration-300"
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(2px)',
        opacity: isOpen ? 1 : 0,
        zIndex: isOpen ? 50 : -1,
        pointerEvents: isOpen ? 'auto' : 'none'
      }}
    >
      <div className="container m-3">
        <button
          className="fixed z-40 top-3 right-3 text-white rounded-md aspect-square w-12 bg-red-500 hover:bg-red-800 transition-all flex justify-center items-center"
          onClick={onClose}
        >
          X
        </button>
        <div className="relative w-full h-screen">
          <Image
            fill={true}
            src={imageUrl}
            alt={productName}
            quality={50}
            loading="lazy"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}