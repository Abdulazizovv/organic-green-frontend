import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle, AlertCircle, BookOpen, Award, GraduationCap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { educationAPI } from '@/api/education';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/hooks/useLanguage';
import type { EducationApplicationRequest } from '@/api/education';

interface Course {
  id: string;
  slug: string; // API uchun slug kerak
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface EducationApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EducationApplicationModal({ isOpen, onClose }: EducationApplicationModalProps) {
  const { showSuccess, showError, showWarning } = useToast();
  const { t } = useLanguage();
  
  const [step, setStep] = useState<'course-selection' | 'form' | 'success'>('course-selection');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    city: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const courses: Course[] = [
    {
      id: 'organic-farming',
      slug: 'organic-farming-basics',
      title: t('education_courses.organic_farming'),
      description: t('education_courses.organic_farming_description'),
      duration: `3 ${t('education_modal.months')}`,
      level: t('education_modal.beginner'),
      price: `2,500,000 ${t('education_modal.som')}`,
      icon: GraduationCap
    },
    {
      id: 'business-management',
      slug: 'organic-business-management',
      title: t('education_courses.business_management'),
      description: t('education_courses.business_management_description'),
      duration: `2 ${t('education_modal.months')}`,
      level: t('education_modal.intermediate'),
      price: `3,000,000 ${t('education_modal.som')}`,
      icon: BookOpen
    },
    {
      id: 'expert-level',
      slug: 'advanced-organic-technologies',
      title: t('education_courses.expert_level'),
      description: t('education_courses.expert_level_description'),
      duration: `4 ${t('education_modal.months')}`,
      level: t('education_modal.advanced'),
      price: `4,500,000 ${t('education_modal.som')}`,
      icon: Award
    }
  ];

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setStep('form');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = t('education_modal.full_name_required');
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('education_modal.phone_required');
    } else if (!/^\+998\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('education_modal.phone_invalid');
    }
    
