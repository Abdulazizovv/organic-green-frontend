"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/language";

const footerLinks = {
  company: [
    { href: "/about", key: "about" },
    { href: "/franchise", key: "franchise" },
    { href: "/education", key: "education" },
    { href: "/blog", key: "blog" },
    { href: "/contact", key: "contact" },
  ],
  products: [
    { href: "/products?category=microgreens", key: "microgreens" },
    { href: "/products?category=powders", key: "powders" },
    { href: "/products?category=supplements", key: "supplements" },
    { href: "/products?category=kits", key: "kits" },
  ],
  support: [
    { href: "/shipping", key: "shipping" },
    { href: "/payment", key: "payment" },
    { href: "/returns", key: "returns" },
    { href: "/warranty", key: "warranty" },
    { href: "/faq", key: "faq" },
  ],
};

const socialLinks = [
  { href: "https://t.me/organicgreen_uz", icon: Send, label: "Telegram" },
  { href: "https://instagram.com/organicgreen_uz", icon: Instagram, label: "Instagram" },
  { href: "https://facebook.com/organicgreen_uz", icon: Facebook, label: "Facebook" },
  { href: "https://youtube.com/@organicgreen_uz", icon: Youtube, label: "YouTube" },
];

const contactInfo = [
  {
    icon: Phone,
    titleKey: "footer.contact.phone",
    details: ["+998 90 123 45 67", "+998 91 234 56 78"],
  },
  {
    icon: Mail,
    titleKey: "footer.contact.email",
    details: ["info@organicgreen.uz", "sales@organicgreen.uz"],
  },
  {
    icon: MapPin,
    titleKey: "footer.contact.address",
    details: ["Тошкент, Чилонзор тумани", "Фарғона, Қўқон шаҳри"],
  },
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4 font-heading">
              {t('footer.newsletter.title')}
            </h3>
            <p className="text-gray-300 mb-6">
              {t('footer.newsletter.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button variant="default" className="whitespace-nowrap">
                {t('footer.newsletter.subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-organic-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">OG</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-heading">
                  Organic Green
                </span>
                <span className="text-sm text-organic-green-400 font-medium">
                  Uzbekistan
                </span>
              </div>
            </Link>
            
            <p className="text-gray-300 mb-6 max-w-md">
              {t('footer.company.description')}
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-organic-green-600 transition-colors group"
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-heading">{t('footer.sections.company')}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-organic-green-400 transition-colors"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-heading">{t('footer.sections.products')}</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-organic-green-400 transition-colors"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-heading">{t('footer.sections.support')}</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-organic-green-400 transition-colors"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((contact) => (
              <div key={contact.titleKey} className="flex items-start space-x-3">
                <contact.icon className="w-5 h-5 text-organic-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold mb-1">{t(contact.titleKey)}</h5>
                  {contact.details.map((detail, index) => (
                    <p key={index} className="text-gray-300 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-organic-green-400 transition-colors">
                {t('footer.links.privacy')}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-organic-green-400 transition-colors">
                {t('footer.links.terms')}
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-organic-green-400 transition-colors">
                {t('footer.links.cookies')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
