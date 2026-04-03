import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import Navbar from "@/components/Navbar";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "Fit Fantasy VI",
  description: "A 16-bit RPG fitness and habit tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.variable} antialiased min-h-screen flex flex-col`}
      >
        <GameProvider>
          <Navbar />
          <main className="flex-1 container mx-auto p-4 md:p-8">
            {children}
          </main>
        </GameProvider>
      </body>
    </html>
  );
}
