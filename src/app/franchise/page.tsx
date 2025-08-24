"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  TrendingUp, 
  Users, 
  DollarSign, 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  Mail, 
  CheckCircle 
} from "lucide-react";

export default function FranchisePage() {
  const stats = [
    {
      icon: Building,
      title: "Франшиза филиаллари",
      value: "50+",
      description: "Бутун Ўзбекистон бўйлаб"
    },
    {
      icon: TrendingUp,
      title: "Йиллик даромад",
      value: "$100K+",
      description: "Ўртача франшиза даромади"
    },
    {
      icon: Users,
      title: "Ҳамкорлар",
      value: "200+",
      description: "Муваффақиятли ҳамкорлар"
    },
    {
      icon: DollarSign,
      title: "ROI",
      value: "35%",
      description: "Қайтариш кўрсаткичи"
    }
  ];

  const benefits = [
    {
      icon: Star,
      title: "Тан олинган бренд",
      description: "Ўзбекистонда танилган ва ишонилган organic бренд"
    },
    {
      icon: TrendingUp,
      title: "Мунтазам даромад",
      description: "Барқарор ва ривожланувчи бизнес модели"
    },
    {
      icon: Users,
      title: "Тўлиқ қўллаб-қувватлаш",
      description: "Маркетинг, тренинг ва операцион қўллаб-қувватлаш"
    },
    {
      icon: Building,
      title: "Локация ёрдами",
      description: "Энг муносиб жойларни танлашда ёрдам"
    },
    {
      icon: Clock,
      title: "Тез бошлаш",
      description: "30 кунда бизнесни ишга туширинг"
    },
    {
      icon: CheckCircle,
      title: "Кафолатли натижа",
      description: "Биринчи йилда фойда кафолати"
    }
  ];

  const requirements = [
    "Минимум $25,000 бошланғич капитал",
    "Бизнес тажрибаси (тавсия этилади)",
    "Organic маҳсулотларга қизиқиш",
    "Жамоа билан ишлаш қобилияти",
    "Шаҳар марказида жой",
    "Локал лицензиялар"
  ];

  const steps = [
    {
      step: 1,
      title: "Ариза бериш",
      description: "Онлайн ариза тўлдиринг ва франшиза пакетини танланг"
    },
    {
      step: 2,
      title: "Учрашув",
      description: "Бизнес режа ва шартларни муҳокама қиламиз"
    },
    {
      step: 3,
      title: "Шартнома",
      description: "Франшиза шартномасини имзолаймиз"
    },
    {
      step: 4,
      title: "Тренинг",
      description: "Тўлиқ тренинг дастури ва қўллаб-қувватлаш"
    },
    {
      step: 5,
      title: "Очилиш",
      description: "Франшиза филиалини расмий очиш"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full opacity-20"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}
        </div>

        <div className="container relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Organic Green{" "}
              <span className="text-green-600">Франшизаси</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Ўзбекистонда энг муваффақиятли organic маҳсулотлар франшизасига 
              қўшилинг ва барқарор даромад олинг
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Ҳозироқ бошлаш
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4 text-lg font-medium rounded-xl"
              >
                Бизнес режани кўринг
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{stat.title}</h3>
                    <p className="text-sm text-gray-600">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
              Франшиза <span className="text-green-600">афзалликлари</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Бизнинг франшиза дастуримиз сизга муваффақиятли бизнес бошлаш учун 
              барча зарур воситаларни таqdim етади
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg h-full">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4">
                      <benefit.icon className="w-7 h-7 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-green-100/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
              Қандай <span className="text-green-600">бошлаш</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              5 та оддий қадамда франшиза филиалини очинг
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-green-200 -z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6 font-heading">
                Франшиза <span className="text-green-600">талаблари</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Муваффақиятли ҳамкорлик учун қуйидаги талабларни қондириш зарур
              </p>
              
              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-green-100 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                  <CardTitle className="text-2xl font-bold text-center">
                    Ҳозироқ ариза беринг
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">$25,000</div>
                      <p className="text-gray-600">Бошланғич инвестиция</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">+998 90 123 45 67</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">franchise@organicgreen.uz</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Тошкент ш., Юнусобод т.</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Ариза бериш
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