    if (!formData.city.trim()) {
      newErrors.city = t('education_modal.city_required');
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('education_modal.email_invalid');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError(
        t('education_toasts.form_error'),
        t('education_toasts.form_error_title')
      );
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🚀 Submitting application for:', selectedCourse?.title);
      // API ga yuborish - backend API format bo'yicha
      const applicationData: EducationApplicationRequest = {
        course_name: selectedCourse?.title || '', // backend kurs nomini kutadi
        full_name: formData.full_name,
        phone_number: formData.phone, // backend phone_number kutadi
        email: formData.email || undefined,
        city: formData.city,
        message: formData.message || undefined,
      };

      // Real backend API chaqiruvi
      const response = await educationAPI.submitApplication(applicationData);
      
      console.log('✅ API Response received:', response);
      
      // Success - agar response kelgan bo'lsa (status 200/201)
      // Success notification
      showSuccess(
        `${selectedCourse?.title} ${t('education_toasts.success_message')} ${t('education_modal.success_description')}`,
        `✅ ${t('education_toasts.success_title')}`
      );
      
      // Modal success step ko'rsatish
      setStep('success');
      
      // 2 soniyadan keyin modalni yopish
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('❌ Application submission error:', error);
      
      // Axios error ma'lumotlarini batafsil chiqarish
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            statusText?: string;
            headers?: Record<string, string>;
            data?: unknown;
          };
          config?: {
            url?: string;
            method?: string;
            data?: unknown;
          };
        };
        
        console.error('🔍 Server Response Details:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          headers: axiosError.response?.headers,
          data: axiosError.response?.data,
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          sentData: axiosError.config?.data
        });
        
        // Server error message ni ko'rsatish
        if (axiosError.response?.data) {
          console.error('📄 Server Error Message:', JSON.stringify(axiosError.response.data, null, 2));
        }
        
        // Backend error handling
        const status = axiosError.response?.status;
        const errorData = axiosError.response?.data as { detail?: string; message?: string; error?: string } | undefined;
        
        if (status === 400) {
          // 14 kunlik limitation check - keng qidiruv
          const errorText = (errorData?.detail || errorData?.message || errorData?.error || '').toLowerCase();
          
          if (errorText.includes('14') || errorText.includes('duplicate') || errorText.includes('already') || 
              errorText.includes('exist') || errorText.includes('период') || errorText.includes('time')) {
            showWarning(
              t('education_toasts.duplicate_warning'),
              `⚠️ ${t('education_toasts.duplicate_title')}`
            );
          } else if (errorText.includes('full') || errorText.includes('тўлди') || errorText.includes('seats')) {
            showError(
              t('education_toasts.course_full'),
              `❌ ${t('education_toasts.course_full_title')}`
            );
          } else {
            // Generic validation error
            showError(
              errorData?.detail || errorData?.message || errorData?.error || t('education_toasts.validation_error'),
              `❌ ${t('education_toasts.validation_error_title')}`
            );
          }
        } else if (status === 429) {
          // Rate limiting
          showWarning(
            t('education_toasts.rate_limit'),
            `⚠️ ${t('education_toasts.rate_limit_title')}`
          );
        } else if (status === 500) {
          // Server error
          showError(
            t('education_toasts.server_error'),
            `❌ ${t('education_toasts.server_error_title')}`
          );
        } else {
          // Generic error
          showError(
            t('education_toasts.generic_error'),
            `❌ ${t('education_toasts.generic_error_title')}`
          );
        }
      } else {
        console.error('🚫 Network or other error:', error);
        // Network error
        showError(
          t('education_toasts.network_error'),
          `❌ ${t('education_toasts.network_error_title')}`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('course-selection');
    setSelectedCourse(null);
    setFormData({
      full_name: '',
      phone: '',
      email: '',
      city: '',
      message: '',
    });
    setErrors({});
    onClose();
  };

  const getLevelColor = (level: string) => {
    const beginnerText = t('education_modal.beginner');
    const intermediateText = t('education_modal.intermediate');
    const advancedText = t('education_modal.advanced');
    
    switch (level) {
      case beginnerText:
        return 'bg-green-100 text-green-800 border-green-200';
      case intermediateText:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case advancedText:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl bg-white/95 backdrop-blur-sm border-0 p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 'course-selection' && (
            <motion.div
              key="course-selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-bold text-center">
                  {t('education_modal.select_course')}
                </DialogTitle>
                <p className="text-gray-600 text-center mt-2">
                  {t('education_modal.select_course_description')}
                </p>
              </DialogHeader>

              <div className="space-y-4">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleCourseSelect(course)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <course.icon className="w-6 h-6 text-green-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{course.title}</h3>
                          <Badge className={getLevelColor(course.level)}>
                            {course.level}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{course.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>⏱️ {course.duration}</span>
                            <span>💰 {course.price}</span>
                          </div>
                          
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            {t('education_modal.select')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'form' && selectedCourse && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6"
            >
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl font-bold">
                  {t('education_modal.apply_form')} - {selectedCourse.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getLevelColor(selectedCourse.level)}>
                    {selectedCourse.level}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {selectedCourse.duration} • {selectedCourse.price}
                  </span>
                </div>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="full_name">
                    {t('education_modal.full_name')} *
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className={errors.full_name ? 'border-red-500' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.full_name && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.full_name}
                    </motion.p>
                  )}
                </motion.div>

                {/* Phone */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="phone">
                    {t('education_modal.phone')} *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t('education_modal.phone_placeholder')}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={errors.phone ? 'border-red-500' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </motion.p>
                  )}
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="email">
                    {t('education_modal.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </motion.p>
                  )}
                </motion.div>

                {/* City */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="city">
                    {t('education_modal.city')} *
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={errors.city ? 'border-red-500' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.city && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.city}
                    </motion.p>
                  )}
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="message">
                    {t('education_modal.message')}
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    disabled={isSubmitting}
                    rows={3}
                  />
                </motion.div>

                {/* Submit Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-3 pt-4"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('course-selection')}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {t('education_modal.back')}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('education_modal.submitting')}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t('education_modal.submit')}
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('education_modal.success_title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('education_modal.success_description')}
              </p>
              <p className="text-sm text-gray-500">
                {t('education_modal.auto_close')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
