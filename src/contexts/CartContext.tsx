"use client";

import { CartProps, CartItem } from "@/utils/types/cart";
import { OpcaoEntrega } from "@/utils/types/delivery";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCart, addToCart, removeFromCart } from '@/utils/cart/cart';
import CartButton from "@/components/cartButton";

interface CartContextType {
  cart: CartProps;
  cartTotal?: number;
  itemCount?: number;
  deliveryMethod?: OpcaoEntrega;
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  addVariationToCart: (product: CartItem, variationId: number) => void;
  removeVariationFromCart: (product: CartItem, variationId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartProps>({ items: [], expiresAt: 0 });
  const [itemCount, setItemCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Carrega o carrinho do localStorage quando o componente é montado
  useEffect(() => {
    const loadedCart = getCart();
    const count = loadedCart.items.reduce((sum, cartItem) => sum + cartItem.quantity!, 0);
    setItemCount(count);
    const total = loadedCart.items.reduce((sum, cartItem) => sum + ((cartItem.value || 0) * cartItem.quantity!), 0);
    setCartTotal(total);

    // SetCart Salva o carrinho no estado
    setCart(loadedCart);
  }, []);

  const handleAddToCart = (item: CartItem) => {
    
    // Se chegar até aqui sem um type definido significa que não é uma variação
    if(!item.type) {
      item.type = 'product';
    }
    // Atualiza o carrinho no localStorage
    addToCart(item);
    let updatedCart = getCart();

    // Atualiza o total de itens e o valor total 
    const count = updatedCart.items.reduce((sum, cartItem) => sum + cartItem.quantity!, 0);
    setItemCount(count);
    const total = updatedCart.items.reduce((sum, cartItem) => sum + ((cartItem.value || 0) * cartItem.quantity!), 0);
    setCartTotal(total);

    // Atualiza o useState do carrinho
    setCart(updatedCart);
  };

  const handleRemoveFromCart = (item: CartItem) => {
    // Se chegar até aqui sem um type definido significa que é um produto direto (não variação)
    if(!item.type) {
      item.type = 'product';
    }

    // Atualiza o carrinho no localStorage
    removeFromCart(item);

    let updatedCart = getCart();
    
    const count = updatedCart.items.reduce((sum, cartItem) => sum + cartItem.quantity!, 0);
    setItemCount(count);

    const total = updatedCart.items.reduce((sum, cartItem) => sum + ((cartItem.value || 0) * cartItem.quantity!), 0);
    setCartTotal(total);

    // Atualiza o useState do carrinho
    setCart(updatedCart);
  };

  const handleAddVariationToCart = (product: CartItem, variationId: number) => {
    const variation = product.variations?.find(v => v.id === variationId);
    if (variation) {
      handleAddToCart({
        id: `${product.id} - ${variation.id.toString()}`,
        productId: product.id,
        type: 'variation',
        name: `${product.name} - ${variation.name}`,
        categoryId: product.categoryId,
        imageUrl: variation.image || product.imageUrl,
        value: variation.value,
        quantity: 1,
        description: product.description,
        hasVariations: product.hasVariations,
        status: product.status
      });
    }
  };

  const handleRemoveVariationFromCart = (product: CartItem, variationId: number) => {
    const variation = product.variations?.find(v => v.id === variationId);
    
    if (variation) {
      handleRemoveFromCart({
        id: variation.id.toString(),
        productId: product.id,
        type: 'variation',
        name: `${product.name} - ${variation.name}`,
        categoryId: product.categoryId,
        imageUrl: variation.image || product.imageUrl,
        value: variation.value,
        quantity: 1,
        description: product.description,
        hasVariations: product.hasVariations,
        status: product.status
      });
    }

  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart: handleAddToCart,
      removeFromCart: handleRemoveFromCart,
      addVariationToCart: handleAddVariationToCart,
      removeVariationFromCart: handleRemoveVariationFromCart,
      itemCount,
      cartTotal
    }}>
      {children}
      <CartButton />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};