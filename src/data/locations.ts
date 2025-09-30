export type SupportedLang = "uz" | "ru" | "en";

export interface Location {
  id: number;
  address: {
    uz: string;
    ru: string;
    en: string;
  };
  lat?: number;
  lng?: number;
}

export const LOCATIONS: Location[] = [
  {
    id: 1,
    address: {
      uz: "Тошкент Шахар, М Улугбек тумани, Корасу 6, 17а",
      ru: "г. Ташкент, Мирзо-Улугбекский район, Карасу-6, 17а",
      en: "Tashkent city, Mirzo Ulugbek district, Karasu-6, 17a",
    },
  },
  {
    id: 2,
    address: {
      uz: "Фаргона Шахар, Машъал МФЙ Б.Маргиноний 24",
      ru: "г. Фергана, МФЙ «Машъал», Б. Маргиланий, 24",
      en: "Fergana city, Mashal MFY, B. Margilaniy 24",
    },
  },
];

export function getLocalizedAddresses(lang: string): string[] {
  const language = ["uz", "ru", "en"].includes(lang) ? (lang as SupportedLang) : "uz";
  return LOCATIONS.map((loc) => loc.address[language]);
}
