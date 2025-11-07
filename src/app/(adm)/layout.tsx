
import type { Metadata } from "next";
import CheckLoggedInUser from "./components/checkloggedinuser";

export const metadata: Metadata = {
  title: "Painel Administração - Rayolli Rotisserie",
  description: "Área de administração do cardapio digital da Rayolli Rotisserie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CheckLoggedInUser>
      <div>
        {children}
      </div>
    </CheckLoggedInUser>
  );
}
