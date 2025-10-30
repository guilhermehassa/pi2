import {db} from "@/services/firebaseConnection";
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export async function deliveries() {
  const deliveriesRef = collection(db, `entregas`);
  const q = query(
    deliveriesRef,
  );

  try {
    const snapshot = await getDocs(q);
    const deliveries = snapshot.docs.map((doc) => ({
      id: doc.id,
      nome: doc.data().nome,
      status: doc.data().status,
      taxa: doc.data().taxa,
      tempoEstimado: doc.data().tempoEstimado,
    }));

    return deliveries;
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    return [];
  }
}
