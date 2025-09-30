import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/useLanguage';
import { useApplication } from '@/hooks/useApplication';
import { getFormData, saveFormData } from '@/utils/application';
import { applicationSchema } from '@/utils/validation';
import type { Course } from '@/types/course';
import type { ApplicationFormValues } from '@/types/application';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export function ApplyModal({ isOpen, onClose, course }: ApplyModalProps) {
  const { t } = useLanguage();
  const { isSubmitting, submitApplication } = useApplication();
  
  const [formData, setFormData] = useState<ApplicationFormValues>({
    course: '',
    full_name: '',
    phone: '',
    email: '',
    city: '',
    investment_amount: undefined,
    referral_source: undefined,
    message: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Load prefilled data on mount
  useEffect(() => {
    const savedData = getFormData('application_prefill');
    if (savedData && typeof savedData === 'object') {
      setFormData(prev => ({
        ...prev,
        ...savedData,
        course: course?.slug || '',
      }));
    } else if (course) {
      setFormData(prev => ({
        ...prev,
        course: course.slug,
      }));
    }
  }, [course]);

  // Save draft on form changes
  useEffect(() => {
    if (formData.full_name || formData.phone || formData.email) {
      saveFormData('application_draft', formData);
    }
  }, [formData]);

  const handleInputChange = (field: keyof ApplicationFormValues, value: string | number | undefined) => {
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
    try {
      applicationSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error && typeof error === 'object' && 'issues' in error) {
        const fieldErrors: Record<string, string> = {};
        // @ts-expect-error - Zod error structure
        error.issues.forEach((issue) => {
          const field = issue.path[0];
          if (field && typeof field === 'string') {
            fieldErrors[field] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await submitApplication(formData);
    
    if (result.success) {
      setIsSuccess(true);
      // Auto-close after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
    } else if (result.error) {
      if (result.error.fields) {
        setErrors(result.error.fields);
      }
      // Show toast notification for general errors
      console.error('Application submission failed:', result.error.message);
    }
  };

  const handleClose = () => {
    setFormData({
      course: '',
      full_name: '',
      phone: '',
      email: '',
      city: '',
      investment_amount: undefined,
      referral_source: undefined,
      message: '',
    });
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-white/95 backdrop-blur-sm border-0 p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {isSuccess ? (
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
                {t('courses.application.success.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('courses.application.success.message')}
              </p>
              <p className="text-sm text-gray-500">
                {t('courses.application.success.autoClose')}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-xl font-bold">
                  {t('courses.application.title')}
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-2">
                  {course.title}
                </p>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Full Name */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="full_name">
                    {t('courses.application.form.fullName')} *
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
                    {t('courses.application.form.phone')} *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+998908440844"
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
                    {t('courses.application.form.email')}
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
                    {t('courses.application.form.city')} *
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
                    {t('courses.application.form.message')}
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={errors.message ? 'border-red-500' : ''}
                    disabled={isSubmitting}
                    rows={3}
                  />
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-3 pt-4"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {t('courses.application.form.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('courses.application.form.submitting')}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t('courses.application.form.submit')}
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
