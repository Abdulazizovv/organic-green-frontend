import type { Metadata } from "next";
import PaymentPolicyContent from "./PaymentPolicyContent";

export const metadata: Metadata = {
  title: "Payment Methods & Security | Organic Green Uzbekistan",
  description: "Secure payment options for organic products. Learn about our payment methods, security measures, and billing information.",
  keywords: "payment methods, secure payment, billing, payment security, online payment",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Payment Methods | Organic Green Uzbekistan",
    description: "Safe and secure payment options for your organic product orders.",
    type: "website",
  },
};

export default function PaymentPolicyPage() {
  return <PaymentPolicyContent />;
}