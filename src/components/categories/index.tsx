"use client"
import { Swiper, SwiperSlide } from "swiper/react";

export default function Categories() {

  const categories = [
    { id: 1, name: "Categoria 1" },
    { id: 2, name: "Categoria 2" },
    { id: 3, name: "Categoria 3" },
    { id: 4, name: "Categoria 4" },
    { id: 5, name: "Categoria 5" },
    { id: 6, name: "Categoria 6" },
    { id: 7, name: "Categoria 7" },
    { id: 8, name: "Categoria 8" },
    { id: 9, name: "Categoria 9" },
    { id: 10, name: "Categoria 10" },
  ];
  return (
    <div className="container mx-auto px-3 my-10 overflow-hidden">
      <div className="flex justify-between items-center">
        <Swiper
          slidesPerView={"auto"}
          className="w-full"
          spaceBetween={15}
          style={{ overflow: 'visible' }}
          >
          {categories.map((category) => (
            <SwiperSlide
              key={category.id}
              className="bg-neutral-200 p-2 px-4 rounded-2xl w-fit shadow"
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