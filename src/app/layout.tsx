import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Fit Quest",
  description: "A modern RPG fitness and habit tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-slate-950 text-slate-50`}
      >
        <GameProvider>
          <Navbar />
          <main className="flex-1 container mx-auto p-4 md:p-8 max-w-5xl">
            {children}
          </main>
        </GameProvider>
      </body>
    </html>
  );
}
