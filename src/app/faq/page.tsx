import type { Metadata } from "next";
import FAQContent from "./FAQContent";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | Organic Green Uzbekistan",
  description: "Find answers to frequently asked questions about Organic Green Uzbekistan products, services, delivery, and more.",
  keywords: "FAQ, frequently asked questions, help, support, organic green uzbekistan",
  robots: { index: true, follow: true },
  openGraph: {
    title: "FAQ | Organic Green Uzbekistan",
    description: "Get answers to your questions about our organic products and services.",
    type: "website",
  },
};

export default function FAQPage() {
  return <FAQContent />;
}