"use client";

import { useLanguage } from "@/lib/language";
import { Calendar, Scale, ShieldCheck, CreditCard, BookOpen, AlertTriangle, Gavel, Globe } from "lucide-react";

const termsContent = {
  uz: {
    title: "Foydalanish Shartlari",
    lastUpdated: "Oxirgi yangilanish: 2025-10-07",
    intro: "Ushbu Foydalanish shartlari (\"Shartlar\") www.organicgreen.uz saytidan va unga bog'liq xizmatlardan foydalanishni tartibga soladi. Saytdan foydalanish orqali siz ushbu Shartlarni qabul qilasiz.",
    sections: [
      {
        icon: BookOpen,
        title: "1. Ta'riflar",
        content: [
          "1.1. \"Kompaniya\" - Organic Green Uzbekistan MChJ",
          "1.2. \"Foydalanuvchi\" - saytdan foydalanadigan har qanday jismoniy yoki yuridik shaxs",
          "1.3. \"Xizmatlar\" - sayt orqali taqdim etiladigan barcha mahsulotlar va xizmatlar",
          "1.4. \"Kontent\" - saytdagi barcha matnlar, rasmlar, videolar va boshqa materiallar"
        ]
      },
      {
        icon: ShieldCheck,
        title: "2. Hisoblar va Ro'yxatdan O'tish",
        content: [
          "2.1. Hisob yaratishda to'g'ri va to'liq ma'lumot taqdim eting",
          "2.2. Parolingiz xavfsizligi uchun javobgarsiz",
          "2.3. Hisobingizdan noqonuniy foydalanishni darhol xabar qiling",
          "2.4. Bir kishi faqat bitta hisob yaratishi mumkin"
        ]
      },
      {
        icon: AlertTriangle,
        title: "3. Foydalanish Qoidalari",
        content: [
          "3.1. Saytni faqat qonuniy maqsadlarda ishlating",
          "3.2. Boshqa foydalanuvchilarning huquqlarini hurmat qiling",
          "3.3. Xavfsizlikni buzishga urinish taqiqlanadi",
          "3.4. Spam va zararli kontent tarqatish mumkin emas",
          "3.5. Intellektual mulk huquqlarini buzmaslik"
        ]
      },
      {
        icon: CreditCard,
        title: "4. Buyurtmalar va To'lovlar",
        content: [
          "4.1. Buyurtma berish - sotib olish taklifini bildiradi",
          "4.2. Narxlar oldindan xabar bermasdan o'zgarishi mumkin",
          "4.3. To'lovlar xavfsiz to'lov tizimi orqali amalga oshiriladi",
          "4.4. Bekor qilish va qaytarish siyosati alohida belgilanadi",
          "4.5. Kompaniya buyurtmani qabul qilish yoki rad etish huquqiga ega"
        ]
      },
      {
        icon: Scale,
        title: "5. Intellektual Mulk",
        content: [
          "5.1. Saytdagi barcha kontent Kompaniyaga tegishli",
          "5.2. Ruxsatsiz nusxalash va tarqatish taqiqlanadi",
          "5.3. Brend nomlari va logotiplar himoyalangan",
          "5.4. Foydalanuvchilar o'z kontentlari uchun javobgar"
        ]
      },
      {
        icon: Gavel,
        title: "6. Javobgarlik Cheklovi",
        content: [
          "6.1. Sayt \"mavjud holda\" taqdim etiladi",
          "6.2. Kompaniya bilvosita zararlar uchun javobgar emas",
          "6.3. Texnik nosozliklar uchun mas'uliyat cheklangan",
          "6.4. Uchinchi tomon xizmatlari uchun javobgarlik yo'q"
        ]
      },
      {
        icon: Globe,
        title: "7. Qo'llaniladigan Qonun",
        content: [
          "7.1. Ushbu Shartlar O'zbekiston Respublikasi qonunlariga bo'ysunadi",
          "7.2. Nizolar sulh yo'li bilan hal qilinadi",
          "7.3. Sud da'vosi Toshkent shahar sudlarida ko'riladi",
          "7.4. Xalqaro huquq me'yorlari ham qo'llaniladi"
        ]
      }
    ],
    acceptance: "Saytdan foydalanish orqali siz ushbu Shartlarni to'liq qabul qilasiz.",
    contact: {
      email: "legal@organicgreen.uz",
      phone: "+998 90 844 08 44"
    }
  },
  ru: {
    title: "Условия Использования",
    lastUpdated: "Последнее обновление: 2025-10-07",
    intro: "Настоящие Условия использования (\"Условия\") регулируют использование сайта www.organicgreen.uz и связанных сервисов. Используя сайт, вы соглашаетесь с данными Условиями.",
    sections: [
      {
        icon: BookOpen,
        title: "1. Определения",
        content: [
          "1.1. \"Компания\" - ООО Organic Green Uzbekistan",
          "1.2. \"Пользователь\" - любое физическое или юридическое лицо, использующее сайт",
          "1.3. \"Сервисы\" - все продукты и услуги, предоставляемые через сайт",
          "1.4. \"Контент\" - все тексты, изображения, видео и другие материалы на сайте"
        ]
      },
      {
        icon: ShieldCheck,
        title: "2. Аккаунты и Регистрация",
        content: [
          "2.1. Предоставляйте точную и полную информацию при создании аккаунта",
          "2.2. Вы несете ответственность за безопасность пароля",
          "2.3. Немедленно сообщайте о несанкционированном использовании аккаунта",
          "2.4. Одно лицо может создать только один аккаунт"
        ]
      },
      {
        icon: AlertTriangle,
        title: "3. Правила Использования",
        content: [
          "3.1. Используйте сайт только в законных целях",
          "3.2. Уважайте права других пользователей",
          "3.3. Попытки нарушения безопасности запрещены",
          "3.4. Распространение спама и вредоносного контента недопустимо",
          "3.5. Не нарушайте права интеллектуальной собственности"
        ]
      },
      {
        icon: CreditCard,
        title: "4. Заказы и Платежи",
        content: [
          "4.1. Размещение заказа представляет собой предложение о покупке",
          "4.2. Цены могут изменяться без предварительного уведомления",
          "4.3. Платежи осуществляются через безопасную платежную систему",
          "4.4. Политика отмены и возврата определяется отдельно",
          "4.5. Компания имеет право принять или отклонить заказ"
        ]
      },
      {
        icon: Scale,
        title: "5. Интеллектуальная Собственность",
        content: [
          "5.1. Весь контент сайта принадлежит Компании",
          "5.2. Несанкционированное копирование и распространение запрещено",
          "5.3. Торговые марки и логотипы защищены",
          "5.4. Пользователи отвечают за свой контент"
        ]
      },
      {
        icon: Gavel,
        title: "6. Ограничение Ответственности",
        content: [
          "6.1. Сайт предоставляется \"как есть\"",
          "6.2. Компания не несет ответственности за косвенный ущерб",
          "6.3. Ответственность за технические сбои ограничена",
          "6.4. Нет ответственности за сторонние сервисы"
        ]
      },
      {
        icon: Globe,
        title: "7. Применимое Право",
        content: [
          "7.1. Данные Условия регулируются законодательством Республики Узбекистан",
          "7.2. Споры решаются мирным путем",
          "7.3. Судебные иски рассматриваются в судах города Ташкента",
          "7.4. Применяются также нормы международного права"
        ]
      }
    ],
    acceptance: "Используя сайт, вы полностью принимаете данные Условия.",
    contact: {
      email: "legal@organicgreen.uz",
      phone: "+998 90 844 08 44"
    }
  },
  en: {
    title: "Terms of Service",
    lastUpdated: "Last updated: October 7, 2025",
    intro: "These Terms of Service (\"Terms\") govern the use of www.organicgreen.uz and related services. By using the site, you agree to these Terms.",
    sections: [
      {
        icon: BookOpen,
        title: "1. Definitions",
        content: [
          "1.1. \"Company\" - Organic Green Uzbekistan LLC",
          "1.2. \"User\" - any individual or legal entity using the site",
          "1.3. \"Services\" - all products and services provided through the site",
          "1.4. \"Content\" - all texts, images, videos and other materials on the site"
        ]
      },
      {
        icon: ShieldCheck,
        title: "2. Accounts and Registration",
        content: [
          "2.1. Provide accurate and complete information when creating an account",
          "2.2. You are responsible for password security",
          "2.3. Report unauthorized account use immediately",
          "2.4. One person may create only one account"
        ]
      },
      {
        icon: AlertTriangle,
        title: "3. Usage Rules",
        content: [
          "3.1. Use the site only for lawful purposes",
          "3.2. Respect the rights of other users",
          "3.3. Attempts to breach security are prohibited",
          "3.4. Distribution of spam and malicious content is not allowed",
          "3.5. Do not violate intellectual property rights"
        ]
      },
      {
        icon: CreditCard,
        title: "4. Orders and Payments",
        content: [
          "4.1. Placing an order constitutes a purchase offer",
          "4.2. Prices may change without prior notice",
          "4.3. Payments are processed through secure payment systems",
          "4.4. Cancellation and return policy is determined separately",
          "4.5. Company has the right to accept or decline orders"
        ]
      },
      {
        icon: Scale,
        title: "5. Intellectual Property",
        content: [
          "5.1. All site content belongs to the Company",
          "5.2. Unauthorized copying and distribution is prohibited",
          "5.3. Trademarks and logos are protected",
          "5.4. Users are responsible for their content"
        ]
      },
      {
        icon: Gavel,
        title: "6. Limitation of Liability",
        content: [
          "6.1. The site is provided \"as is\"",
          "6.2. Company is not liable for indirect damages",
          "6.3. Liability for technical failures is limited",
          "6.4. No liability for third-party services"
        ]
      },
      {
        icon: Globe,
        title: "7. Applicable Law",
        content: [
          "7.1. These Terms are governed by the laws of the Republic of Uzbekistan",
          "7.2. Disputes are resolved peacefully",
          "7.3. Legal actions are heard in Tashkent city courts",
          "7.4. International law provisions also apply"
        ]
      }
    ],
    acceptance: "By using the site, you fully accept these Terms.",
    contact: {
      email: "legal@organicgreen.uz",
      phone: "+998 90 844 08 44"
    }
  }
};

export default function TermsOfServiceContent() {
  const { language } = useLanguage();
  const content = termsContent[language as keyof typeof termsContent] || termsContent.uz;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
          <div className="flex items-center justify-center text-gray-600 mb-6">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{content.lastUpdated}</span>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-700 leading-relaxed text-lg">{content.intro}</p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {content.sections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="flex items-center text-white">
                  <section.icon className="w-8 h-8 mr-4" />
                  <h2 className="text-2xl font-semibold">{section.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <p key={itemIndex} className="text-gray-700 leading-relaxed">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Acceptance Notice */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg text-white p-8 text-center">
          <p className="text-lg font-medium mb-4">{content.acceptance}</p>
          <div className="space-y-2">
            <p>{content.contact.email}</p>
            <p>{content.contact.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}