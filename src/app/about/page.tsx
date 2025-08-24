"use client";

import { motion } from "framer-motion";
import { Target, Heart, Users, Award, TreePine, Handshake, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Heart,
    title: "Соғлом турмуш тарзи",
    description: "Табиий ва органик маҳсулотлар орқали одамларнинг соғлиғини ва турмуш сифатини яхшилаш"
  },
  {
    icon: TreePine,
    title: "Табиатни ҳимоя қилиш",
    description: "Экологик тоза ишлаб чиқариш ва аtrof-муҳитни сақлаш бўйича масъулият"
  },
  {
    icon: Handshake,
    title: "Ишончлилик",
    description: "Мижозлар билан узоқ муддатли ва взаимоменфааатли муносабатлар ўрнатиш"
  },
  {
    icon: GraduationCap,
    title: "Инновация",
    description: "Илмий тадқиқотлар ва замонавий технологиялар асосида ривожланиш"
  }
];

const team = [
  {
    name: "Азиз Каримов",
    position: "Бош директор",
    description: "10 йилдан ортиқ тажрибаси бор агробизнес соҳаси мутахассиси",
    image: "/images/team/aziz.jpg"
  },
  {
    name: "Малика Усманова",
    position: "Илмий раҳбар",
    description: "Биотехнология ва микрозелень соҳасида PhD илмий даражаси",
    image: "/images/team/malika.jpg"
  },
  {
    name: "Шерзод Ахмедов", 
    position: "Маркетинг директори",
    description: "Халқаро стандартлар бўйича маркетинг ва савдо мутахассиси",
    image: "/images/team/sherzod.jpg"
  },
  {
    name: "Нигора Рустамова",
    position: "Ишлаб чиқариш раҳбари",
    description: "Сифат назорати ва ишлаб чиқариш жараёнлари мутахассиси",
    image: "/images/team/nigora.jpg"
  }
];

const milestones = [
  {
    year: "2021",
    title: "Компания асослаштирилди",
    description: "Тошкентда биринчи микрозелень лабораторияси очилди"
  },
  {
    year: "2022", 
    title: "Ишлаб чиқариш кенгайтирилди",
    description: "50+ турдаги микрозелень ишлаб чиқаришга киришилди"
  },
  {
    year: "2023",
    title: "Халқаро сертификатлар",
    description: "ISO 9001, HALAL ва ORGANIC сертификатлари олинди"
  },
  {
    year: "2024",
    title: "Франшиза дастури",
    description: "Биринчи франшиза шериклари билан ҳамкорлик бошланди"
  }
];

const socialProjects = [
  {
    title: "Мактабларда соғлом овқатланиш",
    description: "100+ мактабда болаларга микрозелень ва табиий маҳсулотлар таъминлаш дастури",
    impact: "5000+ бола",
    icon: GraduationCap
  },
  {
    title: "Фермерларни қўллаб-қувватлаш",
    description: "Қишлоқ жойларида яшовчи фермерларга бепул таълим ва техник ёрдам",
    impact: "200+ фермер",
    icon: Users
  },
  {
    title: "Экологик тозалик",
    description: "Табиатни сақлаш ва пластик чиқиндиларни кайта ишлаш лойиҳалари",
    impact: "50 тонна чиқинди",
    icon: TreePine
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-green-50 to-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Биз ҳақимизда
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              2021 йилдан бери Ўзбекистонда микрозелень ва табиий маҳсулотлар соҳасида 
              фаолият олиб борувчи етакчи компания
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-gray-600">Мамнун мижозлар</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-gray-600">Маҳсулот турлари</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">15+</div>
                <div className="text-gray-600">Халқаро сертификат</div>
              </div>
            </div>
          </motion.div>
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
                Бизнинг миссиямиз
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Ўзбекистон аҳолисини табиий ва сифатли микрозелень, БАД қўшимчалар 
                билан таъминлаш орқали соғлом турмуш тарзини ривожлантириш.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Биз фақат юқори сифатли, экологик тоза ва халкаро стандартларга 
                мос маҳсулотлар ишлаб чиқарамиз.
              </p>
              <div className="flex items-center space-x-4">
                <Target className="w-12 h-12 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Мақсадимиз</h3>
                  <p className="text-gray-600">2025 йилга қадар 10,000+ оилани соғлом маҳсулотлар билан таъминлаш</p>
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
              Бизнинг қадриятларимиз
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Компаниямизнинг ҳар бир фаолияти асосида ётган принциплар
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
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
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {value.description}
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
              Бизнинг тарихимиз
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Компания ривожланишининг муҳим босқичлари
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
                className={`flex items-center mb-12 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className="flex-1">
                  <Card className="p-6">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                          {milestone.year.slice(-2)}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{milestone.title}</CardTitle>
                          <div className="text-sm text-green-600 font-medium">
                            {milestone.year}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{milestone.description}</p>
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
              Бизнинг жамоамиз
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Тажрибали мутахассислар ва соҳа экспертлари
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
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
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <div className="text-green-600 font-medium">
                      {member.position}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{member.description}</p>
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
              Ижтимоий лойиҳаларимиз
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Жамият фаровонлигига қўшган ҳиссамиз
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {socialProjects.map((project, index) => (
              <motion.div
                key={project.title}
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
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="font-semibold text-green-600">
                        Таъсир: {project.impact}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
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
              Бизга қўшилинг!
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Соғлом турмуш тарзини ривожлантириш миссиясида биз билан ҳамкорлик қилинг
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="outline" className="bg-white text-green-600 hover:bg-gray-50">
                Алоқа
              </Button>
              <Button size="xl" variant="gold">
                Ҳамкор бўлиш
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
