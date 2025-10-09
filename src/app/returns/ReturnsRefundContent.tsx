"use client";

import { useLanguage } from "@/lib/language";
import { Calendar, RotateCcw, DollarSign, Clock, CheckCircle2, AlertTriangle, RefreshCw, Shield } from "lucide-react";

const returnsContent = {
  uz: {
    title: "Qaytarish va Pulni Qaytarish Siyosati",
    lastUpdated: "Oxirgi yangilanish: 2025-10-07",
    intro: "Organic Green Uzbekistan mijozlar memnuniyatini birinchi o'ringa qo'yadi. Agar mahsulot sizni qoniqtirmasa, biz uni oson qaytarish va to'liq pulni qaytarish imkoniyatini taklif qilamiz.",
    sections: [
      {
        icon: Clock,
        title: "1. Qaytarish Muddatlari",
        content: [
          "🥬 Taze mahsulotlar: Yetkazib berilgan kundan 24 soat ichida",
          "🌱 Mikrozelenlar: 48 soat ichida (to'g'ri saqlash sharoitida)",
          "🥒 Qaytarib ishlanmagan mahsulotlar: 72 soat ichida",
          "📦 Qadoqlangan mahsulotlar: 7 kun ichida (ochilmagan holda)",
          "🌿 Quritilgan mahsulotlar: 30 kun ichida",
          "🎁 Sovg'a to'plamlar: 14 kun ichida",
          "Muddatlar yetkazib berish sanasidan boshlanadi"
        ]
      },
      {
        icon: CheckCircle2,
        title: "2. Qaytarish Shartlari",
        content: [
          "✅ Mahsulot asl holatida bo'lishi kerak",
          "✅ Ochilmagan qadoqlama (agar yo'l-yo'riq bera olsangiz)",
          "✅ Barcha yorliqlar va etiketalar saqlanishi",
          "✅ Chek yoki buyurtma raqami bo'lishi",
          "✅ Fotosurat bilan mahsulot holati tasdiqlanishi",
          "✅ Qaytarish sababini ko'rsatish",
          "✅ To'g'ri saqlash sharoitlariga rioya qilish",
          "Bu shartlar mijoz va kompaniya huquqlarini himoya qiladi"
        ]
      },
      {
        icon: RefreshCw,
        title: "3. Qaytarish Jarayoni",
        content: [
          "1️⃣ Bog'lanish: +998 90 844 08 44 raqamiga qo'ng'iroq qiling",
          "2️⃣ Ma'lumot berish: Buyurtma raqami va qaytarish sababini ayting",
          "3️⃣ Rasm yuborish: Mahsulot holatining rasmini jo'nating",
          "4️⃣ Tasdiqlash: Bizning mutaxassislarimiz ko'rib chiqadi",
          "5️⃣ Yig'ib olish: Kuryerimiz mahsulotni olib ketadi",
          "6️⃣ Tekshirish: Mahsulot holatini tekshiramiz",
          "7️⃣ Qaytarish: Pulni 3-5 ish kuni ichida qaytaramiz",
          "Butun jarayon 24-48 soat ichida amalga oshiriladi"
        ]
      },
      {
        icon: DollarSign,
        title: "4. Pulni Qaytarish",
        content: [
          "💳 Bank kartasiga: 3-5 ish kuni ichida",
          "💰 Naqd pul: Darhol (ofisga kelganingizda)",
          "📱 Mobil to'lov: 1-3 ish kuni ichida",
          "🏦 Bank hisobiga: 5-7 ish kuni ichida",
          "💎 Bonus ball: Darhol hisobingizga",
          "🔄 To'liq pulni qaytarish: Yetkazib berish xarajati bilan birga",
          "📊 Qisman qaytarish: Faqat buzilgan mahsulotlar uchun",
          "Barcha qaytarishlar to'liq va shaffof amalga oshiriladi"
        ]
      },
      {
        icon: Shield,
        title: "5. Kafolat va Himoya",
        content: [
          "🛡️ 100% sifat kafolati: Barcha organik mahsulotlar uchun",
          "🔒 Pulni qaytarish kafolati: Shartlarni bajargan holda",
          "🌟 Mijoz memnuniyati: Bizning asosiy maqsadimiz",
          "⚡ Tezkor xizmat: 24 soat ichida javob",
          "🎯 Individual yondashuv: Har bir holatni alohida ko'ramiz",
          "📞 Doimiy aloqa: Jarayon davomida xabardor qilamiz",
          "🏆 Yuqori standartlar: ISO va organik sertifikatlar",
          "Sizning memnunligingiz - bizning muvaffaqiyatimiz!"
        ]
      },
      {
        icon: AlertTriangle,
        title: "6. Maxsus Holatlar",
        content: [
          "🚫 Qaytarib bo'lmaydigan mahsulotlar:",
          "   • Ishlatilgan yoki iste'mol qilingan mahsulotlar",
          "   • Noto'g'ri saqlangan mahsulotlar",
          "   • Muddat o'tgan mahsulotlar (mijoz aybida)",
          "   • Shaxsiy gigiena mahsulotlari",
          "⚠️ Maxsus holatlar:",
          "   • Allergik reaktsiya: Darhol qaytarish",
          "   • Yetkazib berishda zarar: To'liq kompensatsiya",
          "   • Sifatsiz mahsulot: Pulni qaytarish + kompensatsiya",
          "Har qanday noaniq holatda biz bilan bog'laning"
        ]
      }
    ],
    satisfaction: {
      title: "Mijoz Memnuniyati Kafolati",
      description: "Agar mahsulotlarimiz sizni to'liq qoniqtirmasa, biz sizga to'liq pulni qaytaramiz. Sizning memnunligingiz bizning eng muhim maqsadimiz!",
      features: [
        "💯 100% pulni qaytarish kafolati",
        "⚡ 24 soat ichida javob berish",
        "🚀 Tezkor qaytarish jarayoni",
        "🤝 Individual mijoz xizmati",
        "📞 24/7 qo'llab-quvvatlash",
        "🏆 Yuqori sifat standartlari"
      ]
    },
    contact: {
      title: "Qaytarish Bo'yicha Yordam",
      description: "Qaytarish bilan bog'liq savollaringiz bo'lsa:",
      phone: "+998 90 844 08 44",
      email: "returns@organicgreen.uz",
      telegram: "@organicgreen_returns",
      workingHours: "Ish vaqti: 8:00 - 20:00 (har kuni)"
    }
  },
  ru: {
    title: "Политика Возвратов и Возмещений",
    lastUpdated: "Последнее обновление: 2025-10-07",
    intro: "Organic Green Uzbekistan ставит удовлетворенность клиентов на первое место. Если продукт вас не устраивает, мы предлагаем легкий возврат и полное возмещение средств.",
    sections: [
      {
        icon: Clock,
        title: "1. Сроки Возврата",
        content: [
          "🥬 Свежие продукты: в течение 24 часов с момента доставки",
          "🌱 Микрозелень: в течение 48 часов (при правильном хранении)",
          "🥒 Необработанные продукты: в течение 72 часов",
          "📦 Упакованные продукты: в течение 7 дней (в нераспечатанном виде)",
          "🌿 Сушеные продукты: в течение 30 дней",
          "🎁 Подарочные наборы: в течение 14 дней",
          "Сроки начинаются с даты доставки"
        ]
      },
      {
        icon: CheckCircle2,
        title: "2. Условия Возврата",
        content: [
          "✅ Продукт должен быть в первоначальном состоянии",
          "✅ Нераспечатанная упаковка (если можете объяснить)",
          "✅ Сохранены все ярлыки и этикетки",
          "✅ Наличие чека или номера заказа",
          "✅ Подтверждение состояния продукта фотографией",
          "✅ Указание причины возврата",
          "✅ Соблюдение правильных условий хранения",
          "Эти условия защищают права клиента и компании"
        ]
      },
      {
        icon: RefreshCw,
        title: "3. Процесс Возврата",
        content: [
          "1️⃣ Связь: позвоните по номеру +998 90 844 08 44",
          "2️⃣ Информация: сообщите номер заказа и причину возврата",
          "3️⃣ Отправка фото: пришлите фотографию состояния продукта",
          "4️⃣ Подтверждение: наши специалисты рассмотрят",
          "5️⃣ Забор: наш курьер заберет продукт",
          "6️⃣ Проверка: проверяем состояние продукта",
          "7️⃣ Возврат: возвращаем деньги в течение 3-5 рабочих дней",
          "Весь процесс выполняется в течение 24-48 часов"
        ]
      },
      {
        icon: DollarSign,
        title: "4. Возврат Средств",
        content: [
          "💳 На банковскую карту: в течение 3-5 рабочих дней",
          "💰 Наличными: немедленно (при визите в офис)",
          "📱 Мобильный платеж: в течение 1-3 рабочих дней",
          "🏦 На банковский счет: в течение 5-7 рабочих дней",
          "💎 Бонусные баллы: немедленно на ваш счет",
          "🔄 Полный возврат: включая стоимость доставки",
          "📊 Частичный возврат: только за испорченные продукты",
          "Все возвраты осуществляются полно и прозрачно"
        ]
      },
      {
        icon: Shield,
        title: "5. Гарантия и Защита",
        content: [
          "🛡️ 100% гарантия качества: для всех органических продуктов",
          "🔒 Гарантия возврата денег: при соблюдении условий",
          "🌟 Удовлетворенность клиентов: наша основная цель",
          "⚡ Быстрое обслуживание: ответ в течение 24 часов",
          "🎯 Индивидуальный подход: каждый случай рассматриваем отдельно",
          "📞 Постоянная связь: уведомляем о процессе",
          "🏆 Высокие стандарты: ISO и органические сертификаты",
          "Ваше удовлетворение - наш успех!"
        ]
      },
      {
        icon: AlertTriangle,
        title: "6. Особые Случаи",
        content: [
          "🚫 Невозвратные продукты:",
          "   • Использованные или потребленные продукты",
          "   • Неправильно хранившиеся продукты",
          "   • Просроченные продукты (по вине клиента)",
          "   • Продукты личной гигиены",
          "⚠️ Особые случаи:",
          "   • Аллергическая реакция: немедленный возврат",
          "   • Повреждение при доставке: полная компенсация",
          "   • Некачественный продукт: возврат + компенсация",
          "При любых неясных ситуациях свяжитесь с нами"
        ]
      }
    ],
    satisfaction: {
      title: "Гарантия Удовлетворенности Клиентов",
      description: "Если наши продукты вас полностью не устраивают, мы вернем вам полную стоимость. Ваше удовлетворение - наша важнейшая цель!",
      features: [
        "💯 100% гарантия возврата денег",
        "⚡ Ответ в течение 24 часов",
        "🚀 Быстрый процесс возврата",
        "🤝 Индивидуальное обслуживание клиентов",
        "📞 Поддержка 24/7",
        "🏆 Высокие стандарты качества"
      ]
    },
    contact: {
      title: "Помощь по Возвратам",
      description: "Если у вас есть вопросы по возвратам:",
      phone: "+998 90 844 08 44",
      email: "returns@organicgreen.uz",
      telegram: "@organicgreen_returns",
      workingHours: "Рабочее время: 8:00 - 20:00 (ежедневно)"
    }
  },
  en: {
    title: "Returns & Refunds Policy",
    lastUpdated: "Last updated: October 7, 2025",
    intro: "Organic Green Uzbekistan puts customer satisfaction first. If a product doesn't satisfy you, we offer easy returns and full refunds.",
    sections: [
      {
        icon: Clock,
        title: "1. Return Timeframes",
        content: [
          "🥬 Fresh products: within 24 hours of delivery",
          "🌱 Microgreens: within 48 hours (with proper storage)",
          "🥒 Unprocessed products: within 72 hours",
          "📦 Packaged products: within 7 days (unopened)",
          "🌿 Dried products: within 30 days",
          "🎁 Gift sets: within 14 days",
          "Timeframes start from delivery date"
        ]
      },
      {
        icon: CheckCircle2,
        title: "2. Return Conditions",
        content: [
          "✅ Product must be in original condition",
          "✅ Unopened packaging (if you can explain)",
          "✅ All labels and tags preserved",
          "✅ Receipt or order number available",
          "✅ Product condition confirmed with photo",
          "✅ Return reason specified",
          "✅ Proper storage conditions maintained",
          "These conditions protect both customer and company rights"
        ]
      },
      {
        icon: RefreshCw,
        title: "3. Return Process",
        content: [
          "1️⃣ Contact: call +998 90 844 08 44",
          "2️⃣ Information: provide order number and return reason",
          "3️⃣ Send photo: send picture of product condition",
          "4️⃣ Confirmation: our specialists will review",
          "5️⃣ Collection: our courier will pick up the product",
          "6️⃣ Inspection: we check product condition",
          "7️⃣ Refund: money returned within 3-5 business days",
          "Entire process completed within 24-48 hours"
        ]
      },
      {
        icon: DollarSign,
        title: "4. Refund Process",
        content: [
          "💳 To bank card: within 3-5 business days",
          "💰 Cash: immediately (when visiting office)",
          "📱 Mobile payment: within 1-3 business days",
          "🏦 To bank account: within 5-7 business days",
          "💎 Bonus points: immediately to your account",
          "🔄 Full refund: including delivery costs",
          "📊 Partial refund: only for damaged products",
          "All refunds are processed fully and transparently"
        ]
      },
      {
        icon: Shield,
        title: "5. Guarantee and Protection",
        content: [
          "🛡️ 100% quality guarantee: for all organic products",
          "🔒 Money-back guarantee: when conditions are met",
          "🌟 Customer satisfaction: our primary goal",
          "⚡ Fast service: response within 24 hours",
          "🎯 Individual approach: each case reviewed separately",
          "📞 Constant communication: we keep you informed",
          "🏆 High standards: ISO and organic certificates",
          "Your satisfaction is our success!"
        ]
      },
      {
        icon: AlertTriangle,
        title: "6. Special Cases",
        content: [
          "🚫 Non-returnable products:",
          "   • Used or consumed products",
          "   • Improperly stored products",
          "   • Expired products (customer fault)",
          "   • Personal hygiene products",
          "⚠️ Special cases:",
          "   • Allergic reaction: immediate return",
          "   • Delivery damage: full compensation",
          "   • Poor quality product: refund + compensation",
          "Contact us for any unclear situations"
        ]
      }
    ],
    satisfaction: {
      title: "Customer Satisfaction Guarantee",
      description: "If our products don't fully satisfy you, we'll return your full payment. Your satisfaction is our most important goal!",
      features: [
        "💯 100% money-back guarantee",
        "⚡ Response within 24 hours",
        "🚀 Fast return process",
        "🤝 Individual customer service",
        "📞 24/7 support",
        "🏆 High quality standards"
      ]
    },
    contact: {
      title: "Returns Support",
      description: "If you have questions about returns:",
      phone: "+998 90 844 08 44",
      email: "returns@organicgreen.uz",
      telegram: "@organicgreen_returns",
      workingHours: "Working hours: 8:00 - 20:00 (daily)"
    }
  }
};

export default function ReturnsRefundContent() {
  const { language } = useLanguage();
  const content = returnsContent[language as keyof typeof returnsContent] || returnsContent.uz;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-16">
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
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
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

        {/* Customer Satisfaction Guarantee */}
        <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
            <div className="flex items-center text-white">
              <Shield className="w-8 h-8 mr-4" />
              <h2 className="text-2xl font-semibold">{content.satisfaction.title}</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed text-lg mb-6">{content.satisfaction.description}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {content.satisfaction.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg text-white p-8 text-center">
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