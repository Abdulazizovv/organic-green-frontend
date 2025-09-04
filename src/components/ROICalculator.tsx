"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language";

export function ROICalculator() {
  const { t } = useLanguage();
  const [initialInvestment, setInitialInvestment] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  
  const [roi, setRoi] = useState<number | null>(null);
  const [paybackPeriod, setPaybackPeriod] = useState<number | null>(null);

  useEffect(() => {
    const investment = parseFloat(initialInvestment) || 0;
    const revenue = parseFloat(monthlyRevenue) || 0;
    const expenses = parseFloat(monthlyExpenses) || 0;

    if (investment > 0 && revenue > 0) {
      const monthlyProfit = revenue - expenses;
      
      if (monthlyProfit > 0) {
        // Calculate ROI as (Annual Profit / Initial Investment) * 100
        const annualProfit = monthlyProfit * 12;
        const calculatedRoi = (annualProfit / investment) * 100;
        setRoi(calculatedRoi);
        
        // Calculate payback period in months
        const calculatedPayback = investment / monthlyProfit;
        setPaybackPeriod(calculatedPayback);
      } else {
        setRoi(null);
        setPaybackPeriod(null);
      }
    } else {
      setRoi(null);
      setPaybackPeriod(null);
    }
  }, [initialInvestment, monthlyRevenue, monthlyExpenses]);

  const formatCurrency = (value: string) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatMonths = (value: number) => {
    if (value < 12) {
      return `${value.toFixed(1)} ${t("franchise.roiCalculator.formatTime.months")}`;
    } else {
      const years = Math.floor(value / 12);
      const months = Math.round(value % 12);
      const yearText = years === 1 ? t("franchise.roiCalculator.formatTime.year") : t("franchise.roiCalculator.formatTime.years");
      const monthText = months === 1 ? t("franchise.roiCalculator.formatTime.month") : t("franchise.roiCalculator.formatTime.months");
      return months > 0 ? `${years} ${yearText} ${months} ${monthText}` : `${years} ${yearText}`;
    }
  };

  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
            {t("franchise.roiCalculator.title").split(" ")[0]} <span className="text-green-600">{t("franchise.roiCalculator.title").split(" ")[1]}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("franchise.roiCalculator.description")}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-green-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Calculator className="w-5 h-5" />
                    {t("franchise.roiCalculator.inputs.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="initial-investment" className="text-gray-700 font-medium">
                      {t("franchise.roiCalculator.inputs.initialInvestment")}
                    </Label>
                    <Input
                      id="initial-investment"
                      type="number"
                      step="1000"
                      min="0"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(e.target.value)}
                      placeholder={t("franchise.roiCalculator.inputs.initialInvestmentPlaceholder")}
                      className="text-lg"
                    />
                    {initialInvestment && (
                      <p className="text-sm text-gray-500">
                        {formatCurrency(initialInvestment)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthly-revenue" className="text-gray-700 font-medium">
                      {t("franchise.roiCalculator.inputs.monthlyRevenue")}
                    </Label>
                    <Input
                      id="monthly-revenue"
                      type="number"
                      step="500"
                      min="0"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(e.target.value)}
                      placeholder={t("franchise.roiCalculator.inputs.monthlyRevenuePlaceholder")}
                      className="text-lg"
                    />
                    {monthlyRevenue && (
                      <p className="text-sm text-gray-500">
                        {formatCurrency(monthlyRevenue)} {t("franchise.roiCalculator.inputs.perMonth")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthly-expenses" className="text-gray-700 font-medium">
                      {t("franchise.roiCalculator.inputs.monthlyExpenses")}
                    </Label>
                    <Input
                      id="monthly-expenses"
                      type="number"
                      step="500"
                      min="0"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(e.target.value)}
                      placeholder={t("franchise.roiCalculator.inputs.monthlyExpensesPlaceholder")}
                      className="text-lg"
                    />
                    {monthlyExpenses && (
                      <p className="text-sm text-gray-500">
                        {formatCurrency(monthlyExpenses)} {t("franchise.roiCalculator.inputs.perMonth")}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* ROI Card */}
              <Card className="border-green-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t("franchise.roiCalculator.results.roi.title")}</h3>
                      <p className="text-sm text-gray-600">{t("franchise.roiCalculator.results.roi.description")}</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold">
                    {roi !== null ? (
                      <span className={roi >= 20 ? "text-green-600" : roi >= 10 ? "text-yellow-600" : "text-red-600"}>
                        {formatPercentage(roi)}
                      </span>
                    ) : (
                      <span className="text-gray-400">---%</span>
                    )}
                  </div>
                  {roi !== null && (
                    <p className="text-sm text-gray-600 mt-2">
                      {roi >= 20 ? t("franchise.roiCalculator.results.roi.excellent") : roi >= 10 ? t("franchise.roiCalculator.results.roi.good") : t("franchise.roiCalculator.results.roi.belowAverage")} return rate
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Payback Period Card */}
              <Card className="border-blue-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t("franchise.roiCalculator.results.payback.title")}</h3>
                      <p className="text-sm text-gray-600">{t("franchise.roiCalculator.results.payback.description")}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    {paybackPeriod !== null ? (
                      <span className={paybackPeriod <= 24 ? "text-green-600" : paybackPeriod <= 36 ? "text-yellow-600" : "text-red-600"}>
                        {formatMonths(paybackPeriod)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-- {t("franchise.roiCalculator.formatTime.months")}</span>
                    )}
                  </div>
                  {paybackPeriod !== null && (
                    <p className="text-sm text-gray-600 mt-2">
                      {paybackPeriod <= 24 ? t("franchise.roiCalculator.results.payback.fast") : paybackPeriod <= 36 ? t("franchise.roiCalculator.results.payback.moderate") : t("franchise.roiCalculator.results.payback.long")} payback time
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Monthly Profit Display */}
              {monthlyRevenue && monthlyExpenses && (
                <Card className="border-purple-200 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("franchise.roiCalculator.results.profit.title")}</h3>
                    <div className="text-2xl font-bold">
                      {(() => {
                        const profit = (parseFloat(monthlyRevenue) || 0) - (parseFloat(monthlyExpenses) || 0);
                        return (
                          <span className={profit > 0 ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(profit.toString())}
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {t("franchise.roiCalculator.results.profit.description")}
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("franchise.roiCalculator.tips.title")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">{t("franchise.roiCalculator.tips.goodROI.title")}</h4>
                    <p>{t("franchise.roiCalculator.tips.goodROI.description")}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">{t("franchise.roiCalculator.tips.paybackPeriod.title")}</h4>
                    <p>{t("franchise.roiCalculator.tips.paybackPeriod.description")}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">{t("franchise.roiCalculator.tips.monthlyProfit.title")}</h4>
                    <p>{t("franchise.roiCalculator.tips.monthlyProfit.description")}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">{t("franchise.roiCalculator.tips.consider.title")}</h4>
                    <p>{t("franchise.roiCalculator.tips.consider.description")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
