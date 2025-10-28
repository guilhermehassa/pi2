import { ProductsProps } from "@/utils/types/products";
import {db} from "@/services/firebaseConnection";
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export async function products() {

  const productsRef = collection(db, `produtos`);
  const q = query(
    productsRef,
    orderBy('name', 'asc'),
  );

  try {
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map((doc) => {
      const data = doc.data();

      // Normalizar variations para garantir que 'image' seja URL
      const variations = data.variations?.map((variation: any) => ({
        id: variation.id,
        name: variation.name,
        value: variation.value,
        image: typeof variation.image === 'string' && variation.image.startsWith('data:') 
          ? null // Se for base64, retornar null
          : variation.image, // Se for URL, manter como está
      })) || [];

      return {
        id: doc.id,
        name: data.name,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
        description: data.description,
        variationPluralName: data.variationPluralName,
        variationSingularName: data.variationSingularName,
        hasVariations: data.hasVariations,
        variations: variations,
        value: data.value,
        status: data.status,
      }
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  // return [
  //   {
  //     id: '1',
  //     name: "Canelone",
  //     categoryId: "4",
  //     imageUrl: "https://placehold.co/600x400",
  //     variationPluralName: "Sabores",
  //     variationSingularName: "Sabor",
  //     description: "Massa fresca recheada com diversos sabores. Porção com 6 unidades.",
  //     hasVariations: true,
  //     variations: [
  //       {
  //         id: 1,
  //         name: "Presunto e Queijo",
  //         value: 38,
  //         image: "https://placehold.co/600x400"
  //       },
  //       {
  //         id: 2,
  //         name: "4 Queijos",
  //         value: 39.5
  //       },
  //       {
  //         id: 3,
  //         name: "Frango com Catupiry",
  //         value: 12
  //       },
  //       {
  //         id: 4,
  //         name: "Ricota",
  //         value: 58.25
  //       },
  //     ],
  //     status: true,
  //   },
  //   {
  //     id: '2',
  //     name: "Nhoque",
  //     categoryId: "4",
  //     imageUrl: "https://placehold.co/600x400",
  //     value: 26,
  //     description: "Nhoque de batata com molho de tomate caseiro. Porção de 500g.",
  //     status: true,
  //     hasVariations: false,
  //   },
  //   {
  //     id: '3',
  //     name: "Rondelli",
  //     categoryId: "4",
  //     imageUrl: "https://placehold.co/600x400",
  //     value: 26,
  //     status: true,
  //     hasVariations: false,
  //   },
  // ]
}

