import type { Metadata } from "next";
import Header from "@/components/header";
import { CartProvider } from "@/contexts/CartContext";

export const metadata: Metadata = {
  title: "Cardapio Digital - Rayolli Rotisserie",
  description: "Cardapio digital da Rayolli Rotisserie",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="mt-[120px] min-h-[calc(100vh-120px)]">
        <CartProvider>
          {children}
        </CartProvider>
      </div>
    </>
  );
}
