"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language";
import { ChevronDown, ChevronUp, HelpCircle, Search, Package, Truck, CreditCard, Leaf, Users, Shield } from "lucide-react";

const faqContent = {
  uz: {
    title: "Ko'p So'raladigan Savollar",
    subtitle: "Organik Green haqida eng ko'p so'raladigan savollarga javoblar",
    searchPlaceholder: "Savollarni qidiring...",
    categories: [
      {
        id: "general",
        title: "Umumiy Savollar",
        icon: HelpCircle,
        questions: [
          {
            question: "Organic Green nima?",
            answer: "Organic Green - O'zbekistonda mikrozelenlər və organik mahsulotlar ishlab chiqaruvchi va sotuvchi kompaniyadir. Biz 100% tabiiy va kimyoviy o'g'itlarsiz yetishtirilgan mahsulotlarni taklif etamiz."
          },
          {
            question: "Mahsulotlaringiz haqiqatan ham organikmi?",
            answer: "Ha, barcha mahsulotlarimiz organik sertifikatga ega va international standartlarga javob beradi. Biz pestitsidlar va kimyoviy o'g'itlardan foydalanmaymiz."
          },
          {
            question: "Mikrozelenlər nima?",
            answer: "Mikrozelenlər - o'simliklarning erta bosqichdagi kichik bargchalari bo'lib, ular oddiy sabzavotlarga nisbatan 40 barobar ko'p vitamin va minerallar saqlaydi."
          }
        ]
      },
      {
        id: "products",
        title: "Mahsulotlar",
        icon: Leaf,
        questions: [
          {
            question: "Qanday mahsulotlar mavjud?",
            answer: "Bizda mikrozelenlər, organik sabzavotlar, mevalar, don mahsulotlari, tabiiy oshqozon to'ldiruvchilar va organik choy turlari mavjud."
          },
          {
            question: "Mahsulotlar qancha muddat yangi qoladi?",
            answer: "Mikrozelenlər 7-10 kun, boshqa organik sabzavotlar esa 5-14 kun davomida yangi qoladi. To'g'ri saqlash shartlarida bu muddat uzayishi mumkin."
          },
          {
            question: "Mahsulotlarni qanday saqlash kerak?",
            answer: "Sovutgichda 2-4°C haroratda va original qadoqda saqlang. Namlikdan saqlaning va ishlatishdan oldin yuvib oling."
          }
        ]
      },
      {
        id: "orders",
        title: "Buyurtma va Yetkazib berish",
        icon: Package,
        questions: [
          {
            question: "Buyurtma qanday berish mumkin?",
            answer: "Saytimiz orqali onlayn, telefon orqali yoki ijtimoiy tarmoqlarda buyurtma berishingiz mumkin. Eng oson yo'li - saytdagi savat funksiyasidan foydalanish."
          },
          {
            question: "Yetkazib berish qancha vaqt oladi?",
            answer: "Toshkent shahri ichida 1-2 soat, viloyatlarga 1-3 kun ichida yetkazib beramiz. Tezkor yetkazib berish xizmati ham mavjud."
          },
          {
            question: "Yetkazib berish narxi qancha?",
            answer: "Toshkent shahri ichida 15,000 so'm, viloyatlarga 25,000-50,000 so'm. 200,000 so'mdan yuqori buyurtmalarda yetkazib berish bepul."
          }
        ]
      },
      {
        id: "payment",
        title: "To'lov",
        icon: CreditCard,
        questions: [
          {
            question: "Qanday to'lov usullari mavjud?",
            answer: "Naqd pul, bank kartalari, online to'lov (Payme, Click, Uzcard), bank o'tkazmasi orqali to'lashingiz mumkin."
          },
          {
            question: "Online to'lov xavfsizmi?",
            answer: "Ha, biz xalqaro standartlarga javob beruvchi xavfsiz to'lov tizimlaridan foydalanamiz. Barcha ma'lumotlar shifrlangan holda uzatiladi."
          },
          {
            question: "To'lovni qaytarish mumkinmi?",
            answer: "Ha, mahsulot sifatsiz bo'lsa yoki boshqa muammolar bo'lsa, 7 kun ichida to'lovni qaytaramiz."
          }
        ]
      },
      {
        id: "franchise",
        title: "Franshiza",
        icon: Users,
        questions: [
          {
            question: "Franshiza qanday olish mumkin?",
            answer: "Saytimizda franshiza bo'limiga kirib, ariza to'ldiring. Bizning mutaxassislarimiz siz bilan bog'lanishadi va barcha tafsilotlarni tushuntirishadi."
          },
          {
            question: "Franshiza uchun qancha investitsiya kerak?",
            answer: "Minimal investitsiya $25,000 dan boshlanadi. Bu summa joylashuv va franshiza turiga qarab o'zgarishi mumkin."
          },
          {
            question: "Qo'llab-quvvatlash beriladi?",
            answer: "Ha, biz to'liq training, marketing materiallari, texnik yordam va doimiy qo'llab-quvvatlash taqdim etamiz."
          }
        ]
      },
      {
        id: "safety",
        title: "Xavfsizlik va Sifat",
        icon: Shield,
        questions: [
          {
            question: "Mahsulotlar xavfsizligi qanday ta'minlanadi?",
            answer: "Barcha mahsulotlarimiz sifat nazoratidan o'tadi, laboratoriya tekshiruvlaridan o'tkaziladi va international standartlarga javob beradi."
          },
          {
            question: "Sertifikatlaringiz bormi?",
            answer: "Ha, bizda organik ishlab chiqarish, ISO 22000, HACCP va boshqa sifat sertifikatlari mavjud."
          },
          {
            question: "Shikoyat qanday qilish mumkin?",
            answer: "Telefon, email yoki saytdagi aloqa formasi orqali murojaat qilishingiz mumkin. Barcha shikoyatlarni 24 soat ichida ko'rib chiqamiz."
          }
        ]
      }
    ]
  },
  ru: {
    title: "Часто Задаваемые Вопросы",
    subtitle: "Ответы на самые популярные вопросы об Organic Green",
    searchPlaceholder: "Поиск вопросов...",
    categories: [
      {
        id: "general",
        title: "Общие Вопросы",
        icon: HelpCircle,
        questions: [
          {
            question: "Что такое Organic Green?",
            answer: "Organic Green - компания в Узбекистане, производящая и продающая микрозелень и органические продукты. Мы предлагаем 100% натуральные продукты, выращенные без химических удобрений."
          },
          {
            question: "Действительно ли ваши продукты органические?",
            answer: "Да, все наши продукты имеют органические сертификаты и соответствуют международным стандартам. Мы не используем пестициды и химические удобрения."
          },
          {
            question: "Что такое микрозелень?",
            answer: "Микрозелень - это молодые листочки растений на ранней стадии развития, которые содержат в 40 раз больше витаминов и минералов по сравнению с обычными овощами."
          }
        ]
      },
      {
        id: "products",
        title: "Продукты",
        icon: Leaf,
        questions: [
          {
            question: "Какие продукты доступны?",
            answer: "У нас есть микрозелень, органические овощи, фрукты, зерновые продукты, натуральные добавки и органические чаи."
          },
          {
            question: "Как долго продукты остаются свежими?",
            answer: "Микрозелень остается свежей 7-10 дней, другие органические овощи 5-14 дней. При правильном хранении этот срок может увеличиться."
          },
          {
            question: "Как правильно хранить продукты?",
            answer: "Храните в холодильнике при температуре 2-4°C в оригинальной упаковке. Защищайте от влаги и мойте перед употреблением."
          }
        ]
      },
      {
        id: "orders",
        title: "Заказы и Доставка",
        icon: Package,
        questions: [
          {
            question: "Как можно сделать заказ?",
            answer: "Вы можете заказать онлайн через наш сайт, по телефону или в социальных сетях. Самый простой способ - использовать корзину на сайте."
          },
          {
            question: "Сколько времени занимает доставка?",
            answer: "По Ташкенту доставляем за 1-2 часа, в области за 1-3 дня. Также доступна экспресс-доставка."
          },
          {
            question: "Сколько стоит доставка?",
            answer: "По Ташкенту 15,000 сум, в области 25,000-50,000 сум. При заказе от 200,000 сум доставка бесплатная."
          }
        ]
      },
      {
        id: "payment",
        title: "Оплата",
        icon: CreditCard,
        questions: [
          {
            question: "Какие способы оплаты доступны?",
            answer: "Наличными, банковскими картами, онлайн-платежи (Payme, Click, Uzcard), банковским переводом."
          },
          {
            question: "Безопасна ли онлайн-оплата?",
            answer: "Да, мы используем безопасные платежные системы, соответствующие международным стандартам. Вся информация передается в зашифрованном виде."
          },
          {
            question: "Можно ли вернуть платеж?",
            answer: "Да, если продукт некачественный или есть другие проблемы, мы возвращаем платеж в течение 7 дней."
          }
        ]
      },
      {
        id: "franchise",
        title: "Франшиза",
        icon: Users,
        questions: [
          {
            question: "Как получить франшизу?",
            answer: "Зайдите в раздел франшизы на нашем сайте и заполните заявку. Наши специалисты свяжутся с вами и объяснят все детали."
          },
          {
            question: "Сколько инвестиций нужно для франшизы?",
            answer: "Минимальная инвестиция начинается от $25,000. Эта сумма может варьироваться в зависимости от местоположения и типа франшизы."
          },
          {
            question: "Предоставляется ли поддержка?",
            answer: "Да, мы предоставляем полное обучение, маркетинговые материалы, техническую поддержку и постоянную помощь."
          }
        ]
      },
      {
        id: "safety",
        title: "Безопасность и Качество",
        icon: Shield,
        questions: [
          {
            question: "Как обеспечивается безопасность продуктов?",
            answer: "Все наши продукты проходят контроль качества, лабораторные исследования и соответствуют международным стандартам."
          },
          {
            question: "Есть ли у вас сертификаты?",
            answer: "Да, у нас есть сертификаты органического производства, ISO 22000, HACCP и другие сертификаты качества."
          },
          {
            question: "Как подать жалобу?",
            answer: "Вы можете обратиться по телефону, email или через контактную форму на сайте. Все жалобы рассматриваем в течение 24 часов."
          }
        ]
      }
    ]
  },
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Answers to the most common questions about Organic Green",
    searchPlaceholder: "Search questions...",
    categories: [
      {
        id: "general",
        title: "General Questions",
        icon: HelpCircle,
        questions: [
          {
            question: "What is Organic Green?",
            answer: "Organic Green is a company in Uzbekistan that produces and sells microgreens and organic products. We offer 100% natural products grown without chemical fertilizers."
          },
          {
            question: "Are your products really organic?",
            answer: "Yes, all our products have organic certificates and meet international standards. We do not use pesticides and chemical fertilizers."
          },
          {
            question: "What are microgreens?",
            answer: "Microgreens are young plant leaves in early development stages that contain 40 times more vitamins and minerals compared to regular vegetables."
          }
        ]
      },
      {
        id: "products",
        title: "Products",
        icon: Leaf,
        questions: [
          {
            question: "What products are available?",
            answer: "We have microgreens, organic vegetables, fruits, grain products, natural supplements, and organic teas."
          },
          {
            question: "How long do products stay fresh?",
            answer: "Microgreens stay fresh for 7-10 days, other organic vegetables for 5-14 days. With proper storage, this period can be extended."
          },
          {
            question: "How to properly store products?",
            answer: "Store in refrigerator at 2-4°C in original packaging. Protect from moisture and wash before use."
          }
        ]
      },
      {
        id: "orders",
        title: "Orders and Delivery",
        icon: Package,
        questions: [
          {
            question: "How can I place an order?",
            answer: "You can order online through our website, by phone, or on social media. The easiest way is to use the cart function on the website."
          },
          {
            question: "How long does delivery take?",
            answer: "Within Tashkent 1-2 hours, to regions 1-3 days. Express delivery is also available."
          },
          {
            question: "How much does delivery cost?",
            answer: "In Tashkent 15,000 sum, to regions 25,000-50,000 sum. Free delivery for orders over 200,000 sum."
          }
        ]
      },
      {
        id: "payment",
        title: "Payment",
        icon: CreditCard,
        questions: [
          {
            question: "What payment methods are available?",
            answer: "Cash, bank cards, online payments (Payme, Click, Uzcard), bank transfer."
          },
          {
            question: "Is online payment safe?",
            answer: "Yes, we use secure payment systems that meet international standards. All information is transmitted encrypted."
          },
          {
            question: "Can I get a refund?",
            answer: "Yes, if the product is of poor quality or there are other problems, we refund within 7 days."
          }
        ]
      },
      {
        id: "franchise",
        title: "Franchise",
        icon: Users,
        questions: [
          {
            question: "How to get a franchise?",
            answer: "Go to the franchise section on our website and fill out an application. Our specialists will contact you and explain all the details."
          },
          {
            question: "How much investment is needed for a franchise?",
            answer: "Minimum investment starts from $25,000. This amount may vary depending on location and franchise type."
          },
          {
            question: "Is support provided?",
            answer: "Yes, we provide complete training, marketing materials, technical support, and ongoing assistance."
          }
        ]
      },
      {
        id: "safety",
        title: "Safety and Quality",
        icon: Shield,
        questions: [
          {
            question: "How is product safety ensured?",
            answer: "All our products undergo quality control, laboratory testing, and meet international standards."
          },
          {
            question: "Do you have certificates?",
            answer: "Yes, we have organic production certificates, ISO 22000, HACCP, and other quality certificates."
          },
          {
            question: "How to file a complaint?",
            answer: "You can contact us by phone, email, or through the contact form on the website. We review all complaints within 24 hours."
          }
        ]
      }
    ]
  }
};

