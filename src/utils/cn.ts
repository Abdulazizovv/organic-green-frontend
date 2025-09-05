// Simple classNames merger utility (Tailwind-friendly)
export function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}
