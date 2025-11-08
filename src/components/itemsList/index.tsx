"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import { products} from "@/utils/data/products";
import { categories as fetchCategories } from "@/utils/data/categories";
import { IoMdAdd } from "react-icons/io"
import { SlSizeFullscreen } from "react-icons/sl"
import { MdOutlineFormatListBulleted  } from "react-icons/md"
import { ProductsProps } from "@/utils/types/products";
import { showInBrazilianValue, getCheaperVariation } from "@/utils/functions/functions";
import { ImageModal } from "../modals/ImageModal";
import { VariationsModal } from "../modals/VariationsModal";

import { useCart } from "@/contexts/CartContext"; 

export default function ItemsList() {
  const { cart, addToCart, removeFromCart, addVariationToCart, removeVariationFromCart } = useCart();

  const [categories, setCategories] = useState<{ id: string; name: any; order: any }[]>([]);
  const [produtos, setProducts] = useState<ProductsProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);

      const fetchedProducts = await products();
      setProducts(fetchedProducts);
      
    };
    fetchData();
  }, []);

  const [selectedProduct, setSelectedProduct] = useState<ProductsProps | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isVariationsModalOpen, setIsVariationsModalOpen] = useState(false);

  const handleOpenImageModal = (product: ProductsProps) => {
    setSelectedProduct(product);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const handleOpenVariationsModal = (product: ProductsProps) => {
    setSelectedProduct(product);
    setIsVariationsModalOpen(true);
  };

  const handleCloseVariationsModal = () => {
    setIsVariationsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const getVariationQuantity = (productId: string, variationId: number) => {
    return cart.items.find(
      cartItem => 
        String(cartItem.id) === `${productId} - ${String(variationId)}` && 
        cartItem.type === 'variation'
    )?.quantity || 0;
  };

  return (
    <div className="container mx-auto px-3 my-10 overflow-hidden">
      <ImageModal 
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
        imageUrl={selectedProduct?.imageUrl}
        productName={selectedProduct?.name || ''}
      />

      <VariationsModal
        isOpen={isVariationsModalOpen}
        onClose={handleCloseVariationsModal}
        product={selectedProduct || undefined}
        onAddVariation={(product, variationId) => addVariationToCart({ ...product, quantity: 1 }, variationId)}
        onRemoveVariation={removeVariationFromCart}
        getVariationQuantity={getVariationQuantity}
      />

      <div className="flex justify-between items-center flex-col">
        {[...categories]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((category) => (
          <div key={category.id} id={`category-${category.id}`} className="mb-10 w-full">
            <h2 className="text-3xl md:text-center lg:text-left font-bold mb-2">{category.name}</h2>

            <div className="flex flex-wrap justify-center gap-3 lg:gap-0">
              {produtos.filter(product => product.categoryId === category.id).map((product) => (
                <div key={product.id}
                  className="w-full md:w-8/12 lg:w-4/12 lg:p-2 "
                  >
                  <div
                    className="border border-neutral-200 rounded-md flex flex-wrap align-center overflow-hidden mb-2 shadow-md"
                    >
                    <div
                      className="relative w-4/12 p-3 aspect-square cursor-pointer"
                      onClick={() => handleOpenImageModal(product)}
                    >
                      {product.imageUrl ? (
                        <>
                          <Image
                            width="500"
                            height="500"
                            src={product.imageUrl}
                            alt={product.name}
                            quality={50}
                            loading="lazy"
                            className="object-cover rounded-md h-full object-center"
                          />
                          <SlSizeFullscreen
                            size={24}
                            className="absolute bottom-3 right-3 text-white bg-amber-900 rounded-md p-1 cursor-pointer shadow-md"
                          />
                        </>  
                      ) : (
                        <div className="flex justify-center items-center w-full h-full bg-neutral-200 rounded-md">
                          <span className="text-gray-500">Sem imagem</span>
                        </div>
                      )}
                    </div>
                    <div
                      className="py-3 pr-3 w-8/12 flex flex-col justify-between align-middle gap-3 relative"
                      >
                      <h3
                        className="text-2xl text-neutral-900 font-semibold"
                        >
                        {product.name}
                      </h3>
                      
                      {product.hasVariations ? (
                        <>
                          <p className="text-lg font-bold">
                            A partir de {getCheaperVariation(product)}
                          </p>

                          <button
                            className="px-3 py-2 bg-amber-900 text-white font-bold rounded-md shadow-md hover:bg-amber-800 transition-colors flex items-center"
                            onClick={() => handleOpenVariationsModal(product)}
                          >
                            <MdOutlineFormatListBulleted size={16} className="inline mr-1" />
                            {product.variationPluralName}
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="mt-2 text-lg font-bold leading-none">
                            {showInBrazilianValue(product?.value ?? 0)}
                          </p>

                          <div
                            className="absolute bottom-3 right-3 flex gap-1 border border-amber-900 rounded-md overflow-hidden"
                            >
                            <button
                              className="flex items-center text-white font-bold justify-center w-9 bg-amber-900"
                              onClick={() => removeFromCart(product)}
                              >
                              -
                            </button>
                            <input
                              type="text"
                              value={
                                cart.items.find(cartItem => cartItem.id === product.id && cartItem.type == 'product')?.quantity || 0
                              }
                              disabled
                              className="w-8 text-center"
                            />
                            <button
                              className="flex items-center text-white font-bold justify-center w-9 py-2 bg-amber-900"
                              onClick={() => addToCart(product)}
                              >
                              <IoMdAdd size={18}/>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    {product.description && (
                      <div className="w-11/12 p-3 pt-0">
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}