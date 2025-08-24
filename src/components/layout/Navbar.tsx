"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, Globe, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Бош саҳифа", labelEn: "Home", labelRu: "Главная" },
  { href: "/about", label: "Биз ҳақимизда", labelEn: "About", labelRu: "О нас" },
  { href: "/products", label: "Маҳсулотлар", labelEn: "Products", labelRu: "Продукты" },
  { href: "/franchise", label: "Франшиза", labelEn: "Franchise", labelRu: "Франшиза" },
  { href: "/education", label: "Таълим", labelEn: "Education", labelRu: "Образование" },
  { href: "/blog", label: "Янгиликлар", labelEn: "News", labelRu: "Новости" },
  { href: "/contact", label: "Алоқа", labelEn: "Contact", labelRu: "Контакты" },
];

const languages = [
  { code: "uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("uz");

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleLangMenu = () => setIsLangOpen(!isLangOpen);

  const getCurrentNavItems = () => {
    switch (currentLang) {
      case "en":
        return navItems.map(item => ({ ...item, label: item.labelEn }));
      case "ru":
        return navItems.map(item => ({ ...item, label: item.labelRu }));
      default:
        return navItems;
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity group">
            <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-2xl font-heading">OG</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 font-heading leading-tight">
                Organic Green
              </span>
              <span className="text-sm text-green-600 font-medium leading-tight tracking-wide">
                Uzbekistan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {getCurrentNavItems().map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 relative group px-4 py-2 rounded-lg hover:bg-green-50"
              >
                {item.label}
                <span className="absolute inset-x-0 -bottom-2 h-1 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center rounded-full"></span>
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLangMenu}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-green-50 transition-colors border border-transparent hover:border-green-200"
              >
                <Globe className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  {languages.find(lang => lang.code === currentLang)?.flag}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-green-100 py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex items-center space-x-3 rounded-lg mx-1",
                        currentLang === lang.code && "bg-green-50 text-green-600 font-medium"
                      )}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link 
              href="/cart"
              className="relative p-3 rounded-xl hover:bg-green-50 transition-colors border border-transparent hover:border-green-200 group"
            >
              <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-green-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                3
              </span>
            </Link>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 font-medium rounded-xl px-6"
              >
                Телеграм бот
              </Button>
              <Button 
                variant="default" 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 font-medium rounded-xl px-6"
              >
                Харид қилиш
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-3 rounded-xl hover:bg-green-50 transition-colors border border-transparent hover:border-green-200"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-green-100 bg-white shadow-xl">
          <div className="container py-8">
            <div className="flex flex-col space-y-6">
              {getCurrentNavItems().map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors py-4 px-4 rounded-xl hover:bg-green-50 border border-transparent hover:border-green-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-6 border-t border-green-100">
                <div className="flex flex-col space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-700">Тил / Language</span>
                    <div className="flex items-center space-x-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setCurrentLang(lang.code)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-base transition-colors border",
                            currentLang === lang.code 
                              ? "bg-green-100 text-green-600 border-green-200" 
                              : "hover:bg-gray-100 border-transparent"
                          )}
                        >
                          {lang.flag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Cart */}
                  <Link 
                    href="/cart"
                    className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-green-50 border border-transparent hover:border-green-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-gray-700 font-medium">Харид савати</span>
                    <div className="relative">
                      <ShoppingBag className="w-5 h-5 text-gray-700" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        3
                      </span>
                    </div>
                  </Link>
                  
                  <div className="flex flex-col space-y-4">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full border-green-200 text-green-700 hover:bg-green-50 font-medium rounded-xl py-4"
                    >
                      Телеграм бот
                    </Button>
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 font-medium rounded-xl py-4"
                    >
                      Харид қилиш
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
 
export default Navbar;
