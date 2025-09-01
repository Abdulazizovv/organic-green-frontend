'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import uzTranslations from '@/locales/uz.json'
import ruTranslations from '@/locales/ru.json'
import enTranslations from '@/locales/en.json'

export type Language = 'uz' | 'ru' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  uz: uzTranslations,
  ru: ruTranslations,
  en: enTranslations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('uz')

  const t = (key: string): string => {
    // Support nested keys like "navigation.home" or "products.add_to_cart"
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback: try to find in flat structure for backward compatibility
        const flatTranslations: Record<string, string> = {
          // Navigation
          'home': translations[language].navigation.home,
          'about': translations[language].navigation.about,
          'products': translations[language].navigation.products,
          'categories': translations[language].navigation.categories,
          'blog': translations[language].navigation.blog,
          'contact': translations[language].navigation.contact,
          'education': translations[language].navigation.education,
          'franchise': translations[language].navigation.franchise,
          'cart': translations[language].navigation.cart,
          
          // Products
          'featured_products_title': translations[language].products.featured_products_title,
          'featured_products_description': translations[language].products.featured_products_description,
          'view_all_products': translations[language].products.view_all_products,
          'add_to_cart': translations[language].products.add_to_cart,
          'set_quantity': translations[language].products.set_quantity,
          'in_cart': translations[language].products.in_cart,
          'adding': translations[language].products.adding,
          'loading_products': translations[language].products.loading_products,
          'available': translations[language].products.available,
          'sold_out': translations[language].products.sold_out,
          'not_available': translations[language].products.not_available,
          
          // Statistics
          'happy_customers': translations[language].statistics.happy_customers,
          'product_types': translations[language].statistics.product_types,
          'years_experience': translations[language].statistics.years_experience,
          'quality_certificates': translations[language].statistics.quality_certificates,
          
          // Common
          'currency': translations[language].common.currency,
          'loading': translations[language].common.loading,
          'error': translations[language].common.error,
          'try_again': translations[language].common.try_again,
          'save': translations[language].common.save,
          'cancel': translations[language].common.cancel,
          'ok': translations[language].common.ok,
          'yes': translations[language].common.yes,
          'no': translations[language].common.no
        }
        
        if (flatTranslations[key]) {
          return flatTranslations[key]
        }
        
        return key // Return the key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key
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
