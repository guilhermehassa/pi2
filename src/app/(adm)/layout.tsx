
import type { Metadata } from "next";
import CheckLoggedInUser from "./components/checkloggedinuser";
import AdminHeader from "./components/adminHeader";

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
      <div className="min-h-screen flex flex-col">
        <AdminHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </CheckLoggedInUser>
  );
}
