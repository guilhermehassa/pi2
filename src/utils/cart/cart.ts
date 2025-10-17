import { ProductsProps } from "@/utils/types/products";
import { CartProps, CartItem } from "@/utils/types/cart";

const CART_KEY = 'shopping-cart';
const EXPIRATION_TIME = 12 * 60 * 60 * 1000; 

export const getCart = (): CartProps => {
  // Verifica se estamos no navegador
  if (typeof window === 'undefined') {
    return { items: [], expiresAt: 0 };
  }
  
  const cartData = localStorage.getItem(CART_KEY);
  
  if (!cartData) {
    // Cria um novo carrinho e salva no localStorage
    const newCart: CartProps = { items: [], expiresAt: Date.now() + EXPIRATION_TIME };
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
    return newCart;
  }
  
  const cart: CartProps = JSON.parse(cartData);
  
  if (cart.expiresAt < Date.now()) {
    // Remove o carrinho expirado e cria um novo
    localStorage.removeItem(CART_KEY);
    const newCart: CartProps = { items: [], expiresAt: Date.now() + EXPIRATION_TIME };
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
    return newCart;
  }
  
  return cart;
};

const saveCart = (cart: CartProps): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
};

export const clearCart = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CART_KEY);
  }
};

export const addToCart = (item: CartItem): void => {
  const currentCart = getCart();
  // Pesquisa e obtem o index do item no carrinho baseado no id e type
  const existingItemIndex = currentCart.items.findIndex(currentProduct => currentProduct.id === item.id && currentProduct.type === item.type);
  
  if (existingItemIndex > -1) {
    // Atualiza a quantidade se o item já existir
    currentCart.items[existingItemIndex].quantity! += 1;
    
  } else {
    // Adiciona novo item
    item.quantity = 1;
    currentCart.items.push(item);
  }
  
  saveCart(currentCart);
};

export const removeFromCart = (item: CartItem): void => {
  const currentCart = getCart();

   // Pesquisa e obtem o index do item no carrinho baseado no id e type
  const existingItemIndex = currentCart.items.findIndex(currentProduct => currentProduct.id === item.id && currentProduct.type === item.type);
  
  if (existingItemIndex > -1) {
    if (currentCart.items[existingItemIndex].quantity && currentCart.items[existingItemIndex].quantity > 1) {
      currentCart.items[existingItemIndex].quantity -= 1;
    } else {
      currentCart.items.splice(existingItemIndex, 1);
    }
  }
  saveCart(currentCart);
};

  

  // export const getCartItemCount = (): number => {
  //   const cart = getCart();
  //   return cart.items.reduce((count, item) => count + item.quantity, 0);
  // };

  // export const getCartTotal = (): number => {
  //   const cart = getCart();
  //   return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  // };