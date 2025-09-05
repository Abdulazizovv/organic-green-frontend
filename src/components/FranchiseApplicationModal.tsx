"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/context/ToastContext";
import { useLanguage } from "@/lib/language";
import { Loader2, FileText, Phone, Mail, MapPin, DollarSign, Briefcase, MessageSquare } from "lucide-react";

interface FranchiseApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  full_name: string;
  phone: string;
  email: string;
  city: string;
  investment_amount: string;
  experience: string;
  message: string;
}

interface FormErrors {
  [key: string]: string[];
}

export function FranchiseApplicationModal({ open, onOpenChange }: FranchiseApplicationModalProps) {
  const { showSuccess, showError } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    phone: "",
    email: "",
    city: "",
    investment_amount: "",
    experience: "",
    message: "",
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = [t("franchise.application.validation.fullNameRequired")];
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = [t("franchise.application.validation.fullNameMin")];
    } else if (formData.full_name.length > 255) {
      newErrors.full_name = [t("franchise.application.validation.fullNameMax")];
    }

    if (!formData.phone.trim()) {
      newErrors.phone = [t("franchise.application.validation.phoneRequired")];
    } else {
      const phoneDigits = formData.phone.replace(/[^\d]/g, "");
      if (phoneDigits.length < 10) {
        newErrors.phone = [t("franchise.application.validation.phoneMin")];
      }
    }

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = [t("franchise.application.validation.emailInvalid")];
      }
    }

    if (!formData.city.trim()) {
      newErrors.city = [t("franchise.application.validation.cityRequired")];
    } else if (formData.city.length < 2) {
      newErrors.city = [t("franchise.application.validation.cityMin")];
    } else if (formData.city.length > 100) {
      newErrors.city = [t("franchise.application.validation.cityMax")];
    }

    if (!formData.investment_amount.trim()) {
      newErrors.investment_amount = [t("franchise.application.validation.investmentRequired")];
    } else {
      const amount = parseFloat(formData.investment_amount);
      if (isNaN(amount) || amount < 0.01) {
        newErrors.investment_amount = [t("franchise.application.validation.investmentMin")];
      } else if (amount > 10000000) {
        newErrors.investment_amount = [t("franchise.application.validation.investmentMax")];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("https://api.organicgreen.uz/api/franchise/applications/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          investment_amount: parseFloat(formData.investment_amount),
          email: formData.email.trim() || undefined,
          experience: formData.experience.trim() || undefined,
          message: formData.message.trim() || undefined,
        }),
      });

      if (response.ok) {
        showSuccess(t("franchise.application.successMessage"));
        setFormData({
          full_name: "",
          phone: "",
          email: "",
          city: "",
          investment_amount: "",
          experience: "",
          message: "",
        });
        onOpenChange(false);
      } else {
        const errorData = await response.json();
        
        if (response.status === 400 && errorData) {
          // Handle validation errors from server
          setErrors(errorData);
        } else {
          showError(t("franchise.application.errorMessage"));
        }
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      showError(t("franchise.application.networkError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: [] }));
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-green-50/20 to-green-100/10 border-green-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <DialogHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center"
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <FileText className="w-6 h-6 text-green-600" />
                  </motion.div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      {t("franchise.application.title")}
                    </DialogTitle>
                    <DialogDescription className="text-base text-gray-600 mt-1">
                      {t("franchise.application.description")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <DialogClose onClose={() => onOpenChange(false)} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, staggerChildren: 0.1 }}
          >
            {/* Full Name */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Label htmlFor="full_name" className="flex items-center gap-2 text-gray-700 font-medium">
                <FileText className="w-4 h-4 text-green-600" />
                {t("franchise.application.fullName")} 
                <span className="text-red-500">{t("franchise.application.required")}</span>
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={handleInputChange("full_name")}
                placeholder={t("franchise.application.fullNamePlaceholder")}
                maxLength={255}
                className="h-11 border-green-200 focus:border-green-400 focus:ring-green-400"
              />
              {errors.full_name && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.full_name[0]}
                </p>
              )}
            </motion.div>

            {/* Phone */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
            >
              <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700 font-medium">
                <Phone className="w-4 h-4 text-green-600" />
                {t("franchise.application.phone")} 
                <span className="text-red-500">{t("franchise.application.required")}</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                placeholder={t("franchise.application.phonePlaceholder")}
                maxLength={20}
                className="h-11 border-green-200 focus:border-green-400 focus:ring-green-400"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.phone[0]}
                </p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 font-medium">
                <Mail className="w-4 h-4 text-green-600" />
                {t("franchise.application.email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                placeholder={t("franchise.application.emailPlaceholder")}
                className="h-11 border-green-200 focus:border-green-400 focus:ring-green-400"
              />
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.email[0]}
                </p>
              )}
            </motion.div>

            {/* City */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.3 }}
            >
              <Label htmlFor="city" className="flex items-center gap-2 text-gray-700 font-medium">
                <MapPin className="w-4 h-4 text-green-600" />
                {t("franchise.application.city")} 
                <span className="text-red-500">{t("franchise.application.required")}</span>
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={handleInputChange("city")}
                placeholder={t("franchise.application.cityPlaceholder")}
                maxLength={100}
                className="h-11 border-green-200 focus:border-green-400 focus:ring-green-400"
              />
              {errors.city && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.city[0]}
                </p>
              )}
            </motion.div>
          </motion.div>

          {/* Investment Amount */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <Label htmlFor="investment_amount" className="flex items-center gap-2 text-gray-700 font-medium">
              <DollarSign className="w-4 h-4 text-green-600" />
              {t("franchise.application.investmentAmount")} 
              <span className="text-red-500">{t("franchise.application.required")}</span>
            </Label>
            <Input
              id="investment_amount"
              type="number"
              step="0.01"
              min="0.01"
              max="10000000"
              value={formData.investment_amount}
              onChange={handleInputChange("investment_amount")}
              placeholder={t("franchise.application.investmentAmountPlaceholder")}
              className="h-11 border-green-200 focus:border-green-400 focus:ring-green-400"
            />
            {errors.investment_amount && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.investment_amount[0]}
              </p>
            )}
          </motion.div>

          {/* Experience */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.3 }}
          >
            <Label htmlFor="experience" className="flex items-center gap-2 text-gray-700 font-medium">
              <Briefcase className="w-4 h-4 text-green-600" />
              {t("franchise.application.experience")}
            </Label>
            <Textarea
              id="experience"
              value={formData.experience}
              onChange={handleInputChange("experience")}
              placeholder={t("franchise.application.experiencePlaceholder")}
              rows={3}
              className="border-green-200 focus:border-green-400 focus:ring-green-400 resize-none"
            />
            {errors.experience && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.experience[0]}
              </p>
            )}
          </motion.div>

          {/* Message */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <Label htmlFor="message" className="flex items-center gap-2 text-gray-700 font-medium">
              <MessageSquare className="w-4 h-4 text-green-600" />
              {t("franchise.application.message")}
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={handleInputChange("message")}
              placeholder={t("franchise.application.messagePlaceholder")}
              rows={3}
              className="border-green-200 focus:border-green-400 focus:ring-green-400 resize-none"
            />
            {errors.message && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.message[0]}
              </p>
            )}
          </motion.div>

          <motion.div 
            className="flex gap-4 pt-6 border-t border-green-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.3 }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 border-green-200 text-green-700 hover:bg-green-50"
              disabled={isSubmitting}
            >
              {t("franchise.application.cancel")}
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("franchise.application.submitting")}
                </>
              ) : (
                t("franchise.application.submit")
              )}
            </Button>
          </motion.div>
        </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
