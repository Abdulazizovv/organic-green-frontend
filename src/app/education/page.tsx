"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EducationApplicationModal } from "@/components/EducationApplicationModal";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  BookOpen, 
  Users, 
  Award, 
  Clock, 
  Play, 
  Download, 
  CheckCircle, 
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  GraduationCap
} from "lucide-react";

export default function EducationPage() {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stats = [
    {
      icon: Users,
      title: t('education_page.stats.students'),
      value: "1,200+",
      description: t('education_page.stats.students_description')
    },
    {
      icon: BookOpen,
      title: t('education_page.stats.courses'),
      value: "25+",
      description: t('education_page.stats.courses_description')
    },
    {
      icon: Award,
      title: t('education_page.stats.certificates'),
      value: "95%",
      description: t('education_page.stats.certificates_description')
    },
    {
      icon: Clock,
      title: t('education_page.stats.hours'),
      value: "500+",
      description: t('education_page.stats.hours_description')
    }
  ];

  const organicFarmingFeatures = [
    t('education_page.course_features.organic_farming.0'),
    t('education_page.course_features.organic_farming.1'),
    t('education_page.course_features.organic_farming.2'),
    t('education_page.course_features.organic_farming.3')
  ];

  const businessManagementFeatures = [
    t('education_page.course_features.business_management.0'),
    t('education_page.course_features.business_management.1'),
    t('education_page.course_features.business_management.2'),
    t('education_page.course_features.business_management.3')
  ];

  const expertLevelFeatures = [
    t('education_page.course_features.expert_level.0'),
    t('education_page.course_features.expert_level.1'),
    t('education_page.course_features.expert_level.2'),
    t('education_page.course_features.expert_level.3')
  ];

  const courses = [
    {
      icon: GraduationCap,
      title: t('education_courses.organic_farming'),
      description: t('education_courses.organic_farming_description'),
      duration: `3 ${t('education_modal.months')}`,
      level: t('education_modal.beginner'),
      price: "2,500,000",
      features: organicFarmingFeatures
    },
    {
      icon: BookOpen,
      title: t('education_courses.business_management'),
      description: t('education_courses.business_management_description'),
      duration: `2 ${t('education_modal.months')}`,
      level: t('education_modal.intermediate'),
      price: "3,000,000",
      features: businessManagementFeatures
    },
    {
      icon: Award,
      title: t('education_courses.expert_level'),
      description: t('education_courses.expert_level_description'),
      duration: `4 ${t('education_modal.months')}`,
      level: t('education_modal.advanced'),
      price: "4,500,000",
      features: expertLevelFeatures
    }
  ];

  const features = [
    {
      icon: Play,
      title: t('education_page.features.0.title'),
      description: t('education_page.features.0.description')
    },
    {
      icon: Users,
      title: t('education_page.features.1.title'),
      description: t('education_page.features.1.description')
    },
    {
      icon: Award,
      title: t('education_page.features.2.title'),
      description: t('education_page.features.2.description')
    },
    {
      icon: Download,
      title: t('education_page.features.3.title'),
      description: t('education_page.features.3.description')
    },
    {
      icon: Clock,
      title: t('education_page.features.4.title'),
      description: t('education_page.features.4.description')
    },
    {
      icon: CheckCircle,
      title: t('education_page.features.5.title'),
      description: t('education_page.features.5.description')
    }
  ];

  const testimonials = [
    {
      name: t('education_page.testimonials.0.name'),
      role: t('education_page.testimonials.0.role'),
      content: t('education_page.testimonials.0.content'),
      rating: 5,
      avatar: t('education_page.testimonials.0.avatar')
    },
    {
      name: t('education_page.testimonials.1.name'),
      role: t('education_page.testimonials.1.role'),
      content: t('education_page.testimonials.1.content'),
      rating: 5,
      avatar: t('education_page.testimonials.1.avatar')
    },
    {
      name: t('education_page.testimonials.2.name'),
      role: t('education_page.testimonials.2.role'),
      content: t('education_page.testimonials.2.content'),
      rating: 5,
      avatar: t('education_page.testimonials.2.avatar')
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
              <span className="text-green-600">{t('education_page.title')}</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('education_page.subtitle')}
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
                onClick={() => setIsModalOpen(true)}
              >
                {t('education_page.cta_button')}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4 text-lg font-medium rounded-xl"
              >
                {t('education_page.contact_section.title')}
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

      {/* Courses Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
              {t('education_page.courses_section.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('education_page.courses_section.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg h-full">
                  <CardHeader>
                    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4">
                      <course.icon className="w-7 h-7 text-green-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{course.title}</CardTitle>
                    <p className="text-gray-600">{course.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {course.level}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      {course.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-green-600">
                          {course.price} {t('education_page.courses_section.currency')}
                        </span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl"
                        onClick={() => setIsModalOpen(true)}
                      >
                        {t('education_page.courses_section.enroll_button')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-green-100/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
              {t('education_page.features_section.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('education_page.features_section.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
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
                      <feature.icon className="w-7 h-7 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
              {t('education_page.testimonials_section.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('education_page.testimonials_section.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-green-600">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
                {t('education_page.cta_section.title').split(' ').map((word, index, array) => (
                  index === array.length - 2 ? (
                    <span key={index} className="text-green-600">{word} </span>
                  ) : (
                    <span key={index}>{word} </span>
                  )
                ))}
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t('education_page.cta_section.subtitle')}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700">{t('education_page.cta_section.free_trial')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700">{t('education_page.cta_section.international_certificate')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700">{t('education_page.cta_section.lifetime_access')}</span>
                </div>
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
                    {t('education_page.contact_section.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">{t('education_page.contact_section.free_consultation')}</div>
                      <p className="text-gray-600">{t('education_page.contact_section.first_consultation')}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">+998 90 123 45 67</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">education@organicgreen.uz</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">{t('education_page.contact_section.address')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">{t('education_page.contact_section.working_hours')}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => setIsModalOpen(true)}
                    >
                      {t('education_page.contact_section.get_consultation')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Education Application Modal */}
      <EducationApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
