import type { Metadata } from "next";

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
    <div>
      {children}
    </div>
  );
}
