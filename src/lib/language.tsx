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
    let value: unknown = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        return key // Return the key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  const value: LanguageContextType = {
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

// Helper function to get localized description from API objects
export function getLocalizedDescription(item: { description_uz?: string; description_ru?: string; description_en?: string; description?: string }, language: Language): string {
  if (!item) return ''
  
  switch (language) {
    case 'uz':
      return item.description_uz || item.description || ''
    case 'ru':
      return item.description_ru || item.description || ''
    case 'en':
      return item.description_en || item.description || ''
    default:
      return item.description || ''
  }
}

// Generic helper function to get localized field with fallback to Uzbek
export function getLocalizedField<T extends Record<string, unknown>>(
  item: T, 
  fieldName: string, 
  language: Language
): string {
  if (!item) return ''
  
  const uzField = `${fieldName}_uz`
  const ruField = `${fieldName}_ru`
  const enField = `${fieldName}_en`
  
  switch (language) {
    case 'uz':
      return (item[uzField] as string) || (item[fieldName] as string) || ''
    case 'ru':
      return (item[ruField] as string) || (item[uzField] as string) || (item[fieldName] as string) || ''
    case 'en':
      return (item[enField] as string) || (item[uzField] as string) || (item[fieldName] as string) || ''
    default:
      return (item[uzField] as string) || (item[fieldName] as string) || ''
  }
}
