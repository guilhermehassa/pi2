import { ProductsProps } from "@/utils/types/products"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/services/firebaseConnection";
import { AddressProps } from "@/utils/types/users";

// GENERAL FUNCTIONS

export function formatarEndereco(address: string | AddressProps): string {
  if (typeof address === 'string') {
    return address;
  }
  
  const { street, number, complement, neighborhood, city, state } = address;
  let enderecoFormatado = `${street}, ${number}`;
  
  if (complement) {
    enderecoFormatado += ` - ${complement}`;
  }
  
  enderecoFormatado += ` - ${neighborhood}, ${city}/${state}`;
  
  return enderecoFormatado;
}

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

// CART FUNCTIONS

export async function uploadImage(file: File, folder: string): Promise<string> {
  try {
    const storageRef = ref(storage, `${folder}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw error;
  }
}