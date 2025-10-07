'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'uz' | 'ru' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  uz: {
    // Navigation
    home: 'Бош саҳифа',
    about: 'Биз ҳақимизда', 
    products: 'Маҳсулотлар',
    categories: 'Категориялар',
    blog: 'Блог',
    contact: 'Алоқа',
    education: 'Таълим',
    franchise: 'Франшиза',
    cart: 'Сават',
    search_placeholder: 'Маҳсулотларни излаш...',
    language: 'Тил',
    login: 'Кириш',
    register: 'Рўйхатдан ўтиш',
    logout: 'Чиқиш',
    profile: 'Профил',

    // Auth
    first_name: 'Исм',
    last_name: 'Фамилия',
    username: 'Фойдаланувчи номи',
    email: 'Электрон почта',
    password: 'Парол',
    password_confirm: 'Паролни тасдиқлаш',
    login_title: 'Тизимга кириш',
    register_title: 'Рўйхатдан ўтиш',
    login_subtitle: 'Ҳисобингизга кириш учун маълумотларингизни киритинг',
    register_subtitle: 'Янги ҳисоб очиш учун қуйидаги маълумотларни тўлдиринг',
    login_button: 'Кириш',
    register_button: 'Рўйхатдан ўтиш',
    forgot_password: 'Паролни унутдингизми?',
    have_account: 'Ҳисобингиз борми?',
    no_account: 'Ҳисобингиз йўқми?',
    password_min_length: 'Парол камида 4 та белгидан иборат бўлиши керак',
    passwords_not_match: 'Паrollар мос келмади',
    required_field: 'Мажбурий майдон',

    // Hero Section
    hero_title: 'Соғлом ва Табиий турмуш тарзи учун',
    hero_subtitle: 'Соғлом ҳаёт учун энг тоза ва табиий маҳсулотлар',
    hero_description: 'Ўзбекистонда етиштирилган энг сифатли микрозелень ва табиий маҳсулотлар билан соғлом турмуш тарзини бошланг',
    shop_now: 'Харид қилиш',
    learn_more: 'Батафсил',

    // Products
    featured_products: 'Танлаб олинган маҳсулотлар',
    featured_products_title: 'Танлаб олинган маҳсулотлар',
    featured_products_description: 'Энг сифатли ва масҳур маҳсулотларимиз',
    featured_products_subtitle: 'Энг сифатли ва масҳур маҳсулотларимиз',
    view_all_products: 'Барча маҳсулотларни кўриш',
    add_to_cart: 'Саватга қўшиш',
    set_quantity: 'Миқдорни белгилаш',
    in_cart: 'саватда',
    adding: 'Қўшилмоқда...',
    no_products: 'Маҳсулотлар топилмади',
    filter_by_category: 'Категория бўйича филтрлаш',
    all_categories: 'Барча категориялар',
    search_products: 'Маҳсулотларни излаш',
    grid_view: 'Тўр кўринишида',
    list_view: 'Рўйхат кўринишида',
    clear_filters: 'Филтрларни тозалаш',
    available: 'Мавжуд',
    sold_out: 'Тугаган',
    not_available: 'Мавжуд эмас',
    loading_products: 'Маҳсулотлар юкланмоқда...',

    // Statistics  
    stats_products: 'Маҳсулотлар',
    stats_customers: 'Мижозлар',
    stats_cities: 'Шаҳарлар',
    happy_customers: 'Бахтли мижозлар',
    product_types: 'Маҳсулот турлари', 
    years_experience: 'Йил тажриба',
    quality_certificates: 'Сифат сертификатлари',

    // Footer
    newsletter_title: 'Янгиликларга обуна бўлинг',
    newsletter_description: 'Янги маҳсулотлар ва махсус таклифлар ҳақида хабардор бўлинг',
    newsletter_placeholder: 'Электрон почта манзилингиз',
    subscribe: 'Обуна бўлиш',
    company_section: 'Компания',
    quick_links: 'Тезкор ҳаволалар',
    contact_info: 'Алоқа маълумотлари',
    all_rights_reserved: 'Барча ҳуқуқлар ҳимояланган',
    footer_description: 'Ўзбекистонда микрозелень бўйича етакчи компания. Табиий ва органик маҳсулотлар орқали соғлом турмуш тарзини ривожлантирамиз.',
    company_links: 'Компания',
    products_section: 'Маҳсулотлар',
    support_section: 'Қўллаб-қувватлаш',

    // Company links
    company_about: 'Биз ҳақимизда',
    company_team: 'Жамоа',
    company_careers: 'Карьера',
    company_news: 'Янгиликлар',

    // Quick links
    quick_support: 'Қўллаб-қувватлаш',
    quick_shipping: 'Етказиб бериш',
    quick_returns: 'Қайтариш',
    quick_faq: 'Савол-жавоб',

    // Contact
    address: 'Ташкент ш., Мирзо Улуғбек т., Университет кўчаси 4-уй',
    phone: '+998 90 844 08 44',
    contact_email: 'info@organicgreen.uz',

    // Currency
    currency: 'сўм'
  },
  ru: {
    // Navigation
    home: 'Главная',
    about: 'О нас',
    products: 'Продукты',
    categories: 'Категории',
    blog: 'Блог',
    contact: 'Контакты',
    education: 'Обучение',
    franchise: 'Франшиза',
    cart: 'Корзина',
    search_placeholder: 'Поиск продуктов...',
    language: 'Язык',
    login: 'Войти',
    register: 'Регистрация',
    logout: 'Выйти',
    profile: 'Профиль',

    // Auth
    first_name: 'Имя',
    last_name: 'Фамилия',
    username: 'Имя пользователя',
    email: 'Электронная почта',
    password: 'Пароль',
    password_confirm: 'Подтвердить пароль',
    login_title: 'Вход в систему',
    register_title: 'Регистрация',
    login_subtitle: 'Введите ваши данные для входа в аккаунт',
    register_subtitle: 'Заполните следующие данные для создания нового аккаунта',
    login_button: 'Войти',
    register_button: 'Зарегистрироваться',
    forgot_password: 'Забыли пароль?',
    have_account: 'Уже есть аккаунт?',
    no_account: 'Нет аккаунта?',
    password_min_length: 'Пароль должен содержать минимум 4 символа',
    passwords_not_match: 'Пароли не совпадают',
    required_field: 'Обязательное поле',

    // Hero Section
    hero_title: 'Для здорового и натурального образа жизни',
    hero_subtitle: 'Самые чистые и натуральные продукты для здорового образа жизни',
    hero_description: 'Начните здоровый образ жизни с самой качественной микрозелени и натуральными продуктами, выращенными в Узбекистане',
    shop_now: 'Купить',
    learn_more: 'Подробнее',

    // Products
    featured_products: 'Рекомендуемые продукты',
    featured_products_title: 'Рекомендуемые продукты',
    featured_products_description: 'Наши самые качественные и популярные продукты',
    featured_products_subtitle: 'Наши самые качественные и популярные продукты',
    view_all_products: 'Посмотреть все продукты',
    add_to_cart: 'Добавить в корзину',
    set_quantity: 'Установить количество',
    in_cart: 'в корзине',
    adding: 'Добавляем...',
    no_products: 'Продукты не найдены',
    filter_by_category: 'Фильтр по категории',
    all_categories: 'Все категории',
    search_products: 'Поиск продуктов',
    grid_view: 'Сетка',
    list_view: 'Список',
    clear_filters: 'Очистить фильтры',
    available: 'В наличии',
    sold_out: 'Закончилось',
    not_available: 'Недоступно',
    loading_products: 'Загрузка продуктов...',

    // Statistics
    stats_products: 'Продуктов',
    stats_customers: 'Клиентов',
    stats_cities: 'Городов',
    happy_customers: 'Довольных клиентов',
    product_types: 'Видов продуктов',
    years_experience: 'Лет опыта',
    quality_certificates: 'Сертификатов качества',

    // Footer
    newsletter_title: 'Подписаться на новости',
    newsletter_description: 'Узнавайте о новых продуктах и специальных предложениях',
    newsletter_placeholder: 'Ваш email адрес',
    subscribe: 'Подписаться',
    company_section: 'Компания',
    quick_links: 'Быстрые ссылки',
    contact_info: 'Контактная информация',
    all_rights_reserved: 'Все права защищены',
    footer_description: 'Ведущая компания по микрозелени в Узбекистане. Развиваем здоровый образ жизни через натуральные и органические продукты.',
    company_links: 'Компания',
    products_section: 'Продукты',
    support_section: 'Поддержка',

    // Company links
    company_about: 'О нас',
    company_team: 'Команда',
    company_careers: 'Карьера',
    company_news: 'Новости',

    // Quick links
    quick_support: 'Поддержка',
    quick_shipping: 'Доставка',
    quick_returns: 'Возвраты',
    quick_faq: 'Вопросы',

    // Contact
    address: 'г. Ташкент, Мирзо-Улугбекский р-н, ул. Университетская 4',
    phone: '+998 90 844 08 44',
    contact_email: 'info@organicgreen.uz',

    // Currency
    currency: 'сум'
  },
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    products: 'Products',
    categories: 'Categories',
    blog: 'Blog',
    contact: 'Contact',
    education: 'Education',
    franchise: 'Franchise',
    cart: 'Cart',
    search_placeholder: 'Search products...',
    language: 'Language',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',

    // Auth
    first_name: 'First Name',
    last_name: 'Last Name',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    password_confirm: 'Confirm Password',
    login_title: 'Login',
    register_title: 'Register',
    login_subtitle: 'Enter your credentials to access your account',
    register_subtitle: 'Fill out the following information to create a new account',
    login_button: 'Login',
    register_button: 'Register',
    forgot_password: 'Forgot password?',
    have_account: 'Already have an account?',
    no_account: 'Don\'t have an account?',
    password_min_length: 'Password must be at least 4 characters long',
    passwords_not_match: 'Passwords do not match',
    required_field: 'Required field',

    // Hero Section
    hero_title: 'For Healthy and Natural Lifestyle',
    hero_subtitle: 'The purest and most natural products for a healthy lifestyle',
    hero_description: 'Start a healthy lifestyle with the highest quality microgreens and natural products grown in Uzbekistan',
    shop_now: 'Shop Now',
    learn_more: 'Learn More',

    // Products
    featured_products: 'Featured Products',
    featured_products_title: 'Featured Products',
    featured_products_description: 'Our highest quality and most popular products',
    featured_products_subtitle: 'Our highest quality and most popular products',
    view_all_products: 'View All Products',
    add_to_cart: 'Add to Cart',
    set_quantity: 'Set Quantity',
    in_cart: 'in cart',
    adding: 'Adding...',
    no_products: 'No products found',
    filter_by_category: 'Filter by category',
    all_categories: 'All categories',
    search_products: 'Search products',
    grid_view: 'Grid View',
    list_view: 'List View',
    clear_filters: 'Clear Filters',
    available: 'Available',
    sold_out: 'Sold Out',
    not_available: 'Not Available',
    loading_products: 'Loading products...',

    // Statistics
    stats_products: 'Products',
    stats_customers: 'Customers',
    stats_cities: 'Cities',
    happy_customers: 'Happy Customers',
    product_types: 'Product Types',
    years_experience: 'Years Experience',
    quality_certificates: 'Quality Certificates',

    // Footer
    newsletter_title: 'Subscribe to Newsletter',
    newsletter_description: 'Stay updated with new products and special offers',
    newsletter_placeholder: 'Your email address',
    subscribe: 'Subscribe',
    company_section: 'Company',
    quick_links: 'Quick Links',
    contact_info: 'Contact Information',
    all_rights_reserved: 'All rights reserved',
    footer_description: 'Leading microgreen company in Uzbekistan. Developing healthy lifestyle through natural and organic products.',
    company_links: 'Company',
    products_section: 'Products',
    support_section: 'Support',

    // Company links
    company_about: 'About Us',
    company_team: 'Team',
    company_careers: 'Careers',
    company_news: 'News',

    // Quick links
    quick_support: 'Support',
    quick_shipping: 'Shipping',
    quick_returns: 'Returns',
    quick_faq: 'FAQ',

    // Contact
    address: 'Tashkent, Mirzo Ulugbek District, University Street 4',
    phone: '+998 90 844 08 44',
    contact_email: 'info@organicgreen.uz',

    // Currency
    currency: 'UZS'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('uz')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  const value = {
    language,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Helper function to get localized name from API objects
export function getLocalizedName(item: { name_uz?: string; name_ru?: string; name_en?: string; name?: string }, language: Language): string {
  if (!item) return ''
  
  switch (language) {
    case 'uz':
      return item.name_uz || item.name || ''
    case 'ru':
      return item.name_ru || item.name || ''
    case 'en':
      return item.name_en || item.name || ''
    default:
      return item.name || ''
  }
}