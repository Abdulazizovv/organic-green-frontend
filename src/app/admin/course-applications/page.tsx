'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminAPI } from '@/services/adminAPI';
import { Loader2, Search, RefreshCw, CheckCircle2, Clock, X, ArrowUpDown } from 'lucide-react';
import { AdminModal } from '@/components/admin/AdminModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useToast } from '@/context/ToastContext';

interface CourseApplication {
  id: string;
  application_number: string;
  full_name: string;
  email: string;
  phone_number: string;
  course_name: string;
  message: string;
  processed: boolean;
  status_display?: string;
  created_at: string;
  created_at_formatted?: string;
  updated_at: string;
  application_age?: number;
}

export default function CourseApplicationsPage() {
  const { showError, showSuccess } = useToast();
  const [items, setItems] = useState<CourseApplication[]>([]);
  const [meta, setMeta] = useState({ page: 1, page_size: 20, total: 0 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const searchRef = useRef<NodeJS.Timeout | null>(null);
  const [ordering, setOrdering] = useState('');
  const [filterProcessed, setFilterProcessed] = useState<boolean | undefined>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<CourseApplication | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CourseApplication | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean> = { page: meta.page, page_size: meta.page_size };
      if (search.trim()) params.search = search.trim();
      if (ordering) params.ordering = ordering;
      if (filterProcessed !== undefined) params.processed = filterProcessed;
      const { data } = await adminAPI.getCourseApplications(params);
      setItems(data.results as CourseApplication[]);
      setMeta(m => ({ ...m, total: data.count }));
    } catch (e: unknown) {
      let msg = 'Yuklashda xatolik';
      if (e && typeof e === 'object' && 'message' in e && typeof (e as { message?: unknown }).message === 'string') {
        msg = (e as { message: string }).message;
      }
      showError(msg);
    } finally { setLoading(false); }
  }, [meta.page, meta.page_size, search, ordering, filterProcessed, showError]);

  // Initial + dependency fetch
  useEffect(() => { fetchItems(); }, [fetchItems]);

  // Debounced search -> only resets page then fetch
  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => { setMeta(m => ({ ...m, page: 1 })); }, 500);
    return () => { if (searchRef.current) clearTimeout(searchRef.current); };
  }, [search]);

  // When page changes due to debounced search reset, refetch
  useEffect(() => { fetchItems(); }, [meta.page, meta.page_size, fetchItems]);

  const toggleOrdering = (key: string) => {
    setMeta(m => ({ ...m, page: 1 }));
    setOrdering(o => { if (!o || !o.endsWith(key)) return key; if (!o.startsWith('-')) return '-' + key; return ''; });
  };

  const openDetail = async (id: string) => {
    try {
      const { data } = await adminAPI.getCourseApplication(id);
      setDetail(data as CourseApplication);
      setDetailOpen(true);
    } catch {
      showError('Tafsilotlarni yuklab bo\'lmadi');
    }
  };

  const toggleProcessed = async (item: CourseApplication) => {
    const optimistic = items.map(i => i.id === item.id ? { ...i, processed: !i.processed } : i);
    setItems(optimistic);
    try {
      await adminAPI.updateCourseApplication(item.id, { processed: !item.processed });
      showSuccess('Holat yangilandi');
    } catch {
      showError('Holatni yangilab bo\'lmadi');
      fetchItems();
    }
  };

  const stats = {
    total: meta.total,
    processed: items.filter(i => i.processed).length,
    pending: items.filter(i => !i.processed).length
  };

  return (
    <AdminGuard>
      <AdminLayout title="Kurs arizalari" description="Kurslarga yuborilgan arizalarni boshqarish">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-5 md:grid-cols-3 sm:grid-cols-2">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow"><div className="text-xs uppercase tracking-wide opacity-80 mb-1">Jami</div><p className="text-2xl font-semibold">{stats.total}</p><p className="text-[11px] opacity-70">Arizalar</p></div>
            <div className="p-4 rounded-lg bg-white border shadow-sm"><div className="flex items-center justify-between mb-1"><span className="text-xs uppercase tracking-wide text-gray-500">Qabul qilingan</span><CheckCircle2 className="w-4 h-4 text-green-500" /></div><p className="text-2xl font-semibold text-gray-800">{stats.processed}</p><p className="text-[11px] text-gray-500">Processed</p></div>
            <div className="p-4 rounded-lg bg-white border shadow-sm"><div className="flex items-center justify-between mb-1"><span className="text-xs uppercase tracking-wide text-gray-500">Kutilmoqda</span><Clock className="w-4 h-4 text-amber-500" /></div><p className="text-2xl font-semibold text-gray-800">{stats.pending}</p><p className="text-[11px] text-gray-500">Pending</p></div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Qidirish..." className="pl-7 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 bg-white" />
                {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
              </div>
              <button onClick={() => { setFilterProcessed(p => p === true ? undefined : true); setMeta(m => ({ ...m, page: 1 })); }} className={`inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium ${filterProcessed ? 'bg-green-600 border-green-600 text-white' : 'bg-white hover:bg-gray-50'}`}>Processed</button>
              <button onClick={() => { setFilterProcessed(p => p === false ? undefined : false); setMeta(m => ({ ...m, page: 1 })); }} className={`inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium ${filterProcessed === false ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white hover:bg-gray-50'}`}>Pending</button>
              <button onClick={() => { setOrdering('-created_at'); setMeta(m => ({ ...m, page: 1 })); }} className="inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium bg-white hover:bg-gray-50"><ArrowUpDown className="w-3 h-3" /> Yangi</button>
              <button onClick={() => fetchItems()} className="inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium bg-white hover:bg-gray-50"><RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Yangilash</button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border rounded-lg bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => toggleOrdering('application_number')}>#</th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => toggleOrdering('full_name')}>F.I.O</th>
                  <th className="px-4 py-2 text-left">Kurs</th>
                  <th className="px-4 py-2 text-left">Holat</th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => toggleOrdering('created_at')}>Vaqt</th>
                  <th className="px-4 py-2 text-left">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={6} className="px-4 py-16 text-center text-gray-500 text-sm"><Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />Yuklanmoqda...</td></tr>}
                {!loading && items.map(i => (
                  <tr key={i.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-xs font-mono underline cursor-pointer" onClick={() => openDetail(i.id)}>{i.application_number}</td>
                    <td className="px-4 py-2 text-gray-700 text-sm">{i.full_name}</td>
                    <td className="px-4 py-2 text-xs text-gray-600">{i.course_name}</td>
                    <td className="px-4 py-2 text-xs">
                      <button onClick={() => toggleProcessed(i)} className={`px-2 py-0.5 rounded ${i.processed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{i.processed ? 'Processed' : 'Pending'}</button>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-500">{new Date(i.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2 text-xs">
                      <div className="flex gap-2">
                        <button onClick={() => openDetail(i.id)} className="px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Ko&apos;rish</button>
                        <button onClick={() => { setDeleteTarget(i); setConfirmOpen(true); }} className="px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">O&apos;chirish</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && <tr><td colSpan={6} className="px-4 py-16 text-center text-gray-500 text-sm">Arizalar yo&apos;q</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-4 text-sm">
            <div>Jami: {meta.total}</div>
            <div className="flex items-center gap-2">
              <select value={meta.page_size} onChange={e => { setMeta(m => ({ ...m, page_size: Number(e.target.value), page: 1 })); }} className="border rounded px-2 py-1 text-sm">{[20,50,100].map(s => <option key={s} value={s}>{s}</option>)}</select>
              <div className="flex items-center gap-1">
                <button disabled={meta.page<=1} onClick={() => setMeta(m => ({ ...m, page: 1 }))} className="px-2 py-1 border rounded disabled:opacity-40">«</button>
                <button disabled={meta.page<=1} onClick={() => setMeta(m => ({ ...m, page: m.page-1 }))} className="px-2 py-1 border rounded disabled:opacity-40">‹</button>
                <span className="px-2">{meta.page}</span>
                <button disabled={meta.page>=Math.ceil(meta.total/meta.page_size)} onClick={() => setMeta(m => ({ ...m, page: m.page+1 }))} className="px-2 py-1 border rounded disabled:opacity-40">›</button>
                <button disabled={meta.page>=Math.ceil(meta.total/meta.page_size)} onClick={() => setMeta(m => ({ ...m, page: Math.ceil(meta.total/meta.page_size) }))} className="px-2 py-1 border rounded disabled:opacity-40">»</button>
              </div>
            </div>
          </div>

          {/* Detail Modal */}
          <AdminModal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title={detail?.application_number || 'Ariza'} size="lg" footer={<div className="flex justify-end"><button onClick={() => setDetailOpen(false)} className="px-4 py-2 rounded bg-gray-100 text-gray-600 text-sm hover:bg-gray-200">Yopish</button></div>}>
            {!detail && <div className="py-10 text-center text-sm text-gray-500">Yuklanmoqda...</div>}
            {detail && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 text-[11px] uppercase tracking-wide mb-1">Ariza</div>
                    <p><span className="text-gray-600">F.I.O:</span> {detail.full_name}</p>
                    <p><span className="text-gray-600">Email:</span> {detail.email}</p>
                    <p><span className="text-gray-600">Telefon:</span> {detail.phone_number}</p>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[11px] uppercase tracking-wide mb-1">Holat</div>
                    <p>Processed: {detail.processed ? 'Ha' : 'Yo\'q'}</p>
                    <p>Yaratildi: {new Date(detail.created_at).toLocaleString()}</p>
                    <p>Yangilandi: {new Date(detail.updated_at).toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-[11px] uppercase tracking-wide mb-2">Xabar</div>
                  <div className="p-3 rounded border bg-gray-50 text-xs whitespace-pre-wrap min-h-[60px]">{detail.message || 'Xabar yo\'q'}</div>
                </div>
              </div>
            )}
          </AdminModal>

          <ConfirmDialog open={confirmOpen} title="Arizani o'chirish" description={`"${deleteTarget?.application_number}" o'chirilsinmi? Qaytarib bo'lmaydi.`} confirmLabel="O'chirish" cancelLabel="Bekor" onConfirm={() => { /* backend delete endpoint yo'q hali */ setConfirmOpen(false); setDeleteTarget(null); }} onCancel={() => { setConfirmOpen(false); setDeleteTarget(null); }} loading={false} variant="danger" />
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
