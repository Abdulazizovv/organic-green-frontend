"use client";

import { useLanguage } from "@/lib/language";
import { Calendar, Shield, Award, Leaf, CheckCircle, Clock, Star, AlertTriangle } from "lucide-react";

const warrantyContent = {
  uz: {
    title: "Mahsulot Kafolati va Sifat Kafolati",
    lastUpdated: "Oxirgi yangilanish: 2025-10-07",
    intro: "Organic Green Uzbekistan barcha organik mahsulotlari uchun to'liq sifat kafolati beradi. Bizning kafolatimiz mahsulotlarimizning yuqori sifati va organik sertifikatlariga asoslanadi.",
    sections: [
      {
        icon: Shield,
        title: "1. Asosiy Kafolat Shartlari",
        content: [
          "🛡️ 100% organik sifat kafolati: Barcha mahsulotlar uchun",
          "🌿 Tabiiy va kimyoviy moddalar yo'qligi",
          "📜 Xalqaro organik sertifikatlar: EU va USDA standartlari",
          "🔬 Laboratoriya testlari: Har bir partiya uchun",
          "🌱 GMO yo'qligi kafolati: Genetik o'zgartirish yo'q",
          "💚 Ekologik toza ishlab chiqarish jarayoni",
          "📋 Har bir mahsulot uchun sifat sertifikati",
          "Bizning kafolatimiz - sizning ishonchingiz!"
        ]
      },
      {
        icon: Leaf,
        title: "2. Mikrozelenlar Kafolati",
        content: [
          "🌱 Yangilik kafolati: Terilgan kundan 5-7 kun",
          "❄️ Sovutish tizimi: 2-4°C da saqlash",
          "💧 Toza suv bilan o'stirilgan: Filtratsiyalangan suv",
          "🌞 Tabiiy yorug'lik: Maxsus LED nurlar",
          "🧪 Kimyoviy o'g'itlar yo'q: Faqat organik",
          "🔬 Mikrobiologik xavfsizlik: Laboratoirya tekshiruvi",
          "📦 Maxsus qadoqlash: Yangilikni saqlash uchun",
          "🏆 Premium sifat: Eng yuqori standartlar",
          "Mikrozelenlarimiz har doim toza va yangi!"
        ]
      },
      {
        icon: Award,
        title: "3. Sifat Standartlari",
        content: [
          "🏅 ISO 22000: Oziq-ovqat xavfsizligi",
          "🌍 EU Organic: Yevropa organik standarti",
          "🇺🇸 USDA Organic: Amerika organik sertifikati",
          "🌿 Biosuisse: Shveytsariya organik belgisi",
          "🔬 HACCP: Xavfsizlik nazorat tizimi",
          "🌡️ Harorat monitoring: Doimiy nazorat",
          "📊 Sifat nazorati: Har bosqichda tekshiruv",
          "📋 Dokumentatsiya: To'liq iz qoldirish",
          "Biz faqat yuqori standartlar bilan ishlaymiz!"
        ]
      },
      {
        icon: Clock,
        title: "4. Kafolat Muddatlari",
        content: [
          "🥬 Taze list sabzavotlar: 3-5 kun",
          "🌱 Mikrozelenlar: 5-7 kun",
          "🥒 Mevalar: 7-14 kun",
          "🌿 Quritilgan o'tlar: 12-24 oy",
          "🧄 Ziravorlar: 18-36 oy",
          "🍯 Tabiiy mahsulotlar: 24-60 oy",
          "📦 Qadoqlangan mahsulotlar: Etiketdagi muddat",
          "❄️ Muzlatilgan mahsulotlar: 6-12 oy",
          "Barcha muddatlar to'g'ri saqlash sharoitida!"
        ]
      },
      {
        icon: CheckCircle,
        title: "5. Almashtirish va Ta'mirlash",
        content: [
          "🔄 Bepul almashtirish: Sifatsiz mahsulotlar uchun",
          "⚡ Tezkor almashtirish: 24 soat ichida",
          "🚚 Yetkazib berish: Bepul qayta yetkazib berish",
          "📞 Darhol aloqa: Muammo aniqlanganda",
          "💰 To'liq kompensatsiya: Zarar yetgan holatlarda",
          "🎁 Qo'shimcha sovg'a: Noqulaylik uchun uzr",
          "📋 Hujjatlash: Barcha almashtirishlar yozib olinadi",
          "🏆 Mijoz memnuniyati: Bizning ustuvorligimiz",
          "Har qanday muammoni tezkor hal qilamiz!"
        ]
      },
      {
        icon: AlertTriangle,
        title: "6. Kafolat Chegaralari",
        content: [
          "⚠️ Noto'g'ri saqlash: Kafolat bekor bo'ladi",
          "🌡️ Harorat buzilishi: Mijoz javobgarligi",
          "⏰ Muddat o'tishi: Kafolat amal qilmaydi",
          "🔧 Mexanik zarar: Tashish vaqtidagi zarar",
          "🧪 Kimyoviy ta'sir: Boshqa moddalar bilan aralashish",
          "📦 Qadoq ochilgan: Noto'g'ri qadoqlash",
          "🚫 Noqulay foydalanish: Ko'rsatmalarga qarshi",
          "Kafolat shartlarini o'qishni maslahat beramiz"
        ]
      }
    ],
    certificates: {
      title: "Bizning Sertifikatlarimiz",
      description: "Organic Green Uzbekistan xalqaro sertifikatlar va litsenziyalarga ega:",
      list: [
        "🏅 EU Organic Certification",
        "🇺🇸 USDA Organic Standard",
        "🌿 Biosuisse Certificate",
        "🔬 ISO 22000 Food Safety",
        "📋 HACCP System",
        "🌡️ Cold Chain Certification",
        "🧪 Laboratory Accreditation",
        "📜 Halal Certification"
      ]
    },
    contact: {
      title: "Kafolat Bo'yicha Yordam",
      description: "Kafolat bilan bog'liq savollaringiz bo'lsa:",
      phone: "+998 90 844 08 44",
      email: "warranty@organicgreen.uz",
      telegram: "@organicgreen_warranty",
      workingHours: "Ish vaqti: 8:00 - 20:00 (har kuni)"
    }
  },
  ru: {
    title: "Гарантия на Продукцию и Гарантия Качества",
    lastUpdated: "Последнее обновление: 2025-10-07",
    intro: "Organic Green Uzbekistan предоставляет полную гарантию качества на все органические продукты. Наша гарантия основана на высоком качестве продуктов и органических сертификатах.",
    sections: [
      {
        icon: Shield,
        title: "1. Основные Гарантийные Условия",
        content: [
          "🛡️ 100% гарантия органического качества: для всех продуктов",
          "🌿 Отсутствие натуральных и химических веществ",
          "📜 Международные органические сертификаты: стандарты EU и USDA",
          "🔬 Лабораторные тесты: для каждой партии",
          "🌱 Гарантия отсутствия ГМО: без генетических изменений",
          "💚 Экологически чистый производственный процесс",
          "📋 Сертификат качества для каждого продукта",
          "Наша гарантия - ваше доверие!"
        ]
      },
      {
        icon: Leaf,
        title: "2. Гарантия на Микрозелень",
        content: [
          "🌱 Гарантия свежести: 5-7 дней с момента срезки",
          "❄️ Система охлаждения: хранение при 2-4°C",
          "💧 Выращена на чистой воде: фильтрованная вода",
          "🌞 Естественное освещение: специальные LED лампы",
          "🧪 Без химических удобрений: только органические",
          "🔬 Микробиологическая безопасность: лабораторная проверка",
          "📦 Специальная упаковка: для сохранения свежести",
          "🏆 Премиум качество: высочайшие стандарты",
          "Наша микрозелень всегда чистая и свежая!"
        ]
      },
      {
        icon: Award,
        title: "3. Стандарты Качества",
        content: [
          "🏅 ISO 22000: безопасность пищевых продуктов",
          "🌍 EU Organic: европейский органический стандарт",
          "🇺🇸 USDA Organic: американский органический сертификат",
          "🌿 Biosuisse: швейцарский органический знак",
          "🔬 HACCP: система контроля безопасности",
          "🌡️ Мониторинг температуры: постоянный контроль",
          "📊 Контроль качества: проверка на каждом этапе",
          "📋 Документация: полная прослеживаемость",
          "Мы работаем только с высокими стандартами!"
        ]
      },
      {
        icon: Clock,
        title: "4. Гарантийные Сроки",
        content: [
          "🥬 Свежие листовые овощи: 3-5 дней",
          "🌱 Микрозелень: 5-7 дней",
          "🥒 Фрукты: 7-14 дней",
          "🌿 Сушеные травы: 12-24 месяца",
          "🧄 Специи: 18-36 месяцев",
          "🍯 Натуральные продукты: 24-60 месяцев",
          "📦 Упакованные продукты: срок на этикетке",
          "❄️ Замороженные продукты: 6-12 месяцев",
          "Все сроки при правильных условиях хранения!"
        ]
      },
      {
        icon: CheckCircle,
        title: "5. Замена и Ремонт",
        content: [
          "🔄 Бесплатная замена: для некачественных продуктов",
          "⚡ Быстрая замена: в течение 24 часов",
          "🚚 Доставка: бесплатная повторная доставка",
          "📞 Немедленная связь: при обнаружении проблемы",
          "💰 Полная компенсация: в случае ущерба",
          "🎁 Дополнительный подарок: извинения за неудобства",
          "📋 Документирование: все замены записываются",
          "🏆 Удовлетворенность клиентов: наш приоритет",
          "Быстро решаем любые проблемы!"
        ]
      },
      {
        icon: AlertTriangle,
        title: "6. Ограничения Гарантии",
        content: [
          "⚠️ Неправильное хранение: гарантия аннулируется",
          "🌡️ Нарушение температуры: ответственность клиента",
          "⏰ Истечение срока: гарантия не действует",
          "🔧 Механические повреждения: ущерб при транспортировке",
          "🧪 Химическое воздействие: смешивание с другими веществами",
          "📦 Вскрытая упаковка: неправильная упаковка",
          "🚫 Неправильное использование: против инструкций",
          "Рекомендуем ознакомиться с условиями гарантии"
        ]
      }
    ],
    certificates: {
      title: "Наши Сертификаты",
      description: "Organic Green Uzbekistan имеет международные сертификаты и лицензии:",
      list: [
        "🏅 EU Organic Certification",
        "🇺🇸 USDA Organic Standard",
        "🌿 Biosuisse Certificate",
        "🔬 ISO 22000 Food Safety",
        "📋 HACCP System",
        "🌡️ Cold Chain Certification",
        "🧪 Laboratory Accreditation",
        "📜 Halal Certification"
      ]
    },
    contact: {
      title: "Помощь по Гарантии",
      description: "Если у вас есть вопросы по гарантии:",
      phone: "+998 90 844 08 44",
      email: "warranty@organicgreen.uz",
      telegram: "@organicgreen_warranty",
      workingHours: "Рабочее время: 8:00 - 20:00 (ежедневно)"
    }
  },
  en: {
    title: "Product Warranty & Quality Guarantee",
    lastUpdated: "Last updated: October 7, 2025",
    intro: "Organic Green Uzbekistan provides complete quality guarantee for all organic products. Our warranty is based on high product quality and organic certifications.",
    sections: [
      {
        icon: Shield,
        title: "1. Basic Warranty Terms",
        content: [
          "🛡️ 100% organic quality guarantee: for all products",
          "🌿 No natural and chemical substances",
          "📜 International organic certificates: EU and USDA standards",
          "🔬 Laboratory tests: for each batch",
          "🌱 GMO-free guarantee: no genetic modifications",
          "💚 Environmentally clean production process",
          "📋 Quality certificate for each product",
          "Our guarantee is your trust!"
        ]
      },
      {
        icon: Leaf,
        title: "2. Microgreens Warranty",
        content: [
          "🌱 Freshness guarantee: 5-7 days from cutting",
          "❄️ Cooling system: storage at 2-4°C",
          "💧 Grown with clean water: filtered water",
          "🌞 Natural lighting: special LED lights",
          "🧪 No chemical fertilizers: only organic",
          "🔬 Microbiological safety: laboratory testing",
          "📦 Special packaging: to preserve freshness",
          "🏆 Premium quality: highest standards",
          "Our microgreens are always clean and fresh!"
        ]
      },
      {
        icon: Award,
        title: "3. Quality Standards",
        content: [
          "🏅 ISO 22000: food safety",
          "🌍 EU Organic: European organic standard",
          "🇺🇸 USDA Organic: American organic certificate",
          "🌿 Biosuisse: Swiss organic mark",
          "🔬 HACCP: safety control system",
          "🌡️ Temperature monitoring: constant control",
          "📊 Quality control: inspection at each stage",
          "📋 Documentation: complete traceability",
          "We work only with high standards!"
        ]
      },
      {
        icon: Clock,
        title: "4. Warranty Periods",
        content: [
          "🥬 Fresh leafy vegetables: 3-5 days",
          "🌱 Microgreens: 5-7 days",
          "🥒 Fruits: 7-14 days",
          "🌿 Dried herbs: 12-24 months",
          "🧄 Spices: 18-36 months",
          "🍯 Natural products: 24-60 months",
          "📦 Packaged products: date on label",
          "❄️ Frozen products: 6-12 months",
          "All periods with proper storage conditions!"
        ]
      },
      {
        icon: CheckCircle,
        title: "5. Replacement and Repair",
        content: [
          "🔄 Free replacement: for poor quality products",
          "⚡ Quick replacement: within 24 hours",
          "🚚 Delivery: free re-delivery",
          "📞 Immediate contact: when problem detected",
          "💰 Full compensation: in case of damage",
          "🎁 Additional gift: apology for inconvenience",
          "📋 Documentation: all replacements recorded",
          "🏆 Customer satisfaction: our priority",
          "We quickly solve any problems!"
        ]
      },
      {
        icon: AlertTriangle,
        title: "6. Warranty Limitations",
        content: [
          "⚠️ Improper storage: warranty void",
          "🌡️ Temperature violation: customer responsibility",
          "⏰ Expiration: warranty not applicable",
          "🔧 Mechanical damage: transport damage",
          "🧪 Chemical exposure: mixing with other substances",
          "📦 Opened package: improper packaging",
          "🚫 Improper use: against instructions",
          "We recommend reading warranty terms"
        ]
      }
    ],
    certificates: {
      title: "Our Certificates",
      description: "Organic Green Uzbekistan has international certificates and licenses:",
      list: [
        "🏅 EU Organic Certification",
        "🇺🇸 USDA Organic Standard",
        "🌿 Biosuisse Certificate",
        "🔬 ISO 22000 Food Safety",
        "📋 HACCP System",
        "🌡️ Cold Chain Certification",
        "🧪 Laboratory Accreditation",
        "📜 Halal Certification"
      ]
    },
    contact: {
      title: "Warranty Support",
      description: "If you have warranty questions:",
      phone: "+998 90 844 08 44",
      email: "warranty@organicgreen.uz",
      telegram: "@organicgreen_warranty",
      workingHours: "Working hours: 8:00 - 20:00 (daily)"
    }
  }
};

export default function WarrantyPolicyContent() {
  const { language } = useLanguage();
  const content = warrantyContent[language as keyof typeof warrantyContent] || warrantyContent.uz;

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

        {/* Certificates Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
            <div className="flex items-center text-white">
              <Award className="w-8 h-8 mr-4" />
              <h2 className="text-2xl font-semibold">{content.certificates.title}</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed text-lg mb-6">{content.certificates.description}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {content.certificates.list.map((certificate, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700">{certificate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-lg text-white p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">{content.contact.title}</h2>
          <p className="text-lg mb-6">{content.contact.description}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-medium">{content.contact.phone}</p>
              <p className="font-medium">{content.contact.email}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">{content.contact.telegram}</p>
              <p className="font-medium">{content.contact.workingHours}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}