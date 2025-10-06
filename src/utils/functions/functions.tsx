import { ProductsProps } from "@/utils/types/products"; 

export function showInBrazilianValue(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function getCheaperVariation(product: ProductsProps) {
  if (!product.variations || product.variations.length === 0) {
    return product.value ?? 0;
  }
  const cheaperVariation = product.variations.reduce((cheaper, variation) => {
    return variation.value < cheaper.value ? variation : cheaper;
  }, product.variations[0]);

  return showInBrazilianValue(cheaperVariation.value);
}