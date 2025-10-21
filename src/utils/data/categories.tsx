import { CategoriesProps } from "@/utils/types/categories";
import {db} from "@/services/firebaseConnection";
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export async function categories() {
  const categoriesRef = collection(db, `categorias`);
  const q = query(
    categoriesRef,
    orderBy('order', 'desc'),
  );

  try {
    const snapshot = await getDocs(q);
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      order: doc.data().order,
    }));

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
