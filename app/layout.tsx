import type { Metadata } from "next";
import { Rubik, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jastip Nces Dong",
    template: "%s | Jastip Nces Dong",
  },
  description:
    "Katalog barang jastip dari luar negeri. Pesan lewat WhatsApp, mudah dan aman.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${rubik.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-brand-blue font-body">
        <Suspense fallback={<div className="h-20 bg-white border-b-2 border-brand-blue" />}>
          <Navbar />
        </Suspense>
        <main className="w-full pt-20 flex-1 bg-white">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
