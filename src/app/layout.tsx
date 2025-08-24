import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Organic Green Uzbekistan - Микрозелень ва табиий маҳсулотлар",
  description: "Ўзбекистонда микрозелень бўйича етакчи компания. Табиий ва органик маҳсулотлар, франшиза, таълим дастурлари.",
  keywords: "микрозелень, органик, табиий маҳсулотлар, франшиза, Ўзбекистон, соғлом овқатланиш",
  authors: [{ name: "Organic Green Uzbekistan" }],
  creator: "Organic Green Uzbekistan",
  publisher: "Organic Green Uzbekistan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://organicgreen.uz"),
  alternates: {
    canonical: "/",
    languages: {
      "uz-UZ": "/uz",
      "ru-RU": "/ru", 
      "en-US": "/en",
    },
  },
  openGraph: {
    title: "Organic Green Uzbekistan - Микрозелень ва табиий маҳсулотлар",
    description: "Ўзбекистонда микрозелень бўйича етакчи компания. Табиий ва органик маҳсулотлар, франшиза, таълим дастурлари.",
    url: "https://organicgreen.uz",
    siteName: "Organic Green Uzbekistan",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Organic Green Uzbekistan",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Organic Green Uzbekistan - Микрозелень ва табиий маҳсулотлар",
    description: "Ўзбекистонда микрозелень бўйича етакчи компания. Табиий ва органик маҳсулотлар, франшиза, таълим дастурлари.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
