import { db } from "@/services/firebaseConnection";
import { collection, getDocs } from "firebase/firestore";
import { OrderProps } from "../types/orders";

export async function orders() {
  const ordersRef = collection(db, "carts");
  const snapshot = await getDocs(ordersRef);
  
  const ordersList = snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    } as OrderProps;
  });

  return ordersList;
}