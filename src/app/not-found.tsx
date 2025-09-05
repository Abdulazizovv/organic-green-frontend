'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Compass, RefreshCw } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.15),transparent_60%)]" />
      <div className="absolute -top-20 -right-32 w-96 h-96 bg-gradient-to-br from-green-200 to-emerald-400 rounded-full blur-3xl opacity-20" />
      <div className="absolute -bottom-24 -left-20 w-96 h-96 bg-gradient-to-br from-emerald-200 to-green-400 rounded-full blur-3xl opacity-20" />
      <div className="relative w-full max-w-md text-center">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold tracking-wide">404</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-700">Sahifa topilmadi</h1>
        <p className="text-gray-600 text-sm leading-relaxed mb-8">Kiritgan manzilingiz topilmadi yoki o&apos;chirilgan bo&apos;lishi mumkin. Quyidagi amallardan birini tanlashingiz mumkin.</p>
        <div className="grid gap-3">
          <Link href="/" className="group flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-white border border-gray-200 hover:border-emerald-400 shadow-sm hover:shadow transition text-sm font-medium">
            <Home className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition" /> Bosh sahifa
          </Link>
          <Link href="/admin/dashboard" className="group flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-white border border-gray-200 hover:border-emerald-400 shadow-sm hover:shadow transition text-sm font-medium">
            <Compass className="w-4 h-4 text-emerald-600 group-hover:rotate-12 transition" /> Admin panel
          </Link>
          <button onClick={() => window.location.reload()} className="group flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow transition text-sm font-medium">
            <RefreshCw className="w-4 h-4 group-hover:animate-spin" /> Sahifani yangilash
          </button>
        </div>
        <div className="mt-10">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-emerald-600">
            <ArrowLeft className="w-3 h-3" /> Ortga
          </Link>
        </div>
      </div>
    </div>
  );
}
