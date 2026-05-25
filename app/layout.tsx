import type { Metadata } from "next";
import { Libre_Caslon_Text, JetBrains_Mono, Archivo_Narrow } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const caslon = Libre_Caslon_Text({
  weight: ["400", "700"],
  variable: "--font-caslon",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const archivo = Archivo_Narrow({
  weight: ["400", "600", "700"],
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zenith | Tactical Finance",
  description: "High-performance market terminal and liquidity engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${caslon.variable} ${jetbrains.variable} ${archivo.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
