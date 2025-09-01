import { uz } from './uz';
import { ru } from './ru';
import { en } from './en';

export const locales = {
  uz,
  ru,
  en
};

export type Locale = keyof typeof locales;
export type TranslationKeys = keyof typeof uz;

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let translation: any = locales[locale];
  
  for (const k of keys) {
    translation = translation?.[k];
  }
  
  return translation || key;
}

export { uz, ru, en };
export type { Translations } from './uz';
