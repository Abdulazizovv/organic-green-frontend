import type { Metadata } from "next";
import WarrantyPolicyContent from "./WarrantyPolicyContent";

export const metadata: Metadata = {
  title: "Product Warranty & Quality Guarantee | Organic Green Uzbekistan",
  description: "Learn about our product warranty, quality guarantees, and replacement policies for organic products and microgreens.",
  keywords: "warranty, quality guarantee, product warranty, organic certification, quality assurance",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Product Warranty | Organic Green Uzbekistan",
    description: "Comprehensive warranty and quality guarantee for all organic products and microgreens.",
    type: "website",
  },
};

export default function WarrantyPolicyPage() {
  return <WarrantyPolicyContent />;
}