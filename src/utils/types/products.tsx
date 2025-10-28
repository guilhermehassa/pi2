export interface ProductsProps {
  id: string,
  name: string,
  categoryId: string,
  imageUrl: string,
  description?: string,
  variationPluralName?: string,
  variationSingularName?: string,
  hasVariations: boolean, // Valor padrão será atribuído ao criar o objeto
  variations?: {
    id: number,
    name: string,
    image?: string
    value: number,
  }[],
  value?: number,
  status: boolean,
}

export const defaultProduct: ProductsProps = {
  id: "1",
  name: "",
  categoryId: "1",
  imageUrl: "",
  hasVariations: false, 
  status: true,
};

export const defaultVariation = {
  id: 1,
  name: "",
  value: 1,
};