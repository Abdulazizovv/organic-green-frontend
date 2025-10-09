"use client";

import { useLanguage } from "@/lib/language";
import { Calendar, Truck, Clock, MapPin, Package, Star, Shield, AlertCircle } from "lucide-react";

const shippingContent = {
  uz: {
    title: "Yetkazib Berish Siyosati",
    lastUpdated: "Oxirgi yangilanish: 2025-10-07",
    intro: "Organic Green Uzbekistan organik mahsulotlarini butun O'zbekiston bo'ylab tez va xavfsiz yetkazib beradi. Quyida yetkazib berish shartlari va narxlari haqida to'liq ma'lumot keltirilgan.",
    sections: [
      {
        icon: MapPin,
        title: "1. Yetkazib Berish Hududlari",
        content: [
          "🏙️ Toshkent shahri: Barcha tumanlar va MFYlar",
          "🏘️ Toshkent viloyati: Barcha tumanlar",
          "🌆 Boshqa viloyatlar: Barcha viloyat markazlari",
          "🚚 Tuman markazlari: Asosiy tuman markazlariga yetkazamiz",
          "📍 Qishloq joylari: Maxsus kelishuv asosida",
          "Agar sizning hududingiz ro'yxatda yo'q bo'lsa, biz bilan bog'laning - hal qilish yo'lini topamiz!"
        ]
      },
      {
        icon: Clock,
        title: "2. Yetkazib Berish Muddatlari",
        content: [
          "⚡ Toshkent shahri ichida: 1-3 soat (tezkor yetkazib berish)",
          "🏙️ Toshkent viloyati: 4-8 soat",
          "🚛 Samarqand, Buxoro, Andijon: 1-2 kun",
          "🚚 Boshqa viloyatlar: 2-3 kun",
          "❄️ Sovutilgan mahsulotlar: Maxsus tezkor yetkazib berish",
          "⏰ Ish vaqti: 8:00 dan 20:00 gacha (dushanba-yakshanba)",
          "Bayram kunlarida yetkazib berish bir kun kechikishi mumkin."
        ]
      },
      {
        icon: Package,
        title: "3. Yetkazib Berish Narxlari",
        content: [
          "🆓 200,000 so'mdan yuqori buyurtmalar: BEPUL yetkazib berish",
          "🏙️ Toshkent shahri: 15,000 so'm",
          "🏘️ Toshkent viloyati: 25,000 so'm",
          "🌆 Viloyat markazlari: 35,000-50,000 so'm",
          "🚚 Uzoq masofalar: 50,000-80,000 so'm",
          "⚡ Tezkor yetkazib berish: +20,000 so'm qo'shimcha",
          "💡 Maslahat: Katta buyurtma bering va yetkazib berishni bepul qiling!"
        ]
      },
      {
        icon: Shield,
        title: "4. Qadoqlash va Xavfsizlik",
        content: [
          "📦 Ekologik qadoqlash: 100% qayta ishlanadigan materiallar",
          "❄️ Sovutish tizimi: Mikrozelenlər uchun maxsus sovutgichlar",
          "🛡️ Himoya: Barcha mahsulotlar himoyalangan qadoqda",
          "🏷️ Belgilash: Har bir mahsulotda yaroqlilik muddati ko'rsatilgan",
          "🧊 Muzlatilgan mahsulotlar: Maxsus termoqadoqlarda",
          "📋 Sertifikat: Har bir yuborma bilan organik sertifikat",
          "Biz mahsulotlaringiz sifatini saqlab qolish uchun eng yaxshi qadoqlash usullaridan foydalanamiz."
        ]
      },
      {
        icon: Truck,
        title: "5. Yetkazib Berish Jarayoni",
        content: [
          "1️⃣ Buyurtma tasdiqlash: 30 daqiqa ichida",
          "2️⃣ Tayyorlash: Mahsulotlarni qadoqlash 1-2 soat",
          "3️⃣ Jo'natish: Kuryer bilan bog'lanish",
          "4️⃣ Yetkazib berish: Ko'rsatilgan vaqtda",
          "5️⃣ Qabul qilish: Mahsulotni tekshirish va qabul qilish",
          "📱 SMS xabarnomalar: Har bir bosqichda xabar beramiz",
          "📞 Qo'ng'iroq: Yetkazib berishdan 30 daqiqa oldin",
          "📍 GPS kuzatuv: Kuryeringizni xaritada kuzating"
        ]
      },
      {
        icon: AlertCircle,
        title: "6. Maxsus Shartlar",
        content: [
          "🌡️ Harorat nazorati: Mikrozelenlər 2-4°C da saqlanadi",
          "⏰ Vaqtga bog'liq: Aniq vaqt belgilash mumkin",
          "🏢 Ofisga yetkazib berish: Ish vaqtida amalga oshiriladi",
          "🏠 Uyga yetkazib berish: Ertalab 8:00 dan kech 20:00 gacha",
          "📦 Katta buyurtmalar: 50 kg dan yuqori maxsus yetkazib berish",
          "💳 To'lov: Yetkazib berish vaqtida naqd yoki karta orqali",
          "🔄 Qayta yetkazib berish: Qabul qilmasangiz, qayta kelish 10,000 so'm",
          "Har qanday maxsus talablaringiz bo'lsa, buyurtma berish vaqtida xabar bering."
        ]
      }
    ],
    contact: {
      title: "Yetkazib Berish Bo'yicha Savollar",
      description: "Yetkazib berish haqida savollaringiz bo'lsa:",
      phone: "+998 90 844 08 44",
      email: "delivery@organicgreen.uz",
      telegram: "@organicgreen_delivery",
      workingHours: "Ish vaqti: 8:00 - 20:00 (har kuni)"
    }
  },
  ru: {
    title: "Политика Доставки",
    lastUpdated: "Последнее обновление: 2025-10-07",
    intro: "Organic Green Uzbekistan доставляет органические продукты по всему Узбекистану быстро и безопасно. Ниже приведена полная информация об условиях и стоимости доставки.",
    sections: [
      {
        icon: MapPin,
        title: "1. География Доставки",
        content: [
          "🏙️ Город Ташкент: Все районы и МФЙ",
          "🏘️ Ташкентская область: Все районы",
          "🌆 Другие области: Все областные центры",
          "🚚 Районные центры: Основные районные центры",
          "📍 Сельская местность: По специальному договору",
          "Если вашего региона нет в списке, свяжитесь с нами - найдем решение!"
        ]
      },
      {
        icon: Clock,
        title: "2. Сроки Доставки",
        content: [
          "⚡ По Ташкенту: 1-3 часа (экспресс-доставка)",
          "🏙️ Ташкентская область: 4-8 часов",
          "🚛 Самарканд, Бухара, Андижан: 1-2 дня",
          "🚚 Другие области: 2-3 дня",
          "❄️ Охлажденные товары: Специальная быстрая доставка",
          "⏰ Рабочее время: с 8:00 до 20:00 (понедельник-воскресенье)",
          "В праздничные дни доставка может задержаться на один день."
        ]
      },
      {
        icon: Package,
        title: "3. Стоимость Доставки",
        content: [
          "🆓 Заказы свыше 200,000 сум: БЕСПЛАТНАЯ доставка",
          "🏙️ Город Ташкент: 15,000 сум",
          "🏘️ Ташкентская область: 25,000 сум",
          "🌆 Областные центры: 35,000-50,000 сум",
          "🚚 Дальние расстояния: 50,000-80,000 сум",
          "⚡ Экспресс-доставка: +20,000 сум дополнительно",
          "💡 Совет: Делайте большие заказы и получайте бесплатную доставку!"
        ]
      },
      {
        icon: Shield,
        title: "4. Упаковка и Безопасность",
        content: [
          "📦 Экологичная упаковка: 100% перерабатываемые материалы",
          "❄️ Система охлаждения: Специальные холодильники для микрозелени",
          "🛡️ Защита: Все продукты в защищенной упаковке",
          "🏷️ Маркировка: На каждом продукте указан срок годности",
          "🧊 Замороженные товары: В специальной термоупаковке",
          "📋 Сертификат: Органический сертификат с каждой посылкой",
          "Мы используем лучшие методы упаковки для сохранения качества продуктов."
        ]
      },
      {
        icon: Truck,
        title: "5. Процесс Доставки",
        content: [
          "1️⃣ Подтверждение заказа: в течение 30 минут",
          "2️⃣ Подготовка: упаковка товаров 1-2 часа",
          "3️⃣ Отправка: связь с курьером",
          "4️⃣ Доставка: в указанное время",
          "5️⃣ Получение: проверка и получение товара",
          "📱 SMS уведомления: на каждом этапе",
          "📞 Звонок: за 30 минут до доставки",
          "📍 GPS отслеживание: следите за курьером на карте"
        ]
      },
      {
        icon: AlertCircle,
        title: "6. Особые Условия",
        content: [
          "🌡️ Контроль температуры: микрозелень хранится при 2-4°C",
          "⏰ Привязка ко времени: можно указать точное время",
          "🏢 Доставка в офис: в рабочее время",
          "🏠 Доставка домой: с 8:00 утра до 20:00 вечера",
          "📦 Крупные заказы: свыше 50 кг специальная доставка",
          "💳 Оплата: при доставке наличными или картой",
          "🔄 Повторная доставка: если не примете, повторный визит 10,000 сум",
          "При наличии особых требований сообщите при оформлении заказа."
        ]
      }
    ],
    contact: {
      title: "Вопросы по Доставке",
      description: "Если у вас есть вопросы о доставке:",
      phone: "+998 90 844 08 44",
      email: "delivery@organicgreen.uz",
      telegram: "@organicgreen_delivery",
      workingHours: "Рабочее время: 8:00 - 20:00 (ежедневно)"
    }
  },
  en: {
    title: "Shipping & Delivery Policy",
    lastUpdated: "Last updated: October 7, 2025",
    intro: "Organic Green Uzbekistan delivers organic products throughout Uzbekistan quickly and safely. Below is complete information about delivery terms and pricing.",
    sections: [
      {
        icon: MapPin,
        title: "1. Delivery Areas",
        content: [
          "🏙️ Tashkent City: All districts and neighborhoods",
          "🏘️ Tashkent Region: All districts",
          "🌆 Other Regions: All regional centers",
          "🚚 District Centers: Main district centers",
          "📍 Rural Areas: By special agreement",
          "If your area is not listed, contact us - we'll find a solution!"
        ]
      },
      {
        icon: Clock,
        title: "2. Delivery Times",
        content: [
          "⚡ Within Tashkent: 1-3 hours (express delivery)",
          "🏙️ Tashkent Region: 4-8 hours",
          "🚛 Samarkand, Bukhara, Andijan: 1-2 days",
          "🚚 Other Regions: 2-3 days",
          "❄️ Refrigerated Products: Special fast delivery",
          "⏰ Working Hours: 8:00 AM to 8:00 PM (Monday-Sunday)",
          "Holiday deliveries may be delayed by one day."
        ]
      },
      {
        icon: Package,
        title: "3. Delivery Rates",
        content: [
          "🆓 Orders over 200,000 sum: FREE delivery",
          "🏙️ Tashkent City: 15,000 sum",
          "🏘️ Tashkent Region: 25,000 sum",
          "🌆 Regional Centers: 35,000-50,000 sum",
          "🚚 Long Distances: 50,000-80,000 sum",
          "⚡ Express Delivery: +20,000 sum additional",
          "💡 Tip: Place large orders and get free delivery!"
        ]
      },
      {
        icon: Shield,
        title: "4. Packaging and Safety",
        content: [
          "📦 Eco-friendly packaging: 100% recyclable materials",
          "❄️ Cooling system: Special refrigerators for microgreens",
          "🛡️ Protection: All products in protective packaging",
          "🏷️ Labeling: Expiry date indicated on each product",
          "🧊 Frozen products: In special thermal packaging",
          "📋 Certificate: Organic certificate with each shipment",
          "We use the best packaging methods to preserve product quality."
        ]
      },
      {
        icon: Truck,
        title: "5. Delivery Process",
        content: [
          "1️⃣ Order confirmation: within 30 minutes",
          "2️⃣ Preparation: product packaging 1-2 hours",
          "3️⃣ Dispatch: courier contact",
          "4️⃣ Delivery: at specified time",
          "5️⃣ Receipt: product inspection and acceptance",
          "📱 SMS notifications: at each stage",
          "📞 Call: 30 minutes before delivery",
          "📍 GPS tracking: track your courier on map"
        ]
      },
      {
        icon: AlertCircle,
        title: "6. Special Conditions",
        content: [
          "🌡️ Temperature control: microgreens stored at 2-4°C",
          "⏰ Time-specific: exact time can be specified",
          "🏢 Office delivery: during business hours",
          "🏠 Home delivery: from 8:00 AM to 8:00 PM",
          "📦 Large orders: over 50kg special delivery",
          "💳 Payment: cash or card upon delivery",
          "🔄 Re-delivery: if not accepted, return visit 10,000 sum",
          "Please inform us of any special requirements when placing order."
        ]
      }
    ],
    contact: {
      title: "Delivery Questions",
      description: "If you have questions about delivery:",
      phone: "+998 90 844 08 44",
      email: "delivery@organicgreen.uz",
      telegram: "@organicgreen_delivery",
      workingHours: "Working hours: 8:00 - 20:00 (daily)"
    }
  }
};

export default function ShippingPolicyContent() {
  const { language } = useLanguage();
  const content = shippingContent[language as keyof typeof shippingContent] || shippingContent.uz;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-16">
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
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
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
        <div className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg text-white p-8 text-center">
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