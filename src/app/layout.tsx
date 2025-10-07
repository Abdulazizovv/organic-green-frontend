import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { NavbarSpacer } from "@/components/layout/NavbarSpacer";
import { Footer } from "@/components/layout/Footer";
import { LanguageProvider } from "@/lib/language";
import { AuthProvider } from "@/lib/authContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";

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
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: [
      { url: '/favicon/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/favicon/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/favicon/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/favicon/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/favicon/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/favicon/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/favicon/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/favicon/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/favicon/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/favicon/apple-icon-precomposed.png',
      },
    ],
  },
  manifest: '/favicon/manifest.json',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://api.organicgreen.uz"),
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
    url: "https://api.organicgreen.uz",
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
      <head>
        <meta name="msapplication-TileColor" content="#22c55e" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#22c55e" />
        {/* Google AdSense account meta tag */}
        <meta name="google-adsense-account" content="ca-pub-3735738350705166" />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <Navbar />
                <NavbarSpacer />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
