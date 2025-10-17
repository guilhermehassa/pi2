import { FaCartShopping } from "react-icons/fa6";
import { getCart, addToCart, removeFromCart } from '@/utils/cart/cart';
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

export default function CartButton() {
  const { itemCount } = useCart(); 

  
  return (
    <div className="fixed bottom-4 right-4">
      {itemCount! >= 1 && (
        <Link href={'/cart'} className="bg-amber-900 text-white block p-4 rounded-full shadow-lg hover:bg-amber-800 transition">
          <FaCartShopping size={24} />
            <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
        </Link>
      )}
    </div>
  )
}