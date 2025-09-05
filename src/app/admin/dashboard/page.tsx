'use client';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { adminAPI, DashboardResponse } from '@/services/adminAPI';
import { useToast } from '@/context/ToastContext';
import { Users, Package, ShoppingCart, DollarSign, RefreshCw, Clock, GraduationCap, Factory, Sparkles, Activity, PackageCheck, ClipboardList } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useToast();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStats = useCallback(() => {
    setLoading(true); setError(null);
    adminAPI.getDashboardStats()
      .then(r => { setStats(r.data); setLastUpdated(new Date().toLocaleTimeString()); })
      .catch(e => { const msg = e?.message || 'Ma&apos;lumotni yuklashda xatolik'; setError(msg); showError(msg, 'Dashboard'); })
      .finally(() => setLoading(false));
  }, [showError]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchStats, 15000); // 15s
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoRefresh, fetchStats]);

  const orderStatusPie = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Kutilmoqda', value: stats.order_stats.pending_orders, color: '#f59e0b' },
      { name: 'Tugallangan', value: stats.order_stats.completed_orders, color: '#10b981' },
    ];
  }, [stats]);

  const revenueTrend = useMemo(() => {
    if (!stats) return [];
    // mock simple cumulative growth using month_revenue as upper bound
    const base = stats.revenue_stats.month_revenue || 0;
    return Array.from({ length: 12 }).map((_, i) => ({ oy: i + 1, daromad: Math.round(base * (0.2 + (i / 15))) }));
  }, [stats]);

  const dailyOrders = useMemo(() => {
    if (!stats) return [];
    const totalWeek = stats.order_stats.week_orders || 0;
    return Array.from({ length: 7 }).map((_, i) => ({ kun: `K${i + 1}`, soni: Math.round(totalWeek / 7) + (i % 2 === 0 ? 1 : 0) }));
  }, [stats]);

  const generatedAt = stats?.generated_at ? new Date(stats.generated_at).toLocaleString() : lastUpdated;

  return (
    <AdminGuard>
      <AdminLayout title="Boshqaruv paneli" description="Umumiy ko'rsatkichlar va real vaqt statistikasi">
        <div className="space-y-8">
          {/* Top actions */}
          <div className="flex flex-wrap gap-3 items-center">
            <button onClick={fetchStats} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white border text-sm hover:bg-green-50">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Yangilash
            </button>
            <label className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border text-xs font-medium select-none">
              <input type="checkbox" className="h-4 w-4" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} /> Avto 15s
            </label>
            <div className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Oxirgi yangilanish: {generatedAt || '—'}</div>
          </div>

          {/* Metric groups */}
          <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-5">
            {/* Foydalanuvchilar */}
            <Link href="/admin/users" className="p-4 rounded-xl bg-white border shadow-sm hover:shadow-md transition group relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-green-600 to-emerald-500 transition" />
              <div className="flex items-center justify-between mb-1"><span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Foydalanuvchilar</span><Users className="w-4 h-4 text-green-600" /></div>
              <p className="text-2xl font-semibold text-gray-900">{stats?.user_stats.total_users ?? '—'}</p>
              <p className="mt-1 text-[11px] text-gray-500">Faol: {stats?.user_stats.active_users}</p>
              <p className="mt-1 text-[11px] text-gray-400">Bugun: {stats?.user_stats.new_users_today} • Hafta: {stats?.user_stats.new_users_week}</p>
            </Link>
            {/* Mahsulotlar */}
            <Link href="/admin/products" className="p-4 rounded-xl bg-white border shadow-sm hover:shadow-md transition group relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-amber-500 to-yellow-400 transition" />
              <div className="flex items-center justify-between mb-1"><span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Mahsulotlar</span><Package className="w-4 h-4 text-amber-500" /></div>
              <p className="text-2xl font-semibold text-gray-900">{stats?.product_stats.total_products ?? '—'}</p>
              <p className="mt-1 text-[11px] text-gray-500">Faol: {stats?.product_stats.active_products} • Tanlangan: {stats?.product_stats.featured_products}</p>
              <p className="mt-1 text-[11px] text-gray-400">Tugagan: {stats?.product_stats.out_of_stock}</p>
            </Link>
            {/* Buyurtmalar */}
            <Link href="/admin/orders" className="p-4 rounded-xl bg-white border shadow-sm hover:shadow-md transition group relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-sky-500 to-cyan-400 transition" />
              <div className="flex items-center justify-between mb-1"><span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Buyurtmalar</span><ShoppingCart className="w-4 h-4 text-sky-500" /></div>
              <p className="text-2xl font-semibold text-gray-900">{stats?.order_stats.total_orders ?? '—'}</p>
              <p className="mt-1 text-[11px] text-gray-500">Kutilmoqda: {stats?.order_stats.pending_orders} • Tugallangan: {stats?.order_stats.completed_orders}</p>
              <p className="mt-1 text-[11px] text-gray-400">Bugun: {stats?.order_stats.today_orders} • Hafta: {stats?.order_stats.week_orders}</p>
            </Link>
            {/* Daromad */}
            <div className="p-4 rounded-xl bg-white border shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 hover:opacity-10 bg-gradient-to-br from-emerald-500 to-green-400 transition" />
              <div className="flex items-center justify-between mb-1"><span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Daromad</span><DollarSign className="w-4 h-4 text-emerald-600" /></div>
              <p className="text-2xl font-semibold text-gray-900">{stats?.revenue_stats.month_revenue ?? '—'}</p>
              <p className="mt-1 text-[11px] text-gray-500">Bugun: {stats?.revenue_stats.today_revenue}</p>
              <p className="mt-1 text-[11px] text-gray-400">Hafta: {stats?.revenue_stats.week_revenue}</p>
            </div>
            {/* Arizalar */}
            <div className="p-4 rounded-xl bg-white border shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 hover:opacity-10 bg-gradient-to-br from-indigo-500 to-violet-500 transition" />
              <div className="flex items-center justify-between mb-1"><span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Arizalar</span><ClipboardList className="w-4 h-4 text-indigo-500" /></div>
              <p className="text-2xl font-semibold text-gray-900">{(stats?.application_stats.course_applications ?? 0) + (stats?.application_stats.franchise_applications ?? 0)}</p>
              <p className="mt-1 text-[11px] text-gray-500">Kurs: {stats?.application_stats.course_applications} • Franshiza: {stats?.application_stats.franchise_applications}</p>
              <p className="mt-1 text-[11px] text-gray-400">Kutilmoqda: { (stats?.application_stats.pending_course_applications ?? 0) + (stats?.application_stats.pending_franchise_applications ?? 0)}</p>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="bg-white border rounded-xl p-5 flex flex-col min-h-[300px]">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-green-600" /> Buyurtmalar holati</h3>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={orderStatusPie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>
                      {orderStatusPie.map(s => <Cell key={s.name} fill={s.color} />)}
                    </Pie>
                    <Legend />
                    <RTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white border rounded-xl p-5 flex flex-col min-h-[300px]">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><PackageCheck className="w-4 h-4 text-emerald-600" /> Daromad trendlari</h3>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="oy" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} />
                    <RTooltip />
                    <Area type="monotone" dataKey="daromad" stroke="#059669" fillOpacity={1} fill="url(#revGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white border rounded-xl p-5 flex flex-col min-h-[300px]">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" /> Haftalik buyurtmalar</h3>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyOrders}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="kun" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} />
                    <RTooltip />
                    <Bar dataKey="soni" fill="#6366f1" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Applications quick panel */}
          <div className="bg-white border rounded-xl p-6 grid gap-8 md:grid-cols-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-green-600" /> Kurs arizalari</h4>
              <p className="text-2xl font-semibold text-gray-900">{stats?.application_stats.course_applications ?? '—'}</p>
              <p className="text-xs text-gray-500 mt-1">Kutilmoqda: {stats?.application_stats.pending_course_applications}</p>
              <Link href="/admin/courses" className="inline-block mt-3 text-xs text-green-600 hover:underline">Kurslarni boshqarish →</Link>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Factory className="w-4 h-4 text-emerald-600" /> Franshiza arizalari</h4>
              <p className="text-2xl font-semibold text-gray-900">{stats?.application_stats.franchise_applications ?? '—'}</p>
              <p className="text-xs text-gray-500 mt-1">Kutilmoqda: {stats?.application_stats.pending_franchise_applications}</p>
              <Link href="/admin/franchise" className="inline-block mt-3 text-xs text-green-600 hover:underline">Franshizalarni boshqarish →</Link>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-sky-600" /> Sistem axboroti</h4>
                <p className="text-xs text-gray-500">Ma&apos;lumotlar har 15 soniyada avtomatik yangilanadi. Qo&apos;lda yangilash tugmasi ham mavjud.</p>
                <p className="text-xs text-gray-400 mt-2">Generatsiya vaqti: {generatedAt || '—'}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/admin/users" className="text-[11px] px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">Foydalanuvchilar</Link>
                <Link href="/admin/products" className="text-[11px] px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">Mahsulotlar</Link>
                <Link href="/admin/orders" className="text-[11px] px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">Buyurtmalar</Link>
                <Link href="/admin/courses" className="text-[11px] px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">Kurslar</Link>
              </div>
            </div>
          </div>

          {error && <div className="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
