"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import { categories } from "@/utils/data/categories";
import "./categories.css"; 
import { useEffect, useState } from "react";
import { CategoriesProps } from "@/utils/types/categories";

export default function categoriesSwiper() {
  const [categorias, setCategorias] = useState<CategoriesProps[]>([]);
  

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      const fetchedCategories = await categories();
      setCategorias(fetchedCategories);
    }

    fetchCategories();
  }, []);
  
  return (
    <div className="container mx-auto px-3 my-10 overflow-hidden">
      <div className="flex justify-between items-center">
        <Swiper
          slidesPerView={"auto"}
          className="w-full"
          spaceBetween={15}
          style={{ overflow: 'visible' }}
          >
          {[...categorias]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((category) => (
            <SwiperSlide
              key={category.id}
              className="bg-neutral-200 p-2 px-4 rounded-2xl shadow custom-swiper-slide"
              style={{width:'fit-content !important'}}
              >
              <a href={`#category-${category.id}`} className="text-red-900 font-medium whitespace-nowrap">
                {category.name}
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </div>
  )
}