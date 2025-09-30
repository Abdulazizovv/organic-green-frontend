'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import DataTable, { Column } from '@/components/admin/DataTable';
import { adminAPI, AdminOrderListItem, AdminOrderDetail, Paginated, ListQuery } from '@/services/adminAPI';
import { AdminModal } from '@/components/admin/AdminModal';
import { Loader2, Sparkles, Activity, Clock, PackageCheck, FileDown, StickyNote } from 'lucide-react';
import html2canvas from 'html2canvas';

// Status metadata (Uzbek)
const STATUS_META: { key: string; label: string; color: string; desc: string }[] = [
  { key: 'pending', label: 'Kutilmoqda', color: 'bg-amber-500', desc: 'Yangi tushgan' },
  { key: 'processing', label: 'Jarayonda', color: 'bg-blue-500', desc: 'Tayyorlanmoqda' },
  { key: 'shipped', label: 'Jo\'natildi', color: 'bg-indigo-500', desc: 'Yo\'lda' },
  { key: 'delivered', label: 'Yetkazildi', color: 'bg-green-500', desc: 'Mijozga topshirildi' },
  { key: 'canceled', label: 'Bekor', color: 'bg-red-500', desc: 'Bekor qilingan' },
];

interface AnimatedNumberProps { value: number; }
const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value }) => {
  const ref = useRef<number>(value);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const start = ref.current;
    const end = value;
    if (start === end) return;
    const diff = end - start;
    const steps = 16; // ~250ms
    let current = 0;
    const id = setInterval(() => {
      current++;
      const next = Math.round(start + (diff * current) / steps);
      setDisplay(next);
      if (current >= steps) { clearInterval(id); ref.current = end; }
    }, 15);
    return () => clearInterval(id);
  }, [value]);
  return <span>{display}</span>;
};

