export interface ProductsProps {
  id: number,
  name: string,
  categoryId: number,
  imageUrl: string,
  description?: string,
  variationPluralName?: string,
  variationSingularName?: string,
  variations?: {
    id: number,
    name: string,
    value: number,
    image?: string
  }[],
  value?: number
}