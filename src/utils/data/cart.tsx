import { CartProps  } from "@/utils/types/cart";
import {db} from "@/services/firebaseConnection";
import { collection, query, orderBy, getDocs, addDoc } from 'firebase/firestore';

export async function registerOrder(cart: CartProps) {
  
  try {
    // Adiciona dados necessários ao pedido
    cart.createdAt = new Date().toISOString();
    cart.status = 'solicitado';
    
    // Verifica se o userId foi enviado
    if (!cart.userId) {
      throw new Error('ID do usuário não fornecido');
    }

    // Salva o pedido no banco
    const addedCart = await addDoc(collection(db, 'orders'), cart);
    return { Response: 'Success', cart: addedCart };

  } catch (error) {
    console.error('Erro ao concluir o pedido:', error);
    return null;
  }


}