// Memoized OrderCard extracted to top-level so unchanged cards don't re-render
const OrderCard: React.FC<{
  o: AdminOrderListItem;
  isNew: boolean;
  isChanged: boolean;
  isUpdating: boolean;
  isDownloading: boolean;
  onOpenDetail: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onDownloadReceipt: (id: string) => void | Promise<void>;
}> = ({ o, isNew, isChanged, isUpdating, isDownloading, onOpenDetail, onUpdateStatus, onDownloadReceipt }) => {
  return (
    <div
      onClick={(e) => { if ((e.target as HTMLElement).tagName === 'SELECT') return; onOpenDetail(o.id); }}
      className={`group relative rounded-xl border bg-white p-4 shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 overflow-hidden ${isNew ? 'new-order-glow' : ''} ${isChanged ? 'status-change-glow' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{o.order_number}</span>
          {isNew && <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />}
        </div>
        <div className="flex items-center gap-1">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium text-white shadow ${STATUS_META.find(s => s.key === o.status)?.color || 'bg-gray-500'}`}>
            {STATUS_META.find(s => s.key === o.status)?.label || o.status}
          </span>
          <select
            value={o.status}
            onChange={(e) => onUpdateStatus(o.id, e.target.value)}
            disabled={isUpdating}
            className="border rounded px-1 py-0.5 text-[10px] focus:outline-none focus:ring-2 focus:ring-green-500 bg-white disabled:opacity-50"
          >
            {STATUS_META.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <p className="text-sm font-medium truncate">{o.full_name}</p>
      <p className="text-[11px] text-gray-500 truncate mb-2">{o.user_email}</p>
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>{o.items_count} pozitsiya</span>
        <span className="font-semibold text-gray-800">{o.total_price}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
        <span>{new Date(o.created_at).toLocaleTimeString()}</span>
        <span className="opacity-0 group-hover:opacity-100 transition">Batafsil →</span>
      </div>
      <div className="mt-3">
        <button
          onClick={(e) => { e.stopPropagation(); onDownloadReceipt(o.id); }}
          disabled={isDownloading}
          className="inline-flex items-center gap-1 px-2 py-1 rounded border text-[11px] bg-white hover:bg-green-50 disabled:opacity-50"
        >
          {isDownloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <><FileDown className="w-3 h-3" /> Chek</>}
        </button>
      </div>
    </div>
  );
};
const MemoOrderCard = React.memo(
  OrderCard,
  (prev, next) => (
    prev.o === next.o &&
    prev.isNew === next.isNew &&
    prev.isChanged === next.isChanged &&
    prev.isUpdating === next.isUpdating &&
    prev.isDownloading === next.isDownloading
  )
);

export default function OrdersPage() {
  // Data state
  const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
  const [meta, setMeta] = useState({ page: 1, page_size: 20, total: 0 });
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(''); // '' means all

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDetail | null>(null);
  const selectedOrderRef = useRef<AdminOrderDetail | null>(null);
  useEffect(() => { selectedOrderRef.current = selectedOrder; }, [selectedOrder]);

  // Refs for refresh & new order detection
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const firstLoadRef = useRef(true);
  const prevIdsRef = useRef<Set<string>>(new Set());
  const prevStatusesRef = useRef<Map<string, string>>(new Map());
  const prevOrdersRef = useRef<AdminOrderListItem[]>([]);
  const lastUserUpdateRef = useRef<number>(0);
  const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set());
  // track status changes separately
  const [changedStatusIds, setChangedStatusIds] = useState<Set<string>>(new Set());
  const [updatingStatusIds, setUpdatingStatusIds] = useState<Set<string>>(new Set());
  const [downloadingReceiptIds, setDownloadingReceiptIds] = useState<Set<string>>(new Set());

  // Build params
  const buildParams = useCallback((): ListQuery => {
    const params: ListQuery = { page: meta.page, page_size: meta.page_size, search, ordering };
    if (statusFilter) params.status = statusFilter;
    return params;
  }, [meta.page, meta.page_size, search, ordering, statusFilter]);

  // Sound preference
  useEffect(() => {
    const pref = localStorage.getItem('og_admin_sound');
    if (pref === 'off') setSoundEnabled(false);
  }, []);

  const playBeep = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx: typeof AudioContext = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(940, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.5);
    } catch {}
  };

  // Fetch orders
  const isSameOrder = (a: AdminOrderListItem, b: AdminOrderListItem) => {
    if (!a || !b) return false;
    return (
      a.status === b.status &&
      a.total_price === b.total_price &&
      a.items_count === b.items_count &&
      a.updated_at === b.updated_at &&
      a.user_email === b.user_email &&
      a.full_name === b.full_name
    );
  };

  const fetchOrders = useCallback(() => {
    setLoading(true); setError(null);
    adminAPI.getOrders(buildParams())
      .then(r => {
        const data = r.data as Paginated<AdminOrderListItem>;
        const next = data.results;

        // If user just updated a status, avoid applying server list instantly (debounce)
        if (Date.now() - lastUserUpdateRef.current < 900) {
          setMeta(m => ({ ...m, total: data.count }));
          return; // skip UI update; next tick will catch up
        }

        const prev = prevOrdersRef.current;
        const prevMap = new Map(prev.map(o => [o.id, o]));

        const merged = next.map(n => {
          const p = prevMap.get(n.id);
          return p && isSameOrder(p, n) ? p : n;
        });

        // Detect diffs (adds/removes/changes)
        const prevIds = new Set(prev.map(o => o.id));
        const nextIds = new Set(next.map(o => o.id));
        const added: string[] = [];
        const removed: string[] = [];
        nextIds.forEach(id => { if (!prevIds.has(id)) added.push(id); });
        prevIds.forEach(id => { if (!nextIds.has(id)) removed.push(id); });
        const changed: string[] = [];
        next.forEach(n => { const p = prevMap.get(n.id); if (p && !isSameOrder(p, n)) changed.push(n.id); });

        const hasChanges = added.length || removed.length || changed.length;

        // Highlight and status-change tracking
        if (added.length && !firstLoadRef.current) {
          if (soundEnabled) playBeep();
          setHighlightIds(prevSet => new Set([...prevSet, ...added]));
          setTimeout(() => {
            setHighlightIds(h => { const clone = new Set(h); added.forEach(id => clone.delete(id)); return clone; });
          }, 4000);
        }
        if (changed.length) {
          setChangedStatusIds(prevSet => new Set([...prevSet, ...changed]));
          setTimeout(() => {
            setChangedStatusIds(h => { const clone = new Set(h); changed.forEach(id => clone.delete(id)); return clone; });
          }, 3000);
        }

        // Update refs for next cycle
        prevIdsRef.current = nextIds;
        const newStatusMap = new Map<string, string>();
        next.forEach(o => newStatusMap.set(o.id, o.status));
        prevStatusesRef.current = newStatusMap;
        firstLoadRef.current = false;

        setMeta(m => ({ ...m, total: data.count }));

        if (hasChanges) {
          prevOrdersRef.current = merged;
          setOrders(merged);
        }
        // else: no state update -> no re-render
      })
      .catch(e => setError(e?.message || 'Ma\'lumotni olishda xatolik'))
      .finally(() => setLoading(false));
  }, [buildParams, soundEnabled]);

  // Initial + dependency refetch
  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Auto refresh
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchOrders, 5000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoRefresh, fetchOrders]);

  // Helpers
  const handlePageChange = (page: number) => setMeta(m => ({ ...m, page }));
  const handlePageSizeChange = (page_size: number) => setMeta(m => ({ ...m, page_size, page: 1 }));
  const handleSortChange = (key: string, dir: 'asc' | 'desc' | undefined) => { if (!dir) setOrdering(''); else setOrdering(`${dir === 'desc' ? '-' : ''}${key}`); };

  const openDetail = useCallback((id: string) => {
    setDetailOpen(true); setDetailLoading(true); setSelectedOrder(null);
    adminAPI.getOrder(id)
      .then(r => setSelectedOrder(r.data))
      .catch(() => {})
      .finally(() => setDetailLoading(false));
  }, []);

  const updateStatus = useCallback(async (id: string, status: string) => {
    lastUserUpdateRef.current = Date.now();
    let original: AdminOrderListItem | null = null;
    setUpdatingStatusIds(s => new Set(s).add(id));
    setOrders(prev => {
      original = prev.find(o => o.id === id) || null;
      return prev.map(o => (o.id === id ? { ...o, status } : o));
    });
    const sel = selectedOrderRef.current;
    if (sel?.id === id) setSelectedOrder(o => (o ? { ...o, status } : o));
    try {
      await adminAPI.updateOrderStatus(id, status);
      setChangedStatusIds(prev => new Set([...prev, id]));
      setTimeout(() => {
        setChangedStatusIds(h => { const clone = new Set(h); clone.delete(id); return clone; });
      }, 3000);
    } catch {
      if (original) {
        setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: original!.status } : o)));
        if (selectedOrderRef.current?.id === id) setSelectedOrder(o => (o ? { ...o, status: original!.status } : o));
      }
    } finally {
      setUpdatingStatusIds(s => { const clone = new Set(s); clone.delete(id); return clone; });
    }
  }, []);

  const downloadReceipt = useCallback(async (id: string) => {
    if (typeof window === 'undefined') return;
    setDownloadingReceiptIds(s => new Set(s).add(id));
    try {
      let detail: AdminOrderDetail | null = null;
      const sel = selectedOrderRef.current;
      if (sel && sel.id === id && sel.items?.length) {
        detail = sel;
      } else {
        const r = await adminAPI.getOrder(id);
        detail = r.data as AdminOrderDetail;
      }
      if (!detail) throw new Error('Ma\'lumot topilmadi');
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-10000px';
      container.style.top = '0';
      container.style.width = '640px';
      container.style.padding = '24px';
      container.style.background = '#ffffff';
      container.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial';
      container.style.color = '#111827';
      container.style.fontSize = '12px';
      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
          <div>
            <h1 style="margin:0; font-size:18px; font-weight:700; color:#047857;">Organic Green</h1>
            <p style="margin:4px 0 0; font-size:11px; color:#6b7280;">Rasmiy buyurtma cheki</p>
          </div>
          <div style="text-align:right; font-size:11px; color:#374151;">
            <div><strong>Chek №:</strong> ${detail.order_number}</div>
            <div><strong>Sana:</strong> ${new Date(detail.created_at || Date.now()).toLocaleString()}</div>
            <div><strong>Holat:</strong> ${detail.status}</div>
          </div>
        </div>
        <hr style="border:none; border-top:1px solid #e5e7eb; margin:0 0 12px" />
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
          <div>
            <div style="font-weight:600; font-size:11px; text-transform:uppercase; color:#6b7280; margin-bottom:4px;">Mijoz</div>
            <div style="font-size:13px; font-weight:600;">${detail.full_name}</div>
            <div style="color:#6b7280; word-break:break-all;">${detail.user_email}</div>
            <div style="margin-top:6px; font-size:11px;"><strong>Telefon:</strong> ${detail.contact_phone || '-'}</div>
            <div style="margin-top:4px; font-size:11px;"><strong>To'lov:</strong> ${detail.payment_method || '-'}</div>
          </div>
          <div>
            <div style="font-weight:600; font-size:11px; text-transform:uppercase; color:#6b7280; margin-bottom:4px;">Manzil</div>
            <div style="white-space:pre-wrap; line-height:1.3; font-size:11px;">${(detail.delivery_address || '').replace(/\n/g,'<br/>')}</div>
          </div>
        </div>
        ${detail.notes ? `<div style="margin:8px 0 12px; font-size:11px;"><strong>Eslatmalar:</strong><br/>${Array.isArray(detail.notes) ? detail.notes.map(n=>`<div style='margin-top:2px;'>- ${n}</div>`).join('') : detail.notes}</div>` : ''}
        <table style="width:100%; border-collapse:collapse; font-size:11px; margin-bottom:12px;">
          <thead>
            <tr style="background:#f0fdf4;">
              <th style="text-align:left; padding:6px 8px; border:1px solid #d1d5db; font-weight:600;">Mahsulot</th>
              <th style="text-align:center; padding:6px 8px; border:1px solid #d1d5db; font-weight:600; width:60px;">Soni</th>
              <th style="text-align:right; padding:6px 8px; border:1px solid #d1d5db; font-weight:600; width:80px;">Narx</th>
              <th style="text-align:right; padding:6px 8px; border:1px solid #d1d5db; font-weight:600; width:90px;">Jami</th>
            </tr>
          </thead>
          <tbody>
            ${detail.items.map(it => `
              <tr>
                <td style="padding:6px 8px; border:1px solid #e5e7eb;">
                  <div style="font-weight:600; font-size:11px;">${it.product_name}</div>
                  <div style="color:#6b7280; font-size:10px;">ID: ${it.product}</div>
                </td>
                <td style="padding:6px 8px; border:1px solid #e5e7eb; text-align:center;">${it.quantity}</td>
                <td style="padding:6px 8px; border:1px solid #e5e7eb; text-align:right;">${it.unit_price}</td>
                <td style="padding:6px 8px; border:1px solid #e5e7eb; text-align:right; font-weight:600;">${it.total_price}</td>
              </tr>`).join('')}
          </tbody>
        </table>
        <div style="display:flex; justify-content:flex-end; margin-top:4px;">
          <table style="border-collapse:collapse; font-size:12px; min-width:240px;">
            <tbody>
              <tr>
                <td style="padding:4px 8px; text-align:right; color:#374151;">Pozitsiyalar:</td>
                <td style="padding:4px 8px; text-align:right; font-weight:600;">${detail.items.length} ta</td>
              </tr>
              <tr>
                <td style="padding:4px 8px; text-align:right; color:#374151;">Umumiy summa:</td>
                <td style="padding:4px 8px; text-align:right; font-weight:700; font-size:14px; color:#065f46;">${detail.total_price}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="margin-top:20px; font-size:10px; color:#6b7280; text-align:center;">Rahmat! Organic Green xizmatidan foydalanganingiz uchun.</div>
      `;
      document.body.appendChild(container);
      const canvas = await html2canvas(container, { scale: 2, backgroundColor: '#ffffff' });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `receipt_${detail.order_number}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      document.body.removeChild(container);
    } catch {
      // silent fail
    } finally {
      setDownloadingReceiptIds(s => { const clone = new Set(s); clone.delete(id); return clone; });
    }
  }, []);

  // Derived stats (restored)
  const counts = STATUS_META.reduce<Record<string, number>>((acc, s) => { acc[s.key] = orders.filter(o => o.status === s.key).length; return acc; }, {});
  const total = orders.length;
  const pendingPct = total ? Math.round((counts['pending'] / total) * 100) : 0;

  // Columns (table view)
  const columns: Column<AdminOrderListItem>[] = [
    { key: 'order_number', header: '№', sortable: true, render: o => (
      <button onClick={(e) => { e.stopPropagation(); openDetail(o.id); }} className="font-medium text-green-700 hover:underline flex items-center gap-1">
        {o.order_number}
        {highlightIds.has(o.id) && <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />}
      </button>
    ) },
    { key: 'full_name', header: 'Mijoz', render: o => (
      <div className="max-w-[160px] truncate">
        <p className="text-sm font-medium leading-tight truncate">{o.full_name}</p>
        <p className="text-[11px] text-gray-500 truncate">{o.user_email}</p>
      </div>
    ) },
    { key: 'total_price', header: 'Summasi', sortable: true },
    { key: 'items_count', header: 'Soni', sortable: true },
    { key: 'status', header: 'Holat', sortable: true, render: o => (
      <div className={`flex items-center gap-2 ${changedStatusIds.has(o.id) ? 'status-change-glow rounded-md px-1' : ''}`}>
        {(() => { const meta = STATUS_META.find(s => s.key === o.status); const label = meta?.label || o.status; return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium text-white shadow ${meta?.color || 'bg-gray-500'}`}>{label}</span>; })()}
        <div className="relative">
          <select
            value={o.status}
            onChange={(e) => updateStatus(o.id, e.target.value)}
            disabled={updatingStatusIds.has(o.id)}
            className="border rounded px-1 py-0.5 text-[11px] focus:outline-none focus:ring-2 focus:ring-green-500 bg-white disabled:opacity-50"
          >
            {STATUS_META.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          {updatingStatusIds.has(o.id) && <Loader2 className="w-3 h-3 animate-spin absolute -right-4 top-1/2 -translate-y-1/2 text-gray-400" />}
        </div>
      </div>
    ) },
    { key: 'created_at', header: 'Vaqt', sortable: true, render: o => <span className="text-xs text-gray-600">{new Date(o.created_at).toLocaleTimeString()}</span> },
    { key: 'actions', header: 'Chek', render: o => (
      <button
        onClick={(e) => { e.stopPropagation(); downloadReceipt(o.id); }}
        disabled={downloadingReceiptIds.has(o.id)}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] bg-white hover:bg-green-50 disabled:opacity-50"
      >
        {downloadingReceiptIds.has(o.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <><FileDown className="w-3 h-3" /> Chek</>}
      </button>
    ) },
  ];

  return (
    <AdminGuard>
      <AdminLayout title="Buyurtmalar" description="Mijoz buyurtmalarini boshqarish va monitoring">
        <div className="space-y-6">
          {/* Settings toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setMeta(m => ({ ...m, page: 1 })); }}
                placeholder="Qidirish..."
                className="h-9 w-48 sm:w-64 rounded-md border px-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setMeta(m => ({ ...m, page: 1 })); }}
                className="h-9 rounded-md border px-2 text-sm bg-white"
              >
                <option value="">Barchasi</option>
                {STATUS_META.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => fetchOrders()} className="h-9 px-3 rounded-md border text-sm bg-white hover:bg-green-50">Yangilash</button>
              <button
                onClick={() => setAutoRefresh(v => !v)}
                className={`h-9 px-3 rounded-md border text-sm ${autoRefresh ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:bg-green-50'}`}
              >
                {autoRefresh ? 'Auto ON' : 'Auto OFF'}
              </button>
              <button
                onClick={() => setSoundEnabled(prev => { const next = !prev; try { localStorage.setItem('og_admin_sound', next ? 'on' : 'off'); } catch {} return next; })}
                className={`h-9 px-3 rounded-md border text-sm ${soundEnabled ? 'bg-amber-500 text-white border-amber-500' : 'bg-white hover:bg-yellow-50'}`}
              >
                {soundEnabled ? 'Sound ON' : 'Sound OFF'}
              </button>
            </div>
          </div>

          {/* Stats overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-green-600 to-emerald-500 text-white shadow">
              <div className="flex items-center justify-between mb-2"><span className="text-xs uppercase tracking-wide opacity-80">Jami buyurtmalar</span><Activity className="w-4 h-4 opacity-80" /></div>
              <div className="text-2xl font-semibold"><AnimatedNumber value={total} /></div>
              <div className="mt-1 text-[11px] opacity-75 flex items-center gap-1"><Clock className="w-3 h-3" /> Avto: {autoRefresh ? 'ON' : 'OFF'}</div>
            </div>
            <div className="relative overflow-hidden rounded-xl p-4 bg-white border shadow-sm">
              <div className="flex items-center justify-between mb-2"><span className="text-xs uppercase tracking-wide text-gray-500">Kutilmoqda (%)</span><Sparkles className="w-4 h-4 text-amber-500" /></div>
              <div className="text-2xl font-semibold text-gray-900">{pendingPct}%</div>
              <div className="mt-2 h-2 rounded bg-gray-100 overflow-hidden"><div className="h-full bg-amber-400 transition-all" style={{ width: `${pendingPct}%` }} /></div>
            </div>
            <div className="relative overflow-hidden rounded-xl p-4 bg-white border shadow-sm">
              <div className="flex items-center justify-between mb-2"><span className="text-xs uppercase tracking-wide text-gray-500">Faol jarayon</span><PackageCheck className="w-4 h-4 text-blue-500" /></div>
              <div className="text-2xl font-semibold text-gray-900"><AnimatedNumber value={counts['processing'] + counts['shipped']} /></div>
              <p className="text-[11px] text-gray-500 mt-1">Jarayonda + Yo&apos;lda</p>
            </div>
            <div className="relative overflow-hidden rounded-xl p-4 bg-white border shadow-sm">
              <div className="flex items-center justify-between mb-2"><span className="text-xs uppercase tracking-wide text-gray-500">Yetkazilgan</span><PackageCheck className="w-4 h-4 text-green-500" /></div>
              <div className="text-2xl font-semibold text-gray-900"><AnimatedNumber value={counts['delivered'] || 0} /></div>
              <p className="text-[11px] text-gray-500 mt-1">Muvaffaqiyatli yakun</p>
            </div>
          </div>

          {error && <div className="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700 animate-shake">{error}</div>}

          {/* Table (desktop) */}
          <div className="hidden lg:block overflow-x-auto border rounded-lg bg-white">
            <DataTable
              columns={columns}
              rows={orders}
              loading={loading}
              meta={{ page: meta.page, page_size: meta.page_size, total: meta.total }}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              sortKey={ordering.replace(/^-/, '') || undefined}
              sortDir={ordering.startsWith('-') ? 'desc' : ordering ? 'asc' : undefined}
              onSortChange={handleSortChange}
              searchable={false}
              emptyText={loading ? 'Yuklanmoqda...' : 'Buyurtmalar topilmadi'}
              ariaLabel="Orders table"
            />
          </div>

          {/* Cards (mobile/tablet) */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:hidden">
            {orders.map((o) => (
              <MemoOrderCard
                key={o.id}
                o={o}
                isNew={highlightIds.has(o.id)}
                isChanged={changedStatusIds.has(o.id)}
                isUpdating={updatingStatusIds.has(o.id)}
                isDownloading={downloadingReceiptIds.has(o.id)}
                onOpenDetail={openDetail}
                onUpdateStatus={updateStatus}
                onDownloadReceipt={downloadReceipt}
              />
            ))}
            {!loading && orders.length === 0 && (
              <div className="col-span-full text-center py-16 text-sm text-gray-500">Buyurtmalar topilmadi</div>
            )}
            {loading && (
              <div className="col-span-full flex items-center justify-center py-10 text-sm text-gray-500"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Yuklanmoqda...</div>
            )}
          </div>
        </div>

        {/* DETAIL MODAL */}
        <AdminModal
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          title={selectedOrder ? `Buyurtma ${selectedOrder.order_number}` : 'Yuklanmoqda...'}
          size="lg"
          footer={selectedOrder && (<div className="text-sm text-gray-700 w-full flex justify-between"><span>Pozitsiyalar: {selectedOrder.items.length}</span><span>Umumiy: {selectedOrder.total_price}</span></div>)}
        >
          {detailLoading && <div className="flex items-center gap-2 text-sm text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /> Yuklanmoqda...</div>}
          {!detailLoading && selectedOrder && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex justify-end">
                <button
                  onClick={() => downloadReceipt(selectedOrder.id)}
                  disabled={downloadingReceiptIds.has(selectedOrder.id)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-xs bg-white hover:bg-green-50 disabled:opacity-50"
                >
                  {downloadingReceiptIds.has(selectedOrder.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <><FileDown className="w-4 h-4" /> Chek yuklab olish</>}
                </button>
              </div>
              {/* Meta */}
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-gray-500">Mijoz</p>
                  <p className="font-semibold">{selectedOrder.full_name}</p>
                  <p className="text-xs text-gray-500 break-all">{selectedOrder.user_email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-gray-500">Holat</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(() => { const meta = STATUS_META.find(s => s.key === selectedOrder.status); const label = meta?.label || selectedOrder.status; return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium text-white shadow ${meta?.color || 'bg-gray-500'}`}>{label}</span>; })()}
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                      disabled={updatingStatusIds.has(selectedOrder.id)}
                      className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 bg-white disabled:opacity-50"
                    >
                      {STATUS_META.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                    {updatingStatusIds.has(selectedOrder.id) && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-gray-500">Telefon</p>
                  <p>{selectedOrder.contact_phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-gray-500">To&apos;lov</p>
                  <p>{selectedOrder.payment_method}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-xs font-medium uppercase text-gray-500">Manzil</p>
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{selectedOrder.delivery_address}</p>
                </div>
                {selectedOrder.notes && (
                  <div className="space-y-2 md:col-span-3">
                    <p className="flex items-center gap-2 text-xs font-medium uppercase text-gray-500"><StickyNote className="w-4 h-4" /> Eslatmalar</p>
                    {Array.isArray(selectedOrder.notes) ? (
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {selectedOrder.notes.map((n, i) => <li key={i} className="text-gray-700">{n}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedOrder.notes}</p>
                    )}
                  </div>
                )}
              </div>
              {/* Items */}
              <div>
                <h3 className="font-semibold mb-4 text-sm flex items-center justify-between">Tarkibi <span className="text-xs font-normal text-gray-500">{selectedOrder.items.length} ta</span></h3>
                <div className="border rounded-md divide-y bg-white">
                  {selectedOrder.items.map(it => (
                    <div key={it.id} className="p-3 grid grid-cols-12 gap-2 text-sm hover:bg-gray-50 transition">
                      <div className="col-span-6">
                        <p className="font-medium">{it.product_name}</p>
                        <p className="text-[11px] text-gray-500">ID: {it.product}</p>
                      </div>
                      <div className="col-span-2 flex flex-col justify-center text-center">
                        <span className="text-[11px] text-gray-500">Soni</span>
                        <span className="font-semibold">{it.quantity}</span>
                      </div>
                      <div className="col-span-2 flex flex-col justify-center text-center">
                        <span className="text-[11px] text-gray-500">Narx</span>
                        <span>{it.unit_price}</span>
                      </div>
                      <div className="col-span-2 flex flex-col justify-center text-right">
                        <span className="text-[11px] text-gray-500">Jami</span>
                        <span className="font-semibold">{it.total_price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </AdminModal>

        {/* Inline styles for animations */}
        <style jsx>{`
          @keyframes fadeSlide { 0% {opacity:0; transform: translateY(8px);} 100% {opacity:1; transform: translateY(0);} }
          @keyframes pulseNew { 0% {box-shadow:0 0 0 0 rgba(251,191,36,0.6);} 70% {box-shadow:0 0 0 12px rgba(251,191,36,0);} 100% {box-shadow:0 0 0 0 rgba(251,191,36,0);} }
          @keyframes pulseStatus { 0% {box-shadow:0 0 0 0 rgba(59,130,246,0.55);} 70% {box-shadow:0 0 0 10px rgba(59,130,246,0);} 100% {box-shadow:0 0 0 0 rgba(59,130,246,0);} }
          .new-order-glow { animation: pulseNew 1.6s ease-in-out 0s 2; }
          .status-change-glow { animation: pulseStatus 1.4s ease-in-out 0s 2; }
          .animate-fade-in { animation: fadeSlide .4s ease; }
          .animate-shake { animation: shake .4s ease; }
          @keyframes shake { 0%,100% {transform:translateX(0);} 25% {transform:translateX(-3px);} 50% {transform:translateX(3px);} 75% {transform:translateX(-2px);} }
        `}</style>
      </AdminLayout>
    </AdminGuard>
  );
}
