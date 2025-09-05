"use client";
import React from 'react';
import { Sparkles, Clock } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ title = 'Yaqin kunlarda', description = 'Bu bo\'lim ustida hozir ishlanmoqda. Tez orada to\'liq funksionallik qo\'shiladi.', icon }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm p-10 flex flex-col items-center text-center">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,#bbf7d0,transparent_60%)] opacity-60" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-green-300 to-emerald-500 rounded-full blur-3xl opacity-20" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-emerald-300 to-green-500 rounded-full blur-3xl opacity-20" />
      <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg mb-6">
        {icon || <Sparkles className="w-10 h-10" />}
      </div>
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600 tracking-tight mb-4">{title}</h1>
      <p className="text-sm md:text-base text-gray-600 max-w-xl leading-relaxed mb-8">{description}</p>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 shadow-inner">
          <Clock className="w-4 h-4" />
          Tez orada
        </div>
        <p className="text-[11px] text-gray-400">Biz ushbu bo\'limni yakunlashimiz bilanoq foydalanish imkoniyati ochiladi.</p>
      </div>
    </div>
  );
};

export default ComingSoon;
