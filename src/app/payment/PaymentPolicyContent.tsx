"use client";

import { useLanguage } from "@/lib/language";
import { Calendar, CreditCard, Shield, Smartphone, DollarSign, Lock, AlertTriangle, CheckCircle } from "lucide-react";

const paymentContent = {
  uz: {
    title: "To'lov Usullari va Xavfsizlik",
    lastUpdated: "Oxirgi yangilanish: 2025-10-07",
    intro: "Organic Green Uzbekistan organik mahsulotlar uchun xavfsiz va qulay to'lov usullarini taklif qiladi. Bizning to'lov tizimlarimiz yuqori xavfsizlik standartlariga javob beradi.",
    sections: [
      {
        icon: CreditCard,
        title: "1. Mavjud To'lov Usullari",
        content: [
          "💳 Bank kartalari: Visa, MasterCard, UzCard, Humo",
          "💰 Naqd pul: Yetkazib berish vaqtida",
          "📱 Mobil to'lovlar: Click, Payme, TBC Pay",
          "🏦 Bank o'tkazmasi: Yuridik shaxslar uchun",
          "💵 Valyuta: Faqat O'zbek so'mi",
          "📊 To'lov rejalari: Katta buyurtmalar uchun bo'lib to'lash",
          "Barcha to'lov usullari xavfsiz va tez ishlaydi!"
        ]
      },
      {
        icon: Shield,
        title: "2. Xavfsizlik Choralari",
        content: [
          "🔒 SSL shifrlash: Barcha to'lov ma'lumotlari himoyalangan",
          "🛡️ PCI DSS sertifikat: Xalqaro xavfsizlik standarti",
          "🔐 3D Secure: Qo'shimcha himoya qatlami",
          "📱 SMS tasdiqlash: Har bir to'lov uchun",
          "🚫 Karta ma'lumotlari saqlanmaydi: Bizning serverlarimizda",
          "🔍 Firibgarlik nazorati: Real vaqtda monitoring",
          "⚡ Tezkor javob: Shubhali operatsiyalar uchun",
          "Sizning pullaringiz 100% himoyalangan!"
        ]
      },
      {
        icon: Smartphone,
        title: "3. Mobil To'lovlar",
        content: [
          "📲 Click: 9999 raqamiga qo'ng'iroq qiling",
          "💸 Payme: QR kod yoki telefon raqami orqali",
          "🏪 TBC Pay: Mobil ilovada to'g'ridan-to'g'ri",
          "💳 Apple Pay / Google Pay: Tez va xavfsiz",
          "📱 USSD kod: *880# orqali",
          "🔄 Avtomatik to'lov: Muntazam buyurtmalar uchun",
          "📊 To'lov tarixi: Ilovada ko'ring",
          "Mobil to'lovlar eng tez va qulay usul!"
        ]
      },
      {
        icon: DollarSign,
        title: "4. Narxlar va Komissiyalar",
        content: [
          "🆓 Bank kartalari: Komissiyasiz",
          "💰 Naqd to'lov: Komissiyasiz",
          "📱 Click/Payme: 1% komissiya (minimal 1000 so'm)",
          "🏦 Bank o'tkazmasi: Bank komissiyasi",
          "💵 Valyuta kursi: O'zbekiston Markaziy banki kursi",
          "🎁 Chegirmalar: Muntazam mijozlar uchun",
          "💎 Bonus ballar: Har bir to'lov uchun",
          "Eng kam komissiya - eng yuqori qulaylik!"
        ]
      },
      {
        icon: CheckCircle,
        title: "5. To'lov Jarayoni",
        content: [
          "1️⃣ Savatni to'ldiring: Kerakli mahsulotlarni tanlang",
          "2️⃣ Checkout: Yetkazib berish va to'lov usulini belgilang",
          "3️⃣ Ma'lumotlarni kiriting: To'lov va yetkazib berish ma'lumotlari",
          "4️⃣ Tasdiqlash: SMS kod orqali tasdiqlang",
          "5️⃣ To'lov: Tanlangan usul orqali to'lang",
          "6️⃣ Tasdiqlash: To'lov muvaffaqiyatli haqida xabar",
          "📧 Chek: Elektron chek emailga yuboriladi",
          "📱 Kuzatuv: Buyurtma holatini real vaqtda kuzating"
        ]
      },
      {
        icon: AlertTriangle,
        title: "6. Muhim Ma'lumotlar",
        content: [
          "⏰ To'lov muddati: Buyurtmadan keyin 30 daqiqa",
          "🔄 Qaytarish: 3-5 ish kuni ichida",
          "📞 Yordam: 24/7 mijozlarni qo'llab-quvvatlash",
          "🧾 Hujjatlar: Har bir to'lov uchun rasmiy chek",
          "💼 Yuridik shaxslar: Shartnoma va hisob-faktura",
          "🔒 Maxfiylik: To'lov ma'lumotlari maxfiy saqlanadi",
          "⚖️ Nizolar: Fuqarolik kodeksi asosida hal qilinadi",
          "Savollaringiz bo'lsa, biz bilan bog'laning!"
        ]
      }
    ],
    security: {
      title: "Xavfsizlik Kafolatlari",
      features: [
        "🔐 256-bit SSL shifrlash",
        "🛡️ PCI DSS Level 1 sertifikat",
        "🔍 Real vaqtda firibgarlik nazorati",
        "📱 SMS va email tasdiqlash",
        "🚫 Karta ma'lumotlari saqlanmaydi",
        "⚡ 24/7 xavfsizlik monitoring"
      ]
    },
    contact: {
      title: "To'lov Bo'yicha Yordam",
      description: "To'lov bilan bog'liq savollaringiz bo'lsa:",
      phone: "+998 90 844 08 44",
      email: "payment@organicgreen.uz",
      telegram: "@organicgreen_payment",
      workingHours: "Yordam xizmati: 24/7"
    }
  },
  ru: {
    title: "Способы Оплаты и Безопасность",
    lastUpdated: "Последнее обновление: 2025-10-07",
    intro: "Organic Green Uzbekistan предлагает безопасные и удобные способы оплаты органических продуктов. Наши платежные системы соответствуют высоким стандартам безопасности.",
    sections: [
      {
        icon: CreditCard,
        title: "1. Доступные Способы Оплаты",
        content: [
          "💳 Банковские карты: Visa, MasterCard, UzCard, Humo",
          "💰 Наличные: при доставке",
          "📱 Мобильные платежи: Click, Payme, TBC Pay",
          "🏦 Банковский перевод: для юридических лиц",
          "💵 Валюта: только узбекские сумы",
          "📊 Планы оплаты: рассрочка для крупных заказов",
          "Все способы оплаты безопасны и работают быстро!"
        ]
      },
      {
        icon: Shield,
        title: "2. Меры Безопасности",
        content: [
          "🔒 SSL шифрование: вся платежная информация защищена",
          "🛡️ Сертификат PCI DSS: международный стандарт безопасности",
          "🔐 3D Secure: дополнительный уровень защиты",
          "📱 SMS подтверждение: для каждого платежа",
          "🚫 Данные карт не сохраняются: на наших серверах",
          "🔍 Контроль мошенничества: мониторинг в реальном времени",
          "⚡ Быстрое реагирование: на подозрительные операции",
          "Ваши деньги защищены на 100%!"
        ]
      },
      {
        icon: Smartphone,
        title: "3. Мобильные Платежи",
        content: [
          "📲 Click: звоните на номер 9999",
          "💸 Payme: через QR код или номер телефона",
          "🏪 TBC Pay: прямо в мобильном приложении",
          "💳 Apple Pay / Google Pay: быстро и безопасно",
          "📱 USSD код: через *880#",
          "🔄 Автоплатеж: для регулярных заказов",
          "📊 История платежей: смотрите в приложении",
          "Мобильные платежи - самый быстрый и удобный способ!"
        ]
      },
      {
        icon: DollarSign,
        title: "4. Цены и Комиссии",
        content: [
          "🆓 Банковские карты: без комиссии",
          "💰 Наличная оплата: без комиссии",
          "📱 Click/Payme: комиссия 1% (минимум 1000 сум)",
          "🏦 Банковский перевод: комиссия банка",
          "💵 Валютный курс: курс Центрального банка Узбекистана",
          "🎁 Скидки: для постоянных клиентов",
          "💎 Бонусные баллы: за каждую оплату",
          "Минимальная комиссия - максимальное удобство!"
        ]
      },
      {
        icon: CheckCircle,
        title: "5. Процесс Оплаты",
        content: [
          "1️⃣ Заполните корзину: выберите нужные продукты",
          "2️⃣ Checkout: укажите доставку и способ оплаты",
          "3️⃣ Введите данные: платежная и доставочная информация",
          "4️⃣ Подтверждение: подтвердите через SMS код",
          "5️⃣ Оплата: оплатите выбранным способом",
          "6️⃣ Подтверждение: уведомление об успешной оплате",
          "📧 Чек: электронный чек отправляется на email",
          "📱 Отслеживание: следите за статусом заказа в реальном времени"
        ]
      },
      {
        icon: AlertTriangle,
        title: "6. Важная Информация",
        content: [
          "⏰ Срок оплаты: 30 минут после оформления заказа",
          "🔄 Возврат: в течение 3-5 рабочих дней",
          "📞 Поддержка: 24/7 служба поддержки клиентов",
          "🧾 Документы: официальный чек за каждую оплату",
          "💼 Юридические лица: договор и счет-фактура",
          "🔒 Конфиденциальность: платежная информация хранится конфиденциально",
          "⚖️ Споры: решаются на основе гражданского кодекса",
          "При возникновении вопросов свяжитесь с нами!"
        ]
      }
    ],
    security: {
      title: "Гарантии Безопасности",
      features: [
        "🔐 256-битное SSL шифрование",
        "🛡️ Сертификат PCI DSS Level 1",
        "🔍 Контроль мошенничества в реальном времени",
        "📱 SMS и email подтверждение",
        "🚫 Данные карт не сохраняются",
        "⚡ 24/7 мониторинг безопасности"
      ]
    },
    contact: {
      title: "Помощь по Оплате",
      description: "Если у вас есть вопросы по оплате:",
      phone: "+998 90 844 08 44",
      email: "payment@organicgreen.uz",
      telegram: "@organicgreen_payment",
      workingHours: "Служба поддержки: 24/7"
    }
  },
  en: {
    title: "Payment Methods & Security",
    lastUpdated: "Last updated: October 7, 2025",
    intro: "Organic Green Uzbekistan offers secure and convenient payment methods for organic products. Our payment systems meet high security standards.",
    sections: [
      {
        icon: CreditCard,
        title: "1. Available Payment Methods",
        content: [
          "💳 Bank cards: Visa, MasterCard, UzCard, Humo",
          "💰 Cash: upon delivery",
          "📱 Mobile payments: Click, Payme, TBC Pay",
          "🏦 Bank transfer: for legal entities",
          "💵 Currency: Uzbek sum only",
          "📊 Payment plans: installments for large orders",
          "All payment methods are secure and work quickly!"
        ]
      },
      {
        icon: Shield,
        title: "2. Security Measures",
        content: [
          "🔒 SSL encryption: all payment information is protected",
          "🛡️ PCI DSS certificate: international security standard",
          "🔐 3D Secure: additional protection layer",
          "📱 SMS confirmation: for each payment",
          "🚫 Card data not stored: on our servers",
          "🔍 Fraud control: real-time monitoring",
          "⚡ Quick response: to suspicious operations",
          "Your money is 100% protected!"
        ]
      },
      {
        icon: Smartphone,
        title: "3. Mobile Payments",
        content: [
          "📲 Click: call 9999",
          "💸 Payme: via QR code or phone number",
          "🏪 TBC Pay: directly in mobile app",
          "💳 Apple Pay / Google Pay: fast and secure",
          "📱 USSD code: via *880#",
          "🔄 Auto payment: for regular orders",
          "📊 Payment history: view in app",
          "Mobile payments are the fastest and most convenient way!"
        ]
      },
      {
        icon: DollarSign,
        title: "4. Prices and Commissions",
        content: [
          "🆓 Bank cards: no commission",
          "💰 Cash payment: no commission",
          "📱 Click/Payme: 1% commission (minimum 1000 sum)",
          "🏦 Bank transfer: bank commission",
          "💵 Exchange rate: Central Bank of Uzbekistan rate",
          "🎁 Discounts: for regular customers",
          "💎 Bonus points: for each payment",
          "Minimum commission - maximum convenience!"
        ]
      },
      {
        icon: CheckCircle,
        title: "5. Payment Process",
        content: [
          "1️⃣ Fill cart: select needed products",
          "2️⃣ Checkout: specify delivery and payment method",
          "3️⃣ Enter data: payment and delivery information",
          "4️⃣ Confirmation: confirm via SMS code",
          "5️⃣ Payment: pay with selected method",
          "6️⃣ Confirmation: successful payment notification",
          "📧 Receipt: electronic receipt sent to email",
          "📱 Tracking: monitor order status in real time"
        ]
      },
      {
        icon: AlertTriangle,
        title: "6. Important Information",
        content: [
          "⏰ Payment deadline: 30 minutes after order",
          "🔄 Refund: within 3-5 business days",
          "📞 Support: 24/7 customer support",
          "🧾 Documents: official receipt for each payment",
          "💼 Legal entities: contract and invoice",
          "🔒 Privacy: payment information stored confidentially",
          "⚖️ Disputes: resolved based on civil code",
          "Contact us if you have any questions!"
        ]
      }
    ],
    security: {
      title: "Security Guarantees",
      features: [
        "🔐 256-bit SSL encryption",
        "🛡️ PCI DSS Level 1 certificate",
        "🔍 Real-time fraud control",
        "📱 SMS and email confirmation",
        "🚫 Card data not stored",
        "⚡ 24/7 security monitoring"
      ]
    },
    contact: {
      title: "Payment Support",
      description: "If you have payment questions:",
      phone: "+998 90 844 08 44",
      email: "payment@organicgreen.uz",
      telegram: "@organicgreen_payment",
      workingHours: "Support service: 24/7"
    }
  }
};

export default function PaymentPolicyContent() {
  const { language } = useLanguage();
  const content = paymentContent[language as keyof typeof paymentContent] || paymentContent.uz;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
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
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
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

        {/* Security Guarantees */}
        <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
            <div className="flex items-center text-white">
              <Lock className="w-8 h-8 mr-4" />
              <h2 className="text-2xl font-semibold">{content.security.title}</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {content.security.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg text-white p-8 text-center">
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