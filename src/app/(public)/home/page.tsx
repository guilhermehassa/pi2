import "swiper/css";
import CategoriesSwiper from "@/components/categories";
import ItemsList from "@/components/itemsList";

export default function Home() {

  return (
    <>
      <CategoriesSwiper />
      <ItemsList />
    </>
  )
}