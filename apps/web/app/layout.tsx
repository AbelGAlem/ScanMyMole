import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
