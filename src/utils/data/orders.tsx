import { db } from "@/services/firebaseConnection";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { OrderProps } from "../types/orders";

export async function orders() {
  const ordersRef = collection(db, "orders");
  const snapshot = await getDocs(ordersRef);
  
  const ordersList = snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    } as OrderProps;
  });

  return ordersList;
}

export async function getUserOrders(userId: string) {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    const ordersList = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      } as OrderProps;
    });

    return ordersList;
  } catch (error) {
    console.error("Erro ao buscar pedidos do usuário:", error);
    return [];
  }
}