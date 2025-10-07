"use client";

import { useLanguage } from "@/lib/language";
import { Calendar, Mail, Phone, Shield, Lock, Eye, Users, FileText } from "lucide-react";

const privacyContent = {
  uz: {
    title: "Maxfiylik Siyosati",
    lastUpdated: "Oxirgi yangilanish: 2025-10-07",
    intro: "Ushbu Maxfiylik siyosati Organic Green Uzbekistan (\"Kompaniya\", \"biz\", \"bizning\") tomonidan www.organicgreen.uz saytida va unga tegishli xizmatlarda foydalanuvchilar ma'lumotlarini qanday yig'ish, ishlatish va himoya qilishimizni tushuntiradi.",
    sections: [
      {
        icon: FileText,
        title: "1. Yig'iladigan Ma'lumotlar",
        content: [
          "1.1. Shaxsiy ma'lumotlar: To'liq ism, telefon raqam, elektron pochta manzili",
          "1.2. Yetkazib berish ma'lumotlari: Manzil, shahar, viloyat (buyurtma berish vaqtida)",
          "1.3. Texnik ma'lumotlar: IP manzil, brauzer turi, qurilma ma'lumotlari",
          "1.4. Foydalanish ma'lumotlari: Sahifa ko'rishlari, vaqt, harakat yo'llari",
          "1.5. Cookie va o'xshash texnologiyalar orqali olingan ma'lumotlar"
        ]
      },
      {
        icon: Eye,
        title: "2. Ma'lumotlardan Foydalanish",
        content: [
          "2.1. Buyurtmalarni qayta ishlash va yetkazib berish",
          "2.2. Mijozlar bilan bog'lanish va qo'llab-quvvatlash",
          "2.3. Xavfsizlikni ta'minlash va firibgarlikni oldini olish",
          "2.4. Xizmat sifatini yaxshilash va tahlil qilish",
          "2.5. Marketing xabarlari yuborish (rozilik asosida)",
          "2.6. Qonuniy majburiyatlarni bajarish"
        ]
      },
      {
        icon: Users,
        title: "3. Google AdSense va Uchinchi Tomon Xizmatlari",
        content: [
          "Biz Google AdSense va boshqa reklama xizmatlaridan foydalanamiz. Ular:",
          "• Cookie fayllaridan foydalanishi mumkin",
          "• Sizning faoliyatingiz haqida anonim ma'lumot yig'ishi mumkin",
          "• Moslashtirilgan reklamalar ko'rsatish uchun ishlatiladi",
          "Reklama sozlamalarini Google Ads Settings orqali boshqarishingiz mumkin."
        ]
      },
      {
        icon: Lock,
        title: "4. Cookie Fayllari",
        content: [
          "Biz quyidagi turdagi cookie fayllaridan foydalanamiz:",
          "• Zaruriy cookie: Sayt ishlashi uchun",
          "• Tahliliy cookie: Sayt foydalanishini tahlil qilish",
          "• Marketing cookie: Reklamalarni moslash",
          "Brauzer sozlamalarida cookie fayllarini boshqarishingiz mumkin."
        ]
      },
      {
        icon: Shield,
        title: "5. Ma'lumotlar Xavfsizligi",
        content: [
          "Biz ma'lumotlaringizni himoya qilish uchun:",
          "• SSL shifrlash texnologiyasidan foydalanamiz",
          "• Xavfsiz serverlardan foydalanamiz",
          "• Kirish huquqlarini cheklaymiz",
          "• Muntazam xavfsizlik auditlari o'tkazamiz"
        ]
      },
      {
        icon: Users,
        title: "6. Foydalanuvchi Huquqlari",
        content: [
          "Sizning huquqlaringiz:",
          "• Ma'lumotlaringizga kirish huquqi",
          "• Ma'lumotlarni to'g'rilash huquqi",
          "• Ma'lumotlarni o'chirish huquqi",
          "• Qayta ishlashni cheklash huquqi",
          "• Ma'lumotlarni ko'chirish huquqi",
          "Huquqlaringizdan foydalanish uchun: privacy@organicgreen.uz"
        ]
      }
    ],
    contact: {
      title: "Aloqa Ma'lumotlari",
      email: "privacy@organicgreen.uz",
      phone: "+998 90 844 08 44",
      address: "Toshkent shahar, Mirzo Ulug'bek tumani"
    }
  },
  ru: {
    title: "Политика Конфиденциальности",
    lastUpdated: "Последнее обновление: 2025-10-07",
    intro: "Настоящая Политика конфиденциальности объясняет, как Organic Green Uzbekistan (\"Компания\", \"мы\") собирает, использует и защищает информацию пользователей на сайте www.organicgreen.uz и связанных сервисах.",
    sections: [
      {
        icon: FileText,
        title: "1. Собираемая Информация",
        content: [
          "1.1. Личные данные: Полное имя, номер телефона, адрес электронной почты",
          "1.2. Данные доставки: Адрес, город, область (при оформлении заказа)",
          "1.3. Технические данные: IP-адрес, тип браузера, информация об устройстве",
          "1.4. Данные использования: Просмотры страниц, время, пути навигации",
          "1.5. Информация, полученная через cookie и аналогичные технологии"
        ]
      },
      {
        icon: Eye,
        title: "2. Использование Информации",
        content: [
          "2.1. Обработка и доставка заказов",
          "2.2. Связь с клиентами и поддержка",
          "2.3. Обеспечение безопасности и предотвращение мошенничества",
          "2.4. Улучшение и анализ качества сервиса",
          "2.5. Отправка маркетинговых сообщений (с согласия)",
          "2.6. Выполнение юридических обязательств"
        ]
      },
      {
        icon: Users,
        title: "3. Google AdSense и Сторонние Сервисы",
        content: [
          "Мы используем Google AdSense и другие рекламные сервисы. Они могут:",
          "• Использовать файлы cookie",
          "• Собирать анонимную информацию о вашей активности",
          "• Показывать персонализированную рекламу",
          "Настройки рекламы можно управлять через Google Ads Settings."
        ]
      },
      {
        icon: Lock,
        title: "4. Файлы Cookie",
        content: [
          "Мы используем следующие типы cookie:",
          "• Необходимые cookie: Для работы сайта",
          "• Аналитические cookie: Для анализа использования сайта",
          "• Маркетинговые cookie: Для персонализации рекламы",
          "Вы можете управлять cookie в настройках браузера."
        ]
      },
      {
        icon: Shield,
        title: "5. Безопасность Данных",
        content: [
          "Для защиты ваших данных мы:",
          "• Используем SSL-шифрование",
          "• Используем безопасные серверы",
          "• Ограничиваем права доступа",
          "• Проводим регулярные аудиты безопасности"
        ]
      },
      {
        icon: Users,
        title: "6. Права Пользователей",
        content: [
          "Ваши права:",
          "• Право доступа к данным",
          "• Право исправления данных",
          "• Право удаления данных",
          "• Право ограничения обработки",
          "• Право переносимости данных",
          "Для реализации прав: privacy@organicgreen.uz"
        ]
      }
    ],
    contact: {
      title: "Контактная Информация",
      email: "privacy@organicgreen.uz",
      phone: "+998 90 844 08 44",
      address: "г. Ташкент, Мирзо-Улугбекский район"
    }
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: October 7, 2025",
    intro: "This Privacy Policy explains how Organic Green Uzbekistan (\"Company\", \"we\") collects, uses, and protects user information on www.organicgreen.uz and related services.",
    sections: [
      {
        icon: FileText,
        title: "1. Information We Collect",
        content: [
          "1.1. Personal information: Full name, phone number, email address",
          "1.2. Delivery information: Address, city, region (when placing orders)",
          "1.3. Technical information: IP address, browser type, device information",
          "1.4. Usage information: Page views, time, navigation paths",
          "1.5. Information obtained through cookies and similar technologies"
        ]
      },
      {
        icon: Eye,
        title: "2. How We Use Information",
        content: [
          "2.1. Processing and delivering orders",
          "2.2. Customer communication and support",
          "2.3. Security and fraud prevention",
          "2.4. Service quality improvement and analysis",
          "2.5. Sending marketing messages (with consent)",
          "2.6. Legal compliance"
        ]
      },
      {
        icon: Users,
        title: "3. Google AdSense and Third-Party Services",
        content: [
          "We use Google AdSense and other advertising services. They may:",
          "• Use cookie files",
          "• Collect anonymous information about your activity",
          "• Display personalized advertisements",
          "You can manage ad settings through Google Ads Settings."
        ]
      },
      {
        icon: Lock,
        title: "4. Cookies",
        content: [
          "We use the following types of cookies:",
          "• Essential cookies: For website functionality",
          "• Analytics cookies: For website usage analysis",
          "• Marketing cookies: For ad personalization",
          "You can manage cookies in your browser settings."
        ]
      },
      {
        icon: Shield,
        title: "5. Data Security",
        content: [
          "To protect your data, we:",
          "• Use SSL encryption technology",
          "• Use secure servers",
          "• Limit access rights",
          "• Conduct regular security audits"
        ]
      },
      {
        icon: Users,
        title: "6. User Rights",
        content: [
          "Your rights include:",
          "• Right to access data",
          "• Right to correct data",
          "• Right to delete data",
          "• Right to restrict processing",
          "• Right to data portability",
          "To exercise your rights: privacy@organicgreen.uz"
        ]
      }
    ],
    contact: {
      title: "Contact Information",
      email: "privacy@organicgreen.uz",
      phone: "+998 90 844 08 44",
      address: "Tashkent city, Mirzo-Ulugbek district"
    }
  }
};

export default function PrivacyPolicyContent() {
  const { language } = useLanguage();
  const content = privacyContent[language as keyof typeof privacyContent] || privacyContent.uz;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-16">
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
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
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

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg text-white p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">{content.contact.title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <Mail className="w-6 h-6 mr-3" />
              <div>
                <p className="font-medium">Email</p>
                <p>{content.contact.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-6 h-6 mr-3" />
              <div>
                <p className="font-medium">Telefon</p>
                <p>{content.contact.phone}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p>{content.contact.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}