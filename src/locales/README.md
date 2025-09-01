# Multilanguage System

## Overview
The website now uses a separate file system for translations to make it easier to manage text content.

## File Structure
```
src/locales/
├── uz.json (Uzbek translations)
├── ru.json (Russian translations)
└── en.json (English translations)
```

## Usage

### In Components
```tsx
import { useLanguage } from '@/lib/language'

function MyComponent() {
  const { t, language } = useLanguage()
  
  return (
    <div>
      <h1>{t('navigation.home')}</h1>
      <p>{t('products.add_to_cart')}</p>
    </div>
  )
}
```

### Translation Keys
The system supports nested keys using dot notation:
- `navigation.home` - Navigation items
- `products.add_to_cart` - Product-related text
- `auth.login_title` - Authentication text
- `footer.description` - Footer content
- `common.currency` - Common text

### Adding New Translations
1. Add the key to all three language files (uz.json, ru.json, en.json)
2. Use the key in your component with `t('your.new.key')`

### Backward Compatibility
The system still supports old flat keys for existing code:
- `add_to_cart` will work as `products.add_to_cart`
- `home` will work as `navigation.home`

## Language Files Organization

### Navigation (`navigation.*`)
- home, about, products, categories, blog, contact, etc.

### Authentication (`auth.*`)
- login, register, password fields, form labels

### Hero Section (`hero.*`)
- title, subtitle, description, buttons

### Products (`products.*`)
- add_to_cart, featured_products, filters, status

### Statistics (`statistics.*`)
- happy_customers, product_types, years_experience

### Footer (`footer.*`)
- newsletter, company info, links

### Support (`support.*`)
- shipping, returns, faq

### Contact (`contact.*`)
- address, phone, email

### Common (`common.*`)
- currency, shared text

## Benefits
- Easy to maintain translations in separate files
- Better organization with nested structure
- Can be easily exported to translators
- Supports both nested keys and backward compatibility
- Clear separation of concerns
