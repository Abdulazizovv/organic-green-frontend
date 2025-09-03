"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Globe, ShoppingBag, User, LogOut, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCategories } from "@/lib/hooks";
import { useLanguage, getLocalizedName, type Language } from "@/lib/language";
import { useAuth } from "@/lib/authContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/hooks/useFavorites";

const navItems = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/products", key: "products" },
  { href: "/franchise", key: "franchise" },
  { href: "/education", key: "education" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
];

const languages = [
  { code: "uz", label: "Ўзбек", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Get language context
  const { language, setLanguage, t } = useLanguage();
  
  // Get auth context
  const { user, isAuthenticated, logout } = useAuth();
  
  // Get cart context
  const { getTotalItems } = useCart();
  
  // Get favorites
  const { favoriteStates } = useFavorites();
  const favoritesCount = Object.values(favoriteStates).filter(Boolean).length;
  
  // Get categories from API
  const { data: categoriesData } = useCategories();
  const categories = Array.isArray(categoriesData?.results) ? categoriesData.results : [];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIsLangOpen(false);
    setIsUserMenuOpen(false);
    setIsProductsOpen(false);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleLangMenu = () => setIsLangOpen(!isLangOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  return (
    <nav className={cn(
      "bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50 shadow-sm transition-all duration-300",
      scrolled && "bg-white/98 shadow-md"
    )}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-90 transition-opacity group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl font-heading">OG</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-heading leading-tight">
                Organic Green
              </span>
              <span className="text-xs sm:text-sm text-green-600 font-medium leading-tight tracking-wide hidden sm:block">
                Uzbekistan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-4 2xl:space-x-6">
            {navItems.map((item) => {
              // Special handling for products link to show dropdown
              if (item.href === "/products") {
                return (
                  <div key={item.href} className="relative">
                    <button
                      onMouseEnter={() => setIsProductsOpen(true)}
                      onMouseLeave={() => setIsProductsOpen(false)}
                      className="flex items-center space-x-1 text-gray-700 hover:text-green-600 font-medium transition-all duration-300 relative group px-2 py-2 rounded-lg hover:bg-green-50 text-sm xl:text-base"
                    >
                      <span>{t(item.key)}</span>
                      <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4" />
                      <span className="absolute inset-x-0 -bottom-2 h-1 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center rounded-full"></span>
                    </button>

                    {/* Products Dropdown */}
                    {isProductsOpen && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-56 xl:w-64 bg-white rounded-xl shadow-xl border border-green-100 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200"
                        onMouseEnter={() => setIsProductsOpen(true)}
                        onMouseLeave={() => setIsProductsOpen(false)}
                      >
                        <Link
                          href="/products"
                          className="flex items-center px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors text-sm xl:text-base"
                        >
                          <span className="font-medium">{t('view_all_products')}</span>
                        </Link>
                        <div className="border-t border-green-100 my-2"></div>
                        {categories.slice(0, 5).map((category) => (
                          <Link
                            key={category.id}
                            href={`/products?category=${category.id}`}
                            className="flex items-center justify-between px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors text-sm xl:text-base"
                          >
                            <span>{getLocalizedName(category, language)}</span>
                            <span className="text-xs text-gray-400">({category.products_count})</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 relative group px-2 py-2 rounded-lg hover:bg-green-50 text-sm xl:text-base"
                >
                  {t(item.key)}
                  <span className="absolute inset-x-0 -bottom-2 h-1 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center rounded-full"></span>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Tablet/Desktop only - Language and Auth */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={toggleLangMenu}
                  className="flex items-center space-x-1 px-2 py-2 lg:px-3 lg:py-2 rounded-lg hover:bg-green-50 transition-colors border border-transparent hover:border-green-200"
                >
                  <Globe className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {languages.find(lang => lang.code === language)?.flag}
                  </span>
                  <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600" />
                </button>

                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-36 lg:w-44 bg-white rounded-xl shadow-xl border border-green-100 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as Language);
                          setIsLangOpen(false);
                        }}
                        className={cn(
                          "w-full px-3 py-2 lg:px-4 lg:py-3 text-left hover:bg-green-50 transition-colors flex items-center space-x-2 lg:space-x-3 rounded-lg mx-1",
                          language === lang.code && "bg-green-50 text-green-600 font-medium"
                        )}
                      >
                        <span className="text-base lg:text-lg">{lang.flag}</span>
                        <span className="text-sm">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Auth Buttons or User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-1 lg:space-x-2 px-2 py-2 lg:px-3 lg:py-2 rounded-lg hover:bg-green-50 transition-colors border border-transparent hover:border-green-200"
                  >
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-medium text-xs lg:text-sm">
                      {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-16 lg:max-w-24 truncate hidden lg:block">
                      {user?.first_name || user?.username}
                    </span>
                    <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 lg:w-48 bg-white rounded-xl shadow-xl border border-green-100 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-3 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">{t('profile')}</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">{t('logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-1 lg:space-x-2">
                  <Link href="/login">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 font-medium rounded-lg px-2 py-1 lg:px-4 lg:py-2 text-xs lg:text-sm"
                    >
                      {t('login')}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 font-medium rounded-lg px-2 py-1 lg:px-4 lg:py-2 text-xs lg:text-sm"
                    >
                      {t('register')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Favorites - Visible on tablet and up */}
            <Link 
              href="/favorites"
              className="relative p-2 rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-200 group hidden sm:block"
            >
              <Heart className={cn(
                "w-4 h-4 lg:w-5 lg:h-5 transition-colors",
                favoritesCount > 0 ? "text-red-500 fill-red-500" : "text-gray-700 group-hover:text-red-500"
              )} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </span>
              )}
            </Link>

            {/* Cart - Always visible */}
            <Link 
              href="/cart"
              className="relative p-2 rounded-lg hover:bg-green-50 transition-colors border border-transparent hover:border-green-200 group"
            >
              <ShoppingBag className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 group-hover:text-green-600" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {getTotalItems() > 99 ? '99+' : getTotalItems()}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-green-50 transition-colors border border-transparent hover:border-green-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-green-100 bg-white shadow-xl">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-700 hover:text-green-600 font-medium transition-colors py-3 px-4 rounded-lg hover:bg-green-50 border border-transparent hover:border-green-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-green-100">
                  <div className="flex flex-col space-y-4">
                    {/* Mobile Language Selector */}
                    <div className="relative">
                      <button
                        onClick={toggleLangMenu}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-green-50 transition-colors border border-gray-200"
                      >
                        <div className="flex items-center space-x-3">
                          <Globe className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {languages.find(lang => lang.code === language)?.label}
                          </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      </button>

                      {isLangOpen && (
                        <div className="mt-2 w-full bg-white rounded-lg border border-gray-200 shadow-lg py-2">
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setLanguage(lang.code as Language);
                                setIsLangOpen(false);
                              }}
                              className={cn(
                                "w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex items-center space-x-3",
                                language === lang.code && "bg-green-50 text-green-600 font-medium"
                              )}
                            >
                              <span className="text-lg">{lang.flag}</span>
                              <span className="text-sm">{lang.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Mobile Favorites */}
                    <Link 
                      href="/favorites"
                      className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-red-50 transition-colors border border-gray-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <Heart className={cn(
                          "w-4 h-4 transition-colors",
                          favoritesCount > 0 ? "text-red-500 fill-red-500" : "text-gray-700"
                        )} />
                        <span className="text-sm font-medium text-gray-700">{t('favorites')}</span>
                      </div>
                      {favoritesCount > 0 && (
                        <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                          {favoritesCount > 9 ? '9+' : favoritesCount}
                        </span>
                      )}
                    </Link>

                    {/* Mobile Auth */}
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <Link
                          href="/profile"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors rounded-lg border border-gray-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span className="text-sm">{t('profile')}</span>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg border border-gray-200"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">{t('logout')}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-3">
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button 
                            variant="outline" 
                            className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 font-medium rounded-lg py-3"
                          >
                            {t('login')}
                          </Button>
                        </Link>
                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button 
                            variant="default" 
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 font-medium rounded-lg py-3"
                          >
                            {t('register')}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};
                    <span className="text-base font-medium text-gray-700">Тил / Language</span>
                    <div className="flex items-center space-x-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setLanguage(lang.code as Language)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-base transition-colors border",
                            language === lang.code 
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
                    <span className="text-gray-700 font-medium">{t('cart')}</span>
                    <div className="relative">
                      <ShoppingBag className="w-5 h-5 text-gray-700" />
                      {getTotalItems() > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                          {getTotalItems() > 99 ? '99+' : getTotalItems()}
                        </span>
                      )}
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
