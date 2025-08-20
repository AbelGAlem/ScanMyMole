import { Analytics } from '@vercel/analytics/next';
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const outfit = localFont({
  src: "../public/fonts/Outfit.ttf",
  variable: "--font-outfit",
});

export const metadata = {
  metadataBase: new URL("https://scanmymole.vercel.app"),
  title: "ScanMyMole",
  description: "AI-powered skin lesion analysis for early detection support.",
  openGraph: {
    type: "website",
    url: "https://scanmymole.vercel.app/",
    title: "ScanMyMole",
    description: "AI-powered skin lesion analysis for early detection support.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ScanMyMole preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ScanMyMole",
    description: "AI-powered skin lesion analysis for early detection support.",
    images: ["/og.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} bg-[#f7f7f7]`}>
        <Analytics />
        <Navbar />
        <main className="flex flex-col items-center justify-center w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
