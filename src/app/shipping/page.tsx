import type { Metadata } from "next";
import ShippingPolicyContent from "./ShippingPolicyContent";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Organic Green Uzbekistan",
  description: "Learn about our shipping and delivery policies, rates, timeframes, and coverage areas for organic products.",
  keywords: "shipping, delivery, shipping policy, delivery rates, organic products delivery",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Shipping & Delivery | Organic Green Uzbekistan",
    description: "Fast and reliable delivery of organic products across Uzbekistan.",
    type: "website",
  },
};

export default function ShippingPolicyPage() {
  return <ShippingPolicyContent />;
}