"use client";

import { useLanguage } from "@/lib/language";
import { Calendar, Cookie, Settings, Eye, Shield, Trash2, CheckCircle, XCircle } from "lucide-react";

const cookieContent = {
  uz: {
    title: "Cookie Fayllari Siyosati",
    lastUpdated: "Oxirgi yangilanish: 2025-10-07",
    intro: "Ushbu Cookie siyosati www.organicgreen.uz saytida cookie fayllari va shunga o'xshash texnologiyalardan qanday foydalanishimizni tushuntiradi.",
    sections: [
      {
        icon: Cookie,
        title: "1. Cookie Fayllari Nima?",
        content: [
          "Cookie fayllari - veb-saytlar tomonidan sizning qurilmangizga saqlanadigan kichik matn fayllari.",
          "Ular saytning normal ishlashi va foydalanuvchi tajribasini yaxshilash uchun ishlatiladi.",
          "Cookie fayllari sizning shaxsiy ma'lumotlaringizni saqlaydi va keyingi tashriflarda saytni tanib olishga yordam beradi."
        ]
      },
      {
        icon: Eye,
        title: "2. Qanday Cookie Fayllari Ishlatamiz",
        content: [
          "🔹 Zaruriy Cookie: Saytning asosiy funksiyalari uchun",
          "🔹 Tahliliy Cookie: Sayt foydalanishini tahlil qilish uchun",
          "🔹 Funktsional Cookie: Foydalanuvchi sozlamalarini saqlash uchun",
          "🔹 Marketing Cookie: Reklamalarni moslashtirish uchun",
          "🔹 Ijtimoiy tarmoq Cookie: Ijtimoiy tarmoq tugmalari uchun"
        ]
      },
      {
        icon: Settings,
        title: "3. Google AdSense Cookie Fayllari",
        content: [
          "Biz Google AdSense xizmati orqali reklamalar ko'rsatamiz.",
          "Google quyidagi cookie fayllaridan foydalanishi mumkin:",
          "• Personalizatsiya qilingan reklamalar ko'rsatish",
          "• Reklama samaradorligini o'lchash",
          "• Foydalanuvchi xulq-atvorini tahlil qilish",
          "Google reklama sozlamalarini ads.google.com orqali boshqarishingiz mumkin."
        ]
      },
      {
        icon: Shield,
        title: "4. Cookie Fayllari Boshqaruvi",
        content: [
          "Siz brauzer sozlamalari orqali cookie fayllarini boshqarishingiz mumkin:",
          "• Barcha cookie fayllarini rad etish",
          "• Muayyan cookie fayllarini o'chirish",
          "• Cookie fayllari haqida ogohlantirishlarni yoqish",
          "• Cookie fayllarini avtomatik o'chirish",
          "Esda tuting: Ba'zi cookie fayllarni o'chirsangiz, sayt to'liq ishlamasligi mumkin."
        ]
      },
      {
        icon: Trash2,
        title: "5. Cookie Fayllarini O'chirish",
        content: [
          "Chrome: Sozlamalar > Maxfiylik > Ma'lumotlarni tozalash",
          "Firefox: Sozlamalar > Maxfiylik > Tarix > Tarixni tozalash",
          "Safari: Safari > Sozlamalar > Maxfiylik > Ma'lumotlarni boshqarish",
          "Edge: Sozlamalar > Maxfiylik > Brauzer ma'lumotlarini tozalash",
          "Mobil qurilmalarda brauzer sozlamalariga o'ting va cache/cookie fayllarini tozalang."
        ]
      }
    ],
    consent: {
      title: "Cookie Fayllariga Rozingiz",
      description: "Saytimizdan foydalanish orqali siz cookie fayllaridan foydalanishga roziglik bildirgan hisoblanasiz.",
      accept: "Qabul qilaman",
      settings: "Sozlamalar"
    },
    contact: {
      title: "Savollar",
      description: "Cookie fayllari haqida savollaringiz bo'lsa, biz bilan bog'laning:",
      email: "privacy@organicgreen.uz",
      phone: "+998 90 844 08 44"
    }
  },
  ru: {
    title: "Политика использования Cookie",
    lastUpdated: "Последнее обновление: 2025-10-07",
    intro: "Данная Политика Cookie объясняет, как мы используем файлы cookie и аналогичные технологии на сайте www.organicgreen.uz.",
    sections: [
      {
        icon: Cookie,
        title: "1. Что такое Cookie файлы?",
        content: [
          "Cookie файлы - это небольшие текстовые файлы, сохраняемые веб-сайтами на вашем устройстве.",
          "Они используются для нормального функционирования сайта и улучшения пользовательского опыта.",
          "Cookie файлы сохраняют ваши личные настройки и помогают сайту узнавать вас при повторных визитах."
        ]
      },
      {
        icon: Eye,
        title: "2. Какие Cookie файлы мы используем",
        content: [
          "🔹 Необходимые Cookie: Для основных функций сайта",
          "🔹 Аналитические Cookie: Для анализа использования сайта",
          "🔹 Функциональные Cookie: Для сохранения пользовательских настроек",
          "🔹 Маркетинговые Cookie: Для персонализации рекламы",
          "🔹 Cookie социальных сетей: Для кнопок социальных сетей"
        ]
      },
      {
        icon: Settings,
        title: "3. Google AdSense Cookie файлы",
        content: [
          "Мы показываем рекламу через сервис Google AdSense.",
          "Google может использовать следующие cookie файлы:",
          "• Показ персонализированной рекламы",
          "• Измерение эффективности рекламы",
          "• Анализ поведения пользователей",
          "Вы можете управлять настройками рекламы Google через ads.google.com."
        ]
      },
      {
        icon: Shield,
        title: "4. Управление Cookie файлами",
        content: [
          "Вы можете управлять cookie файлами через настройки браузера:",
          "• Отклонить все cookie файлы",
          "• Удалить определенные cookie файлы",
          "• Включить уведомления о cookie файлах",
          "• Автоматически удалять cookie файлы",
          "Помните: Если вы удалите некоторые cookie файлы, сайт может работать не полностью."
        ]
      },
      {
        icon: Trash2,
        title: "5. Удаление Cookie файлов",
        content: [
          "Chrome: Настройки > Конфиденциальность > Очистка данных",
          "Firefox: Настройки > Приватность > История > Очистить историю",
          "Safari: Safari > Настройки > Конфиденциальность > Управление данными",
          "Edge: Настройки > Конфиденциальность > Очистка данных браузера",
          "На мобильных устройствах перейдите в настройки браузера и очистите cache/cookie файлы."
        ]
      }
    ],
    consent: {
      title: "Ваше согласие на Cookie файлы",
      description: "Используя наш сайт, вы соглашаетесь на использование cookie файлов.",
      accept: "Принимаю",
      settings: "Настройки"
    },
    contact: {
      title: "Вопросы",
      description: "Если у вас есть вопросы о cookie файлах, свяжитесь с нами:",
      email: "privacy@organicgreen.uz",
      phone: "+998 90 844 08 44"
    }
  },
  en: {
    title: "Cookie Policy",
    lastUpdated: "Last updated: October 7, 2025",
    intro: "This Cookie Policy explains how we use cookies and similar technologies on www.organicgreen.uz.",
    sections: [
      {
        icon: Cookie,
        title: "1. What are Cookies?",
        content: [
          "Cookies are small text files stored by websites on your device.",
          "They are used for normal website functionality and improving user experience.",
          "Cookies save your personal settings and help the site recognize you on return visits."
        ]
      },
      {
        icon: Eye,
        title: "2. Types of Cookies We Use",
        content: [
          "🔹 Essential Cookies: For basic site functionality",
          "🔹 Analytics Cookies: For analyzing site usage",
          "🔹 Functional Cookies: For saving user preferences",
          "🔹 Marketing Cookies: For personalizing advertisements",
          "🔹 Social Media Cookies: For social media buttons"
        ]
      },
      {
        icon: Settings,
        title: "3. Google AdSense Cookies",
        content: [
          "We display ads through Google AdSense service.",
          "Google may use the following cookies:",
          "• Displaying personalized advertisements",
          "• Measuring advertising effectiveness",
          "• Analyzing user behavior",
          "You can manage Google ad settings through ads.google.com."
        ]
      },
      {
        icon: Shield,
        title: "4. Managing Cookies",
        content: [
          "You can manage cookies through your browser settings:",
          "• Reject all cookies",
          "• Delete specific cookies",
          "• Enable cookie notifications",
          "• Automatically delete cookies",
          "Remember: If you delete some cookies, the site may not work fully."
        ]
      },
      {
        icon: Trash2,
        title: "5. Deleting Cookies",
        content: [
          "Chrome: Settings > Privacy > Clear data",
          "Firefox: Settings > Privacy > History > Clear history",
          "Safari: Safari > Preferences > Privacy > Manage data",
          "Edge: Settings > Privacy > Clear browser data",
          "On mobile devices, go to browser settings and clear cache/cookies."
        ]
      }
    ],
    consent: {
      title: "Your Cookie Consent",
      description: "By using our website, you consent to the use of cookies.",
      accept: "I Accept",
      settings: "Settings"
    },
    contact: {
      title: "Questions",
      description: "If you have questions about cookies, contact us:",
      email: "privacy@organicgreen.uz",
      phone: "+998 90 844 08 44"
    }
  }
};

export default function CookiePolicyContent() {
  const { language } = useLanguage();
  const content = cookieContent[language as keyof typeof cookieContent] || cookieContent.uz;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-16">
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
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
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

        {/* Cookie Consent Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">{content.consent.title}</h2>
          </div>
          <p className="text-gray-700 mb-6">{content.consent.description}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              <CheckCircle className="w-5 h-5 inline mr-2" />
              {content.consent.accept}
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              <Settings className="w-5 h-5 inline mr-2" />
              {content.consent.settings}
            </button>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-lg text-white p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">{content.contact.title}</h2>
          <p className="text-lg mb-6">{content.contact.description}</p>
          <div className="space-y-2">
            <p className="font-medium">{content.contact.email}</p>
            <p className="font-medium">{content.contact.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}