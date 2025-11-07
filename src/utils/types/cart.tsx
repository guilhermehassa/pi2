import { ProductsProps } from "@/utils/types/products";

export interface CartItem extends ProductsProps {
  quantity?: number;
  type?: 'product' | 'variation';
  productId?: string;
}

export interface CartProps {
  items: CartItem[];
  expiresAt: number; 
  createdAt?: string;
  status?: 'solicitado' | 'produzindo' | 'em entrega' | 'finalizado';
  userId?: string;
}
