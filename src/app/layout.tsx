import type { Metadata } from "next";
import { Outfit, Reenie_Beanie } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { GrainOverlay } from "@/components/grain-overlay";
import { AmbientBackground } from "@/components/ambient-background";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const reenieBeanie = Reenie_Beanie({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-reenie-beanie",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gagan Electronics Lab | Industrial 3D Printing & Functional Prototyping",
  description:
    "Professional 3D printing services for electronic enclosures, functional mechanical prototypes, and custom tooling in FDM, MSLA Resin, and Carbon-Fiber composites. Fast quotation with STL, PDF, and Google Drive submissions.",
  keywords: [
    "3D printing India",
    "FDM 3D printing",
    "Resin 3D printing",
    "Carbon fiber nylon 3D printing",
    "electronic enclosures",
    "prototyping lab",
    "Gagan Electronics Lab",
    "custom CAD quotation",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gaganelectronicslab.com"),
  openGraph: {
    title: "Gagan Electronics Lab | Industrial 3D Printing & Prototyping",
    description:
      "Precision 3D printing for engineering prototypes, custom parts, and electronics enclosures. Upload your CAD or STL files for a quick quote.",
    type: "website",
    locale: "en_IN",
    siteName: "Gagan Electronics Lab",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${reenieBeanie.variable}`}>
      <body className="font-sans antialiased bg-[#FDFCF8] text-[#292524] selection:bg-coral-200 selection:text-stone-900">
        <GrainOverlay />
        <AmbientBackground />
        <div className="relative z-10 flex min-h-screen flex-col justify-between">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
