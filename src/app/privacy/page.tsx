import type { Metadata } from "next";
import PrivacyPolicyContent from "./PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Organic Green Uzbekistan",
  description: "Privacy Policy for Organic Green Uzbekistan explaining how we collect, use, and protect your personal information.",
  keywords: "privacy policy, data protection, personal information, cookies, GDPR compliance",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy | Organic Green Uzbekistan",
    description: "Learn how we protect your privacy and handle your personal data.",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}