export default function FAQContent() {
  const { language } = useLanguage();
  const content = faqContent[language as keyof typeof faqContent] || faqContent.uz;
  
  const [activeCategory, setActiveCategory] = useState("general");
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleQuestion = (questionIndex: number) => {
    setOpenQuestions(prev => 
      prev.includes(questionIndex) 
        ? prev.filter(q => q !== questionIndex)
        : [...prev, questionIndex]
    );
  };

  const filteredCategories = content.categories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{content.subtitle}</p>
          
          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={content.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Kategoriyalar</h3>
              <div className="space-y-2">
                {content.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                      activeCategory === category.id
                        ? "bg-purple-100 text-purple-700 border-l-4 border-purple-500"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <category.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="text-sm font-medium">{category.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="lg:w-3/4">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Savollar topilmadi. Boshqa kalit so'z bilan qidiring.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredCategories
                  .filter(category => !searchTerm || category.id === activeCategory || searchTerm)
                  .map((category) => (
                    <div key={category.id} className={searchTerm || category.id === activeCategory ? "block" : "hidden"}>
                      <div className="flex items-center mb-6">
                        <category.icon className="w-8 h-8 text-purple-600 mr-3" />
                        <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                      </div>
                      
                      <div className="space-y-4">
                        {category.questions.map((qa, questionIndex) => {
                          const globalIndex = content.categories.findIndex(c => c.id === category.id) * 100 + questionIndex;
                          const isOpen = openQuestions.includes(globalIndex);
                          
                          return (
                            <div key={questionIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
                              <button
                                onClick={() => toggleQuestion(globalIndex)}
                                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                                    {qa.question}
                                  </h3>
                                  {isOpen ? (
                                    <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                  )}
                                </div>
                              </button>
                              
                              {isOpen && (
                                <div className="px-6 pb-6">
                                  <div className="border-t pt-4">
                                    <p className="text-gray-700 leading-relaxed">{qa.answer}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Savolingiz topilmadimi?</h2>
          <p className="text-lg mb-6">Biz bilan bog'laning, sizga yordam berishdan mamnunmiz!</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <HelpCircle className="w-6 h-6 mr-2" />
              <span>support@organicgreen.uz</span>
            </div>
            <div className="flex items-center">
              <Package className="w-6 h-6 mr-2" />
              <span>+998 90 844 08 44</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}