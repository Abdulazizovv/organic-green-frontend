'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'uz' | 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations = {
  uz: {
    // Common
    'home': 'Бош саҳифа',
    'about': 'Биз ҳақимизда',
    'products': 'Маҳсулотлар',
    'franchise': 'Франчайзинг',
    'education': 'Таълим',
    'blog': 'Янгиликлар',
    'contact': 'Алоқа',
    'all': 'Барчаси',
    'search_placeholder': 'Маҳсулотларни қидиринг...',
    'add_to_cart': 'Саватга қўшиш',
    'out_of_stock': 'Мавжуд эмас',
    'in_stock': 'Мавжуд',
    'sold_out': 'Тугаган',
    'loading': 'Юкланмоқда...',
    'products_loading': 'Маҳсулотлар юкланмоқда...',
    'no_products_found': 'Ҳеч қандай маҳсулот топилмади',
    'retry': 'Қайта уриниш',
    'previous': 'Олдинги',
    'next': 'Кейинги',
    'view_all_products': 'Барча маҳсулотларни кўриш',
    'categories': 'Категориялар',
    'features': 'Хусусиятлар',
    'organic_100': '100% Органик',
    'certified': 'Сертификатланган',
    'fast_delivery': 'Тез етказиб бериш',
    'products_found': 'маҳсулот топилди',

    'happy_customers': 'Мамнун мижозлар',
    'product_types': 'Маҳсулот турлари', 
    'years_experience': 'Йилдан ортиқ тажриба',
    'quality_certificates': 'Сифат сертификатлари',
    'available': 'Мавжуд',
    'not_available': 'Мавжуд емас',
    'currency': 'сўм',
    'featured_products_title': 'Машҳур маҳсулотлар',
    'featured_products_description': 'Энг сифатли ва машҳур органик маҳсулотларимиз билан танишинг',
    'loading_products': 'Маҳсулотлар юкланмоқда...',
    
    // Hero section
    'hero_badge': 'Ўзбекистонда №1 микрозелень компанияси',
    'hero_title_1': 'Табиий',
    'hero_title_2': 'ва',
    'hero_title_3': 'соғлом',
    'hero_title_4': 'турмуш тарзи учун',
    'hero_description': 'Микрозелень, табиий қўшимчалар ва франшиза орқали соғлом турмуш тарзини бошланг. Сифат кафолати билан!',
    
    // Featured products
    'featured_products': 'Машҳур',
    'featured_products_span': 'Маҳсулотлар',
    'featured_products_description': 'Энг сифатли ва машҳур органик маҳсулотларимиз билан танишинг',
    'hit': 'Ҳит',
    'discount': 'Чегирма',
    
    // Products page
    'organic_products': 'Органик',
    'organic_products_span': 'Маҳсулотлар',
    'organic_products_description': 'Табиий ва соғлом маҳсулотларни кашф етинг',
    
    // Footer
    'microgreens': 'Микрозелень',
    'powders': 'Порошоклар',
    'supplements': 'Қўшимчалар',
    'kits': 'Наборлар',
    'shipping': 'Етказиб бериш',
    'payment': 'Тўлов',
    'returns': 'Қайтариш',
    'warranty': 'Кафолат',
    'faq': 'Саволлар',
  },
  ru: {
    // Common
    'home': 'Главная',
    'about': 'О нас',
    'products': 'Продукты',
    'franchise': 'Франчайзинг',
    'education': 'Образование',
    'blog': 'Новости',
    'contact': 'Контакты',
    'all': 'Все',
    'search_placeholder': 'Поиск продуктов...',
    'add_to_cart': 'В корзину',
    'out_of_stock': 'Нет в наличии',
    'in_stock': 'В наличии',
    'sold_out': 'Закончилось',
    'loading': 'Загрузка...',
    'products_loading': 'Загрузка продуктов...',
    'no_products_found': 'Продукты не найдены',
    'retry': 'Повторить',
    'previous': 'Предыдущая',
    'next': 'Следующая',
    'view_all_products': 'Смотреть все продукты',
    'featured_products_title': 'Популярные продукты',
    'loading_products': 'Загрузка продуктов...',
    'currency': 'сум',
    'happy_customers': 'Довольных клиентов',
    'product_types': 'Типов продуктов',
    'years_experience': 'Лет опыта',
    'quality_certificates': 'Сертификатов качества',
    'available': 'Доступно',
    'not_available': 'Недоступно',
    'currency': 'сум',

    'categories': 'Категории',
    'features': 'Особенности',
    'organic_100': '100% Органик',
    'certified': 'Сертифицированный',
    'fast_delivery': 'Быстрая доставка',
    'products_found': 'продуктов найдено',
    
    // Hero section
    'hero_badge': 'Компания микрозелени №1 в Узбекистане',
    'hero_title_1': 'Натуральный',
    'hero_title_2': 'и',
    'hero_title_3': 'здоровый',
    'hero_title_4': 'образ жизни',
    'hero_description': 'Начните здоровый образ жизни с микрозелени, натуральных добавок и франшизы. С гарантией качества!',
    
    // Featured products
    'featured_products': 'Популярные',
    'featured_products_span': 'Продукты',
    'featured_products_description': 'Познакомьтесь с нашими самыми качественными и популярными органическими продуктами',
    'hit': 'Хит',
    'discount': 'Скидка',
    
    // Products page
    'organic_products': 'Органические',
    'organic_products_span': 'Продукты',
    'organic_products_description': 'Откройте для себя натуральные и здоровые продукты',
    
    // Footer
    'microgreens': 'Микрозелень',
    'powders': 'Порошки',
    'supplements': 'Добавки',
    'kits': 'Наборы',
    'shipping': 'Доставка',
    'payment': 'Оплата',
    'returns': 'Возврат',
    'warranty': 'Гарантия',
    'faq': 'Вопросы',
  },
  en: {
    // Common
    'home': 'Home',
    'about': 'About',
    'products': 'Products',
    'franchise': 'Franchise',
    'education': 'Education',
    'blog': 'News',
    'contact': 'Contact',
    'all': 'All',
    'search_placeholder': 'Search products...',
    'add_to_cart': 'Add to cart',
    'out_of_stock': 'Out of stock',
    'in_stock': 'In stock',
    'sold_out': 'Sold out',
    'loading': 'Loading...',
    'products_loading': 'Loading products...',
    'no_products_found': 'No products found',
    'retry': 'Retry',
    'previous': 'Previous',
    'next': 'Next',
    'view_all_products': 'View all products',
    'categories': 'Categories',
    'features': 'Features',
    'organic_100': '100% Organic',
    'certified': 'Certified',
    'fast_delivery': 'Fast delivery',
    'products_found': 'products found',
    'currency': 'UZS',
    'happy_customers': 'Happy customers',
    'product_types': 'Product types',
    'years_experience': 'Years of experience',
    'quality_certificates': 'Quality certificates',
    'available': 'Available',
    'not_available': 'Not available',
    'featured_products_title': 'Featured Products',
    'featured_products_description': 'Get acquainted with our highest quality and most popular organic products',
    'loading_products': 'Loading products...',
    
    // Hero section
    'hero_badge': '#1 microgreen company in Uzbekistan',
    'hero_title_1': 'Natural',
    'hero_title_2': 'and',
    'hero_title_3': 'healthy',
    'hero_title_4': 'lifestyle',
    'hero_description': 'Start a healthy lifestyle with microgreens, natural supplements and franchise. With quality guarantee!',
    
    // Featured products
    'featured_products': 'Popular',
    'featured_products_span': 'Products',
    'featured_products_description': 'Get acquainted with our highest quality and most popular organic products',
    'hit': 'Hit',
    'discount': 'Discount',
    
    // Products page
    'organic_products': 'Organic',
    'organic_products_span': 'Products',
    'organic_products_description': 'Discover natural and healthy products',
    
    // Footer
    'microgreens': 'Microgreens',
    'powders': 'Powders',
    'supplements': 'Supplements',
    'kits': 'Kits',
    'shipping': 'Shipping',
    'payment': 'Payment',
    'returns': 'Returns',
    'warranty': 'Warranty',
    'faq': 'FAQ',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('uz');

  const t = (key: string): string => {
    const translation = translations[language] as Record<string, string>;
    return translation[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Helper function to get localized names
export const getLocalizedName = (item: { name_uz?: string; name_ru?: string; name_en?: string }, language: Language): string => {
  switch (language) {
    case 'uz':
      return item.name_uz || item.name_en || item.name_ru || '';
    case 'ru':
      return item.name_ru || item.name_en || item.name_uz || '';
    case 'en':
      return item.name_en || item.name_ru || item.name_uz || '';
    default:
      return item.name_en || item.name_ru || item.name_uz || '';
  }
};
