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

import { useCart } from "@/contexts/CartContext"; 

export default function itemsList() {
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

  const [openVariations, setOpenVariations] = useState<{ [productId: string]: boolean }>({});
  const [fullImage, setFullImage] = useState<{ [productId: string]: boolean }>({});
  const [zIndexVariations, setZIndexVariations] = useState<{ [productId: string]: number }>({});
  const [zIndexFullImage, setZIndexFullImage] = useState<{ [productId: string]: number }>({});

  const toggleVariations = (productId: string) => {

    if(zIndexVariations[productId] === 101){
      setTimeout(() => {
        setZIndexVariations(prev => ({
          ...prev,
          [productId]: -1
        }));
      }, 350);
    }else{
      setZIndexVariations(prev => ({
        ...prev,
        [productId]: 101
      }));
    }
    
    setTimeout(() => {
      setOpenVariations(prev => ({
        ...prev,
        [productId]: !prev[productId]
      }));
    }, 100);
  };

  const toggleImage = (productId: string) => {
    if (fullImage[productId]) {
      setFullImage(prev => ({
        ...prev,
        [productId]: false
      }));
      setTimeout(() => {
        setZIndexFullImage(prev => ({
          ...prev,
          [productId]: -1
        }));
      }, 350);
    } else {
      setZIndexFullImage(prev => ({
        ...prev,
        [productId]: 101
      }));
      setTimeout(() => {
        setFullImage(prev => ({
          ...prev,
          [productId]: true
        }));
      }, 100);
    }
  };

  return (
    <div className="container mx-auto px-3 my-10 overflow-hidden">
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
                      onClick={() => toggleImage(product.id)}
                      >
                      {product.imageUrl ? (
                        <>
                          <Image
                            width="500"
                            height="500"
                            unoptimized={true}
                            src={product.imageUrl}
                            alt={product.name}
                            className="object-cover rounded-md h-full object-center"
                          />
                          <SlSizeFullscreen
                            size={24}
                            className="absolute bottom-3 right-3 text-white bg-amber-900 rounded-md p-1 cursor-pointer shadow-md"
                          />

                          <div
                            className="fixed top-0 left-0 flex w-full h-full justify-center items-center transition-opacity duration-300 "
                            style={{
                              background: 'rgba(0, 0, 0, 0.6)',
                              backdropFilter: 'blur(2px)',
                              opacity: fullImage[product.id] ? 1 : 0,
                              zIndex: zIndexFullImage[product.id] ?? -1
                            }}
                            >
                              <div className="container  m-3">
                                <button
                                  className="fixed z-40 top-3 right-3 text-white rounded-md aspect-square w-12 bg-red-500 hover:bg-red-800 transition-all flex justify-center items-center"
                                  onClick={() => toggleImage(product.id)}
                                  >
                                  X
                                </button>
                                <div className="relative w-full h-screen">
                                  <Image
                                    fill={true}
                                    unoptimized={true}
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                          </div>
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
                            onClick={() => toggleVariations(product.id)}
                            >
                            <MdOutlineFormatListBulleted size={16} className="inline mr-1" />
                            {product.variationPluralName}
                          </button>

                          <div
                            className="fixed top-0 left-0 flex w-full h-full justify-center items-center transition-opacity duration-300 "
                            style={{
                              background: 'rgba(0, 0, 0, 0.3)',
                              backdropFilter: 'blur(2px)',
                              opacity: openVariations[product.id] ? 1 : 0,
                              zIndex: zIndexVariations[product.id] ?? -1
                            }}
                            >
                              <div className="container m-3 bg-neutral-100 p-3 rounded-md shadow-lg relative">
                                <button
                                  className="absolute top-0 right-0 text-white rounded-tr-md rounded-bl-md aspect-square w-12 bg-red-800 hover:bg-red-500 transition-all flex justify-center items-center"
                                  onClick={() => toggleVariations(product.id)}
                                  >
                                  X
                                </button>
                                <h3 className="text-xl font-bold mb-3 text-amber-900">
                                  <span className="">{product.variationPluralName}</span>
                                </h3>
                                {product.variations!.map(variation => (
                                  <div key={variation.id} className="flex justify-between items-center not-last-of-type:border-b border-neutral-300 p-2">
                                    <div className="flex items-center gap-3">
                                      {variation.image && (
                                        <div className="relative h-16 w-16">
                                          <Image
                                            fill={true}
                                            unoptimized={true}
                                            src={variation.image}
                                            alt={variation.name}
                                            className="object-cover rounded-md"
                                          />
                                        </div>
                                      )}
                                      <span className="font-semibold">{variation.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="font-bold">{showInBrazilianValue(variation.value)}</span>
                                      <div
                                        className="flex gap-1 border border-amber-900 rounded-md overflow-hidden"
                                        >
                                        <button
                                          className="flex items-center text-white font-bold justify-center w-9 bg-amber-900"
                                          onClick={() => (removeVariationFromCart(product, variation.id))}
                                          >
                                          -
                                        </button>
                                        <input
                                          type="text"
                                          value={
                                            cart.items.find(cartItem => String(cartItem.id) === (`${product.id} - ${String(variation.id)}`) && cartItem.type == 'variation')?.quantity || 0
                                          }
                                          disabled
                                          className="w-8 text-center"
                                        />
                                        <button
                                          className="flex items-center text-white font-bold justify-center w-9 py-2 bg-amber-900"
                                          onClick={() => addVariationToCart({ ...product, quantity: 1 }, variation.id)}
                                          >
                                          <IoMdAdd size={18}/>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                          </div>
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