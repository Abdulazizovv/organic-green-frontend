"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageCircle,
  User,
  Building,
  CheckCircle
} from "lucide-react";
import { useLanguage } from "@/lib/language";
import { getLocalizedAddresses } from "@/data/locations";

export default function ContactPage() {
  const { t, language } = useLanguage();
  const localizedAddresses = getLocalizedAddresses(language);

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contactPage.address'),
      value: localizedAddresses[0] ?? '',
      description: t('contactPage.address_desc')
    },
    {
      icon: Phone,
      title: t('contactPage.phone'),
      value: "+998 90 844 08 44",
      description: t('contactPage.phone_desc')
    },
    {
      icon: Mail,
      title: t('contactPage.email'),
      value: "info@organicgreen.uz",
      description: t('contactPage.email_desc')
    },
    {
      icon: Clock,
      title: t('contactPage.hours'),
      value: t('contactPage.hours_value'),
      description: t('contactPage.hours_desc')
    }
  ];

  const departments = [
    {
      title: "Сотув бўлими",
      phone: "+998 90 844 08 44",
      email: "sales@organicgreen.uz",
      description: "Маҳсулотлар сотиб олиш ва нархлар ҳақида"
    },
    {
      title: "Франшиза бўлими",
      phone: "+998 90 123 45 68",
      email: "franchise@organicgreen.uz",
      description: "Франшиза ва ҳамкорлик имкониятлари"
    },
    {
      title: "Таълим маркази",
      phone: "+998 90 123 45 69",
      email: "education@organicgreen.uz",
      description: "Курслар ва тренинглар ҳақида"
    },
    {
      title: "Техник қўллаб-қувватлаш",
      phone: "+998 90 123 45 70",
      email: "support@organicgreen.uz",
      description: "Техник муаммолар ва ёрдам"
    }
  ];

  const socialLinks = [
    { name: "Telegram", url: "https://t.me/organicgreen_uz" },
    { name: "Instagram", url: "https://instagram.com/organicgreen_uz" },
    { name: "Facebook", url: "https://facebook.com/organicgreen.uz" },
    { name: "YouTube", url: "https://youtube.com/@organicgreen_uz" }
  ];

  const stats = [
    {
      icon: MessageCircle,
      title: "Сўровлар",
      value: "500+",
      description: "Ойлик сўровлар сони"
    },
    {
      icon: Clock,
      title: "Жавоб вақти",
      value: "< 2 соат",
      description: "Ўртача жавоб вақти"
    },
    {
      icon: CheckCircle,
      title: "Ҳал қилинган",
      value: "98%",
      description: "Муваффақиятли ҳал этилган"
    },
    {
      icon: User,
      title: "Мижозлар",
      value: "1000+",
      description: "Қаноатли мижозлар"
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
              {t('contactPage.hero_title_part1')} <span className="text-green-600">{t('contactPage.hero_title_part2')}</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('contactPage.hero_subtitle')}
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
                <MessageCircle className="w-5 h-5 mr-2" />
                {t('contactPage.send_message')}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4 text-lg font-medium rounded-xl"
              >
                <Phone className="w-5 h-5 mr-2" />
                {t('contactPage.call_us')}
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

      {/* Contact Form and Info Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-green-100 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">{t('contactPage.form.title')}</CardTitle>
                  <p className="text-gray-600">{t('contactPage.form.subtitle')}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactPage.form.first_name')}</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Исмингизни киритинг"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactPage.form.last_name')}</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Фамилияингизни киритинг"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactPage.form.email')}</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactPage.form.phone')}</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+998 90 844 08 44"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactPage.form.topic')}</label>
                    <select className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>{t('contactPage.form.topics.general')}</option>
                      <option>{t('contactPage.form.topics.products')}</option>
                      <option>{t('contactPage.form.topics.franchise')}</option>
                      <option>{t('contactPage.form.topics.education')}</option>
                      <option>{t('contactPage.form.topics.support')}</option>
                      <option>{t('contactPage.form.topics.partnership')}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactPage.form.message')}</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="Саволингизни батафсил ёзинг..."
                    />
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <Send className="w-5 h-5 mr-2" />
                    {t('contactPage.form.submit')}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">
                  {t('contactPage.info.title_part1')} <span className="text-green-600">{t('contactPage.info.title_part2')}</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {t('contactPage.info.subtitle')}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                            <info.icon className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{info.title}</h3>
                            <p className="text-green-600 font-medium mb-1">{info.value}</p>
                            <p className="text-sm text-gray-600">{info.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-green-100/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
              {t('contactPage.departments.title_part1')} <span className="text-green-600">{t('contactPage.departments.title_part2')}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('contactPage.departments.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {departments.map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{dept.title}</h3>
                        <p className="text-gray-600 mb-4">{dept.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-medium">{dept.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-medium">{dept.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
              {t('about.locations.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.locations.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {localizedAddresses.map((addr, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="space-y-3"
              >
                <Card className="border-green-100 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="w-full overflow-hidden">
                      <iframe
                        title={`contact-map-${idx}`}
                        src={`https://www.google.com/maps?q=${encodeURIComponent(addr)}&output=embed`}
                        className="w-full h-72 md:h-80"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-4 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">{idx + 1}</div>
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-green-600" /> {t('footer.contact.address')}</div>
                        <div className="text-gray-600">{addr}</div>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(addr)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          {t('about.locations.view_on_map')}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-green-100/50">
        <div className="container">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
              {t('contactPage.social.title_part1')} <span className="text-green-600">{t('contactPage.social.title_part2')}</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('contactPage.social.subtitle')}
            </p>
            
            <div className="flex justify-center gap-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="w-16 h-16 bg-white border border-green-200 rounded-xl flex items-center justify-center hover:border-green-300 hover:shadow-lg transition-all duration-300 group"
                >
                  <span className="text-green-600 font-semibold group-hover:scale-110 transition-transform">
                    {social.name.slice(0, 2)}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
