import type { Metadata } from "next";
import ReturnsRefundContent from "./ReturnsRefundContent";

export const metadata: Metadata = {
  title: "Returns & Refunds Policy | Organic Green Uzbekistan",
  description: "Learn about our return and refund policy for organic products. Easy returns, full refunds, and customer satisfaction guaranteed.",
  keywords: "returns, refunds, return policy, money back guarantee, customer satisfaction",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Returns & Refunds | Organic Green Uzbekistan",
    description: "Hassle-free returns and refunds for organic products with customer satisfaction guarantee.",
    type: "website",
  },
};

export default function ReturnsRefundPage() {
  return <ReturnsRefundContent />;
}