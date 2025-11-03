import { NextResponse } from 'next/server';
import { registerOrder } from '@/utils/data/cart';

export async function POST(request: Request) {
  const cart = await request.json();

  if(!cart) {
    return NextResponse.json({ error: 'Erro ao receber dados do carrinho' }, { status: 400 });
  }

  if(!cart.items || cart.items.length === 0) {
    return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
  }

  if(!cart.deliveryMethod) {
    return NextResponse.json({ error: 'Método de entrega não especificado' }, { status: 400 });
  }

  if(!cart.expiresAt || cart.expiresAt < Date.now()) {
    return NextResponse.json({ error: 'Carrinho expirado' }, { status: 400 });
  }
 
  try {
   const addedCart = await registerOrder(cart);
   if(!addedCart) {
    return NextResponse.json({ error: 'Erro ao registrar carrinho' }, { status: 500 });
   }
    return NextResponse.json({ cart: addedCart }); 
  } catch (error) {
    return NextResponse.json({ error: 'Failed to register cart' }, { status: 500 });
  }

}