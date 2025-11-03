import { CartProps  } from "@/utils/types/cart";
import {db} from "@/services/firebaseConnection";
import { collection, query, orderBy, getDocs, addDoc } from 'firebase/firestore';

export async function registerOrder(cart: CartProps) {
  
  try{
    const addedCart = await addDoc(collection(db, 'carts'), cart);
    return { Response: 'Success', cart: addedCart };

  } catch (error) {
    console.error('Erro ao concluir o pedido:', error);
    return null;
  }


}