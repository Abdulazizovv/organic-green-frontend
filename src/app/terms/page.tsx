import type { Metadata } from "next";
import TermsOfServiceContent from "./TermsOfServiceContent";

export const metadata: Metadata = {
  title: "Terms of Service | Organic Green Uzbekistan",
  description: "Terms of Service governing the use of Organic Green Uzbekistan website and services.",
  keywords: "terms of service, user agreement, website terms, conditions of use",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Service | Organic Green Uzbekistan",
    description: "Read our terms and conditions for using our website and services.",
    type: "website",
  },
};

export default function TermsOfServicePage() {
  return <TermsOfServiceContent />;
}