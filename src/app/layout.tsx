import type { Metadata } from "next";
import { Epilogue } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Painel de Jornada do Cliente — Agência Rei",
  description: "Painel de análise de funil de e-commerce - Meta Ads",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${epilogue.className} antialiased bg-slate-50 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
