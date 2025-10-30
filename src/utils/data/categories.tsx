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

export async function getCategoryNameById(categoryId: string): Promise<string | null> {
  const categoriesRef = collection(db, 'categorias');
  const q = query(
    categoriesRef,
    orderBy('order', 'desc'),
  );
  try {
    const snapshot = await getDocs(q);
    for (const doc of snapshot.docs) {
      if (doc.id === categoryId) {
        return doc.data().name || null;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching category name:', error);
    return null;
  }
}
