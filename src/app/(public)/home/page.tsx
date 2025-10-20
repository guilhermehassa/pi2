import "swiper/css";
import CategoriesSwiper from "@/components/categories";
import ItemsList from "@/components/itemsList";
import { CartProvider } from "@/contexts/CartContext";

export default function Home() {

  return (
    <>
      <CategoriesSwiper />
      <CartProvider>
        <ItemsList />

      </CartProvider>
    </>
  )
}