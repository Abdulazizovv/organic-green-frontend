"use client";

import { motion } from "framer-motion";
import { Target, Heart, Users, Award, TreePine, Handshake, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";

export default function AboutPage() {
  const { t, language } = useLanguage();

  const values = [
    {
      icon: Heart,
      titleKey: "about.values.healthy_lifestyle.title",
      descriptionKey: "about.values.healthy_lifestyle.description"
    },
    {
      icon: TreePine,
      titleKey: "about.values.nature_protection.title", 
      descriptionKey: "about.values.nature_protection.description"
    },
    {
      icon: Handshake,
      titleKey: "about.values.reliability.title",
      descriptionKey: "about.values.reliability.description"
    },
    {
      icon: GraduationCap,
      titleKey: "about.values.innovation.title",
      descriptionKey: "about.values.innovation.description"
    }
  ];

  const milestones = [
    {
      year: "2021",
      titleKey: "about.timeline.2021.title",
      descriptionKey: "about.timeline.2021.description"
    },
    {
      year: "2022", 
      titleKey: "about.timeline.2022.title",
      descriptionKey: "about.timeline.2022.description"
    },
    {
      year: "2023",
      titleKey: "about.timeline.2023.title",
      descriptionKey: "about.timeline.2023.description"
    },
    {
      year: "2024",
      titleKey: "about.timeline.2024.title", 
      descriptionKey: "about.timeline.2024.description"
    }
  ];

  const team = [
    {
      nameKey: "about.team.aziz.name",
      positionKey: "about.team.aziz.position",
      descriptionKey: "about.team.aziz.description",
      image: "/images/team/aziz.jpg"
    },
    {
      nameKey: "about.team.malika.name",
      positionKey: "about.team.malika.position", 
      descriptionKey: "about.team.malika.description",
      image: "/images/team/malika.jpg"
    },
    {
      nameKey: "about.team.sherzod.name",
      positionKey: "about.team.sherzod.position",
      descriptionKey: "about.team.sherzod.description",
      image: "/images/team/sherzod.jpg"
    },
    {
      nameKey: "about.team.nigora.name",
      positionKey: "about.team.nigora.position",
      descriptionKey: "about.team.nigora.description",
      image: "/images/team/nigora.jpg"
    }
  ];

  const socialProjects = [
    {
      titleKey: "about.social_projects.school_nutrition.title",
      descriptionKey: "about.social_projects.school_nutrition.description", 
      impactKey: "about.social_projects.school_nutrition.impact",
      icon: Heart
    },
    {
      titleKey: "about.social_projects.farmer_support.title",
      descriptionKey: "about.social_projects.farmer_support.description",
      impactKey: "about.social_projects.farmer_support.impact", 
      icon: Users
    },
    {
      titleKey: "about.social_projects.eco_cleanliness.title",
      descriptionKey: "about.social_projects.eco_cleanliness.description",
      impactKey: "about.social_projects.eco_cleanliness.impact",
      icon: TreePine
    }
  ];

  // Localized addresses (same as Footer)
  const addresses: Record<string, string[]> = {
    uz: [
      'Тошкент Шахар, М Улугбек тумани, Корасу 6, 17а',
      'Фаргона Шахар, Машъал МФЙ Б.Маргиноний 24',
    ],
    ru: [
      'г. Ташкент, Мирзо-Улугбекский район, Карасу-6, 17а',
      'г. Фергана, МФЙ «Машъал», Б. Маргиланий, 24',
    ],
    en: [
      'Tashkent city, Mirzo Ulugbek district, Karasu-6, 17a',
      'Fergana city, Mashal MFY, B. Margilaniy 24',
    ],
  };
  const localizedAddresses = addresses[language] ?? addresses.uz;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('about.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              {t('about.hero.description')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-200">5,000+</div>
                <div className="text-green-100">{t('about.hero.stats.customers')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-200">50+</div>
                <div className="text-green-100">{t('about.hero.stats.products')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-200">15+</div>
                <div className="text-green-100">{t('about.hero.stats.certificates')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">
                {t('about.mission.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('about.mission.description')}
              </p>
              <p className="text-lg text-gray-600 mb-8">
                {t('about.mission.quality_statement')}
              </p>
              <div className="flex items-center space-x-4">
                <Target className="w-12 h-12 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{t('about.mission.goal_title')}</h3>
                  <p className="text-gray-600">{t('about.mission.goal_description')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-green-100 to-green-200 p-8 flex items-center justify-center">
                <Award className="w-32 h-32 text-green-600" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              {t('about.values.section_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.values.section_description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center p-6 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">{t(value.titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {t(value.descriptionKey)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              {t('about.timeline.section_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.timeline.section_description')}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex items-center mb-12 last:mb-0"
              >
                <div className="flex-1"></div>
                
                <div className="flex-1 max-w-md">
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                          {milestone.year.slice(-2)}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{t(milestone.titleKey)}</CardTitle>
                          <div className="text-sm text-green-600 font-medium">
                            {milestone.year}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{t(milestone.descriptionKey)}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="w-8 flex justify-center">
                  <div className="w-1 h-24 bg-green-200"></div>
                </div>
                
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              {t('about.team.section_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.team.section_description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={t(member.nameKey)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <Users className="w-20 h-20 text-green-600" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{t(member.nameKey)}</CardTitle>
                    <div className="text-green-600 font-medium">
                      {t(member.positionKey)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{t(member.descriptionKey)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Projects */}
      <section className="py-20 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              {t('about.social_projects.section_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.social_projects.section_description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {socialProjects.map((project, index) => (
              <motion.div
                key={t(project.titleKey)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <project.icon className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{t(project.titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{t(project.descriptionKey)}</p>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="font-semibold text-green-600">
                        {t('about.social_projects.impact_label')} {t(project.impactKey)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations with Interactive Maps */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              {t('about.locations.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.locations.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {localizedAddresses.map((addr, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">{idx + 1}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{t('footer.contact.address')}</div>
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
                <div className="w-full overflow-hidden rounded-xl border border-gray-200">
                  <iframe
                    title={`map-${idx}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(addr)}&output=embed`}
                    className="w-full h-64"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              {t('about.cta.title')}
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              {t('about.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="outline" className="bg-white text-green-600 hover:bg-gray-50">
                {t('about.cta.contact_button')}
              </Button>
              <Button size="xl" variant="gold">
                {t('about.cta.partner_button')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
