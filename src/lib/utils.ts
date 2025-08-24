import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = "UZS"): string {
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date, locale: string = "uz-UZ"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}
