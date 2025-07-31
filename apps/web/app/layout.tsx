import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const outfit = localFont({
  src: "../public/fonts/Outfit.ttf",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Check Mole",
  description: "Detect skin cancer early",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable}`}>
        <Navbar />
        <main className="flex flex-col items-center justify-center w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
