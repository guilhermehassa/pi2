"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { OpcaoEntrega } from '@/utils/types/delivery';
import { IoMdAdd } from 'react-icons/io';
import Image from 'next/image';
import { SlSizeFullscreen } from 'react-icons/sl';
import { showInBrazilianValue } from '@/utils/functions/functions';

export default function Cart() {
  // const router = useRouter();
  const { cart, cartTotal, addToCart, removeFromCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    deliveryMethod: '',
    observations: ''
  });

  const [fullImage, setFullImage] = useState<{ [productId: string]: boolean }>({});
  const [zIndexVariations, setZIndexVariations] = useState<{ [productId: string]: number }>({});
  const [zIndexFullImage, setZIndexFullImage] = useState<{ [productId: string]: number }>({});
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
  const [deliveries, setDeliveries] = useState<OpcaoEntrega[]>([]);
  const [categoryNames, setCategoryNames] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Carrega as opções de entrega
    fetch('/api/delivery')
      .then(response => response.json())
      .then(data => {
        setDeliveries(data);
      })
      .catch(error => {
        console.error('Erro ao carregar opções de entrega:', error);
      });

    // Carrega os nomes das categorias para os produtos no carrinho
    cart.items.forEach(product => {
      if (product.categoryId && !categoryNames[product.categoryId]) {
        fetch(`/api/category?id=${product.categoryId}`)
          .then(response => response.json())
          .then(data => {
            setCategoryNames(prev => ({
              ...prev,
              [product.categoryId]: data.name
            }));
          })
          .catch(error => {
            console.error('Erro ao carregar nome da categoria:', error);
          });
      }
    });
  }, [cart.items]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Será implementado na próxima etapa
    console.log('Dados do pedido:', { items: cart.items, ...formData, total: cartTotal });
  };

  function sumCarPlusDelivery() {
    const deliveryTax = parseFloat(formData.deliveryMethod || '0');
    const totalWithDelivery = (cartTotal || 0) + deliveryTax;
    return showInBrazilianValue(totalWithDelivery);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lista de Itens */}
        <div className="space-y-4">
          {cart.items.map((product) => (
            <div key={`${product.id}-${product.type}`} className="flex items-center justify-between p-4 bg-white rounded-lg shadow relative">
              <div className="flex items-center space-x-4">
                <div className="relative w-4/12 p-3 aspect-square cursor-pointer">
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
                <div>
                  <h3 className="font-semibold">({categoryNames[product.categoryId] || 'Carregando...'}) | {product.name}</h3>
                  <p className="text-gray-600">{showInBrazilianValue(product.value!)}</p>
                </div>
              </div>
              
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
            </div>
          ))}
          
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <p className="text-xl font-bold">
              Total: {showInBrazilianValue(cartTotal!)}
            </p>
          </div>
        </div>

        {/* Formulário de Dados */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Dados para Entrega</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-1"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Endereço
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-1"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-1"
              />
            </div>

            <div>
              <label htmlFor="deliveryMethod" className="block text-sm font-medium text-gray-700">
                Método de Entrega
              </label>
              <select
                id="deliveryMethod"
                name="deliveryMethod"
                value={formData.deliveryMethod}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    deliveryMethod: e.target.value
                  }))
                }
                required
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Selecione um método de entrega</option>
                {deliveries && 
                  deliveries.map((option) => (
                    <option key={option.id} value={option.taxa}>
                      {option.nome} - {showInBrazilianValue(option.taxa)} ({option.tempoEstimado})
                    </option>
                  ))
                }
              </select>
            </div>

            <div>
              <label htmlFor="observations" className="block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm  resize-none p-2"
              />
            </div>
            
            <span className="text-xl font-bold my-4 block">
              Total com Entrega: {sumCarPlusDelivery()}
            </span>

            <button
              type="submit"
              className="w-full bg-amber-900 text-white py-2 px-4 rounded-md hover:bg-amber-800"
            >
              Fazer Pedido
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
