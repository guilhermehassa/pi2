import Image from "next/image";
import NavContainer from "./navContainer";
import Link from "next/link";

export default function Header(){

  return (
    <header className="w-full bg-neutral-300 py-3 shadow-md h-[85px] fixed top-0 z-50">
      <div className="container mx-auto px-3">
        <div className="flex justify-between items-center">
          <div className="w-9/12 lg:w-1/12">
            <Link href="/">
              <h1 title={process.env.STORE_NAME}>
                <Image
                  src="/logo.webp"
                  width={60}
                  height={60}
                  className="shadow-lg rounded-full scale-[1.6] translate-x-[30%] translate-y-[30%] relative z-100"
                  alt={process.env.STORE_NAME || "Logo"}
                />
              </h1>   
            </Link>
          </div>
          <div className="w-2/12 lg:w-11/12">
            <div className="flex justify-end">
              <NavContainer />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}