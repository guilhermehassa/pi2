import { ProductsProps } from "@/utils/types/products";

export const products: ProductsProps[] = [
  // Categoria 1
  {
    id: 1,
    name: "Canelone",
    categoryId: 4,
    imageUrl: "https://placehold.co/600x400",
    variationPluralName: "Sabores",
    variationSingularName: "Sabor",
    description: "Massa fresca recheada com diversos sabores. Porção com 6 unidades.",
    variations: [
      {
        id: 1,
        name: "Presunto e Queijo",
        value: 38,
        image: "https://placehold.co/600x400"
      },
      {
        id: 2,
        name: "4 Queijos",
        value: 39.5
      },
      {
        id: 3,
        name: "Frango com Catupiry",
        value: 12
      },
      {
        id: 4,
        name: "Ricota",
        value: 58.25
      },
    ]
  },
  {
    id: 2,
    name: "Nhoque",
    categoryId: 4,
    imageUrl: "https://placehold.co/600x400",
    value: 26,
    description: "Nhoque de batata com molho de tomate caseiro. Porção de 500g."
  },
  {
    id: 3,
    name: "Rondelli",
    categoryId: 4,
    imageUrl: "https://placehold.co/600x400",
    value: 26,
  },
];

