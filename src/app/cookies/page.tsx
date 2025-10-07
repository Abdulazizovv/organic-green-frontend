import type { Metadata } from "next";
import CookiePolicyContent from "./CookiePolicyContent";

export const metadata: Metadata = {
  title: "Cookie Policy | Organic Green Uzbekistan",
  description: "Learn about how we use cookies and similar technologies on our website to enhance your browsing experience.",
  keywords: "cookie policy, cookies, tracking, privacy, website data",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Cookie Policy | Organic Green Uzbekistan",
    description: "Understand our use of cookies and how to manage your preferences.",
    type: "website",
  },
};

export default function CookiePolicyPage() {
  return <CookiePolicyContent />;
}