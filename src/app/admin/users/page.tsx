'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { adminAPI, AdminUser, AdminUserDetail, UpdateUserPayload, Paginated } from '@/services/adminAPI';
import { AdminModal } from '@/components/admin/AdminModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { FormInput } from '@/components/admin/FormControls';
import { Loader2, Search, RefreshCw, Shield, Users, UserCheck2, Crown, Activity, X, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface ActivityStats { active_today: number; active_week: number; active_month: number; total_users: number; verified_users: number; staff_users: number; }

type OrderingKey = 'username' | 'email' | 'date_joined' | 'last_login';
interface StateMeta { page: number; page_size: number; total: number; }

const pageSizes = [20, 50, 100];

export default function UsersPage() {
  const { showError, showSuccess } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<StateMeta>({ page: 1, page_size: 20, total: 0 });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [search, setSearch] = useState('');
  const searchRef = useRef<NodeJS.Timeout | null>(null);
  const [ordering, setOrdering] = useState<string>('');
  const [filterActive, setFilterActive] = useState<boolean | undefined>();
  const [filterStaff, setFilterStaff] = useState<boolean | undefined>();
  const [filterSuper, setFilterSuper] = useState<boolean | undefined>();
  const [filterVerified, setFilterVerified] = useState<boolean | undefined>();

  const [activity, setActivity] = useState<ActivityStats | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<AdminUserDetail | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUserDetail | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const buildParams = useCallback(() => {
    const params: Record<string, string | number | boolean> = { page: meta.page, page_size: meta.page_size };
    if (search.trim()) params.search = search.trim();
    if (ordering) params.ordering = ordering;
    if (filterActive !== undefined) params.is_active = filterActive;
    if (filterStaff !== undefined) params.is_staff = filterStaff;
    if (filterSuper !== undefined) params.is_superuser = filterSuper;
    if (filterVerified !== undefined) params.is_verified = filterVerified;
    return params;
  }, [meta.page, meta.page_size, search, ordering, filterActive, filterStaff, filterSuper, filterVerified]);

  const fetchUsers = useCallback(() => {
    setLoading(true); setError(null);
    const params = buildParams();
    console.log('[Users] Fetch params:', params);
    adminAPI.getUsers(params)
      .then(r => { const data = r.data as Paginated<AdminUser>; setUsers(data.results); setMeta(m => ({ ...m, total: data.count })); })
      .catch(e => { console.error('[Users] Load error:', e); setError(e?.message || 'Yuklashda xatolik'); })
      .finally(() => setLoading(false));
  }, [buildParams]);

  const fetchActivity = useCallback(() => {
    adminAPI.getUserActivity()
      .then(r => setActivity(r.data as ActivityStats))
      .catch(() => {/* ignore */});
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { fetchActivity(); }, [fetchActivity]);

  // Debounced search effect
  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => { setMeta(m => ({ ...m, page: 1 })); fetchUsers(); }, 500);
    return () => { if (searchRef.current) clearTimeout(searchRef.current); };
  }, [search]);

  const toggleOrdering = (key: OrderingKey) => {
    setMeta(m => ({ ...m, page: 1 }));
    setOrdering(o => {
      if (!o || !o.endsWith(key)) return key; // asc
      if (!o.startsWith('-')) return '-' + key; // desc
      return ''; // clear
    });
  };

  const openDetail = async (u: AdminUser) => {
    try {
      const r = await adminAPI.getUser(u.id);
      setDetailUser(r.data);
      setDetailOpen(true);
    } catch { showError('Tafsilotlarni yuklashda xatolik'); }
  };

  const openEdit = async (u: AdminUser) => {
    try { const r = await adminAPI.getUser(u.id); setEditUser(r.data); setEditOpen(true); } catch { showError('Tahrirlash ma\'lumotini yuklab bo\'lmadi'); }
  };

  const closeEdit = () => { setEditOpen(false); setEditUser(null); };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editUser) return;
    try {
      setSaving(true);
      const payload: UpdateUserPayload = {
        first_name: editUser.first_name,
        last_name: editUser.last_name,
        email: editUser.email,
        is_active: editUser.is_active,
        is_staff: editUser.is_staff,
        is_superuser: editUser.is_superuser,
      };
      await adminAPI.updateUser(editUser.id, payload);
      showSuccess('Foydalanuvchi yangilandi');
      closeEdit(); fetchUsers(); fetchActivity();
    } catch (err) {
      console.error('[User Update] Error:', err);
      showError('Yangilashda xatolik');
    } finally { setSaving(false); }
  };

  const requestDelete = (u: AdminUser) => { setDeleteTarget(u); setConfirmDeleteOpen(true); };
  const confirmDelete = async () => { if (!deleteTarget) return; try { setSaving(true); await adminAPI.deleteUser(deleteTarget.id); showSuccess('Foydalanuvchi o\'chirildi'); setConfirmDeleteOpen(false); setDeleteTarget(null); fetchUsers(); fetchActivity(); } catch { showError('O\'chirishda xatolik'); } finally { setSaving(false); } };

  const toggleFlag = async (u: AdminUser, field: 'is_active' | 'is_staff' | 'is_superuser') => {
    const optimistic = users.map(x => x.id === u.id ? { ...x, [field]: !x[field] } : x);
    setUsers(optimistic);
    try { await adminAPI.updateUser(u.id, { [field]: !u[field] }); fetchActivity(); } catch { showError('O\'zgartirib bo\'lmadi'); fetchUsers(); }
  };

  const stats = useMemo(() => {
    return {
      total: activity?.total_users ?? meta.total,
      active: users.filter(u => u.is_active).length,
      staff: users.filter(u => u.is_staff).length,
      superusers: users.filter(u => u.is_superuser).length,
      verified: users.filter(u => (u as AdminUser & { is_verified?: boolean }).is_verified).length,
    };
  }, [users, activity, meta.total]);

  return (
    <AdminGuard>
      <AdminLayout title="Foydalanuvchilar" description="Foydalanuvchilarni boshqarish va monitoring">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-5 md:grid-cols-5 sm:grid-cols-2">
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-600 to-emerald-500 text-white shadow">
              <div className="flex items-center justify-between mb-1"><span className="text-xs uppercase tracking-wide opacity-80">Jami</span><Users className="w-4 h-4 opacity-70" /></div>
              <p className="text-2xl font-semibold">{stats.total}</p><p className="text-[11px] opacity-70">Foydalanuvchi</p>
            </div>
            <div className="p-4 rounded-lg bg-white border shadow-sm">
              <div className="flex items-center justify-between mb-1"><span className="text-xs uppercase tracking-wide text-gray-500">Faol</span><Activity className="w-4 h-4 text-green-500" /></div>
              <p className="text-2xl font-semibold text-gray-800">{activity?.active_today ?? stats.active}</p><p className="text-[11px] text-gray-500">Bugun faol</p>
            </div>
            <div className="p-4 rounded-lg bg-white border shadow-sm">
              <div className="flex items-center justify-between mb-1"><span className="text-xs uppercase tracking-wide text-gray-500">Staff</span><Shield className="w-4 h-4 text-amber-500" /></div>
              <p className="text-2xl font-semibold text-gray-800">{activity?.staff_users ?? stats.staff}</p><p className="text-[11px] text-gray-500">Adminlar</p>
            </div>
            <div className="p-4 rounded-lg bg-white border shadow-sm">
              <div className="flex items-center justify-between mb-1"><span className="text-xs uppercase tracking-wide text-gray-500">Superuser</span><Crown className="w-4 h-4 text-purple-500" /></div>
              <p className="text-2xl font-semibold text-gray-800">{stats.superusers}</p><p className="text-[11px] text-gray-500">Superusers</p>
            </div>
            <div className="p-4 rounded-lg bg-white border shadow-sm">
              <div className="flex items-center justify-between mb-1"><span className="text-xs uppercase tracking-wide text-gray-500">Tasdiqlangan</span><UserCheck2 className="w-4 h-4 text-blue-500" /></div>
              <p className="text-2xl font-semibold text-gray-800">{stats.verified}</p><p className="text-[11px] text-gray-500">Verified</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Qidirish..." className="pl-7 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-56 bg-white" />
                {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
              </div>
              <button onClick={() => { setFilterActive(p => p === true ? undefined : true); setMeta(m => ({ ...m, page: 1 })); fetchUsers(); }} className={`inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium ${filterActive ? 'bg-green-600 border-green-600 text-white' : 'bg-white hover:bg-gray-50'}`}>Faol</button>
              <button onClick={() => { setFilterActive(p => p === false ? undefined : false); setMeta(m => ({ ...m, page: 1 })); fetchUsers(); }} className={`inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium ${filterActive === false ? 'bg-gray-700 border-gray-700 text-white' : 'bg-white hover:bg-gray-50'}`}>Nofaol</button>
              <button onClick={() => { setFilterStaff(p => p === true ? undefined : true); setMeta(m => ({ ...m, page: 1 })); fetchUsers(); }} className={`inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium ${filterStaff ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white hover:bg-gray-50'}`}>Staff</button>
              <button onClick={() => { setFilterSuper(p => p === true ? undefined : true); setMeta(m => ({ ...m, page: 1 })); fetchUsers(); }} className={`inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium ${filterSuper ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white hover:bg-gray-50'}`}>Super</button>
              <button onClick={() => { setFilterVerified(p => p === true ? undefined : true); setMeta(m => ({ ...m, page: 1 })); fetchUsers(); }} className={`inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium ${filterVerified ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white hover:bg-gray-50'}`}>Verified</button>
              <button onClick={() => { setOrdering('-date_joined'); fetchUsers(); }} className="inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium bg-white hover:bg-gray-50"><ArrowUpDown className="w-3 h-3" /> Yangi</button>
              <button onClick={() => { fetchUsers(); fetchActivity(); }} className="inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium bg-white hover:bg-gray-50"><RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Yangilash</button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border rounded-lg bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => toggleOrdering('username')}>Foydalanuvchi{ordering.endsWith('username') && (ordering.startsWith('-') ? ' ↓' : ' ↑')}</th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => toggleOrdering('email')}>Email{ordering.endsWith('email') && (ordering.startsWith('-') ? ' ↓' : ' ↑')}</th>
                  <th className="px-4 py-2 text-left">Ism</th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => toggleOrdering('last_login')}>Oxirgi login{ordering.endsWith('last_login') && (ordering.startsWith('-') ? ' ↓' : ' ↑')}</th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => toggleOrdering('date_joined')}>Qo&apos;shilgan{ordering.endsWith('date_joined') && (ordering.startsWith('-') ? ' ↓' : ' ↑')}</th>
                  <th className="px-4 py-2 text-left">Flaglar</th>
                  <th className="px-4 py-2 text-left">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={7} className="px-4 py-16 text-center text-gray-500 text-sm"><Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />Yuklanmoqda...</td></tr>
                )}
                {!loading && users.map(u => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-800 underline decoration-dotted cursor-pointer" onClick={() => openDetail(u)}>{u.username}</td>
                    <td className="px-4 py-2 text-gray-600">{u.email}</td>
                    <td className="px-4 py-2 text-gray-600">{u.first_name} {u.last_name}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{u.last_login ? new Date(u.last_login).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{new Date(u.date_joined).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-xs">
                      <div className="flex flex-wrap gap-1">
                        <button onClick={() => toggleFlag(u, 'is_active')} className={`px-2 py-0.5 rounded ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>A</button>
                        <button onClick={() => toggleFlag(u, 'is_staff')} className={`px-2 py-0.5 rounded ${u.is_staff ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>S</button>
                        <button onClick={() => toggleFlag(u, 'is_superuser')} className={`px-2 py-0.5 rounded ${u.is_superuser ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>SU</button>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-xs">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(u)} className="px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Tahrir</button>
                        <button onClick={() => requestDelete(u)} className="px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">O&apos;chirish</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && users.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-16 text-center text-gray-500 text-sm">Foydalanuvchilar topilmadi</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-4 text-sm">
            <div>Jami: {meta.total}</div>
            <div className="flex items-center gap-2">
              <select value={meta.page_size} onChange={e => { setMeta(m => ({ ...m, page_size: Number(e.target.value), page: 1 })); fetchUsers(); }} className="border rounded px-2 py-1 text-sm">{pageSizes.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <div className="flex items-center gap-1">
                <button disabled={meta.page<=1} onClick={() => { setMeta(m => ({ ...m, page: 1 })); fetchUsers(); }} className="px-2 py-1 border rounded disabled:opacity-40">«</button>
                <button disabled={meta.page<=1} onClick={() => { setMeta(m => ({ ...m, page: m.page-1 })); fetchUsers(); }} className="px-2 py-1 border rounded disabled:opacity-40">‹</button>
                <span className="px-2">{meta.page}</span>
                <button disabled={meta.page>=Math.ceil(meta.total/meta.page_size)} onClick={() => { setMeta(m => ({ ...m, page: m.page+1 })); fetchUsers(); }} className="px-2 py-1 border rounded disabled:opacity-40">›</button>
                <button disabled={meta.page>=Math.ceil(meta.total/meta.page_size)} onClick={() => { setMeta(m => ({ ...m, page: Math.ceil(meta.total/meta.page_size) })); fetchUsers(); }} className="px-2 py-1 border rounded disabled:opacity-40">»</button>
              </div>
            </div>
          </div>

          {/* Detail Modal */}
          <AdminModal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title={detailUser?.username || 'Foydalanuvchi'} size="xl" footer={<div className="flex justify-end"><button onClick={() => setDetailOpen(false)} className="px-4 py-2 rounded bg-gray-100 text-gray-600 text-sm hover:bg-gray-200">Yopish</button></div>}>
            {!detailUser && <div className="py-10 text-center text-sm text-gray-500">Yuklanmoqda...</div>}
            {detailUser && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 text-[11px] uppercase tracking-wide mb-1">Asosiy</div>
                    <p>Email: {detailUser.email}</p>
                    <p>Ism: {detailUser.first_name} {detailUser.last_name}</p>
                    <p>Faol: {detailUser.is_active ? 'Ha' : 'Yo\'q'}</p>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[11px] uppercase tracking-wide mb-1">Statistika</div>
                    <p>Buyurtmalar: {detailUser.orders_count ?? 0}</p>
                    <p>Umumiy xarajat: {detailUser.total_spent ?? 0}</p>
                    <p>Kurs arizalari: {detailUser.course_applications ?? 0}</p>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[11px] uppercase tracking-wide mb-1">Flaglar</div>
                    <p>Staff: {detailUser.is_staff ? 'Ha' : 'Yo\'q'}</p>
                    <p>Superuser: {detailUser.is_superuser ? 'Ha' : 'Yo\'q'}</p>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-[11px] uppercase tracking-wide mb-2">So&apos;nggi buyurtmalar</div>
                  {detailUser.recent_orders && detailUser.recent_orders.length > 0 ? (
                    <div className="overflow-x-auto border rounded">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-100 text-gray-600">
                          <tr><th className="px-3 py-2 text-left">#</th><th className="px-3 py-2 text-left">Narx</th><th className="px-3 py-2 text-left">Holat</th><th className="px-3 py-2 text-left">Vaqt</th></tr>
                        </thead>
                        <tbody>
                          {detailUser.recent_orders.map(o => (
                            <tr key={o.id} className="border-t"><td className="px-3 py-1 font-mono text-[11px]">{o.order_number}</td><td className="px-3 py-1">{o.total_price}</td><td className="px-3 py-1">{o.status}</td><td className="px-3 py-1">{new Date(o.created_at).toLocaleString()}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : <div className="text-xs text-gray-500">Buyurtmalar yo&apos;q</div>}
                </div>
                <div>
                  <div className="text-gray-500 text-[11px] uppercase tracking-wide mb-2">So&apos;nggi sevimlilar</div>
                  {detailUser.recent_favorites && detailUser.recent_favorites.length > 0 ? (
                    <ul className="text-xs space-y-1">
                      {detailUser.recent_favorites.map(f => <li key={f.product_id} className="flex justify-between"><span>{f.product_name}</span><span className="text-gray-500">{new Date(f.created_at).toLocaleDateString()}</span></li>)}
                    </ul>
                  ) : <div className="text-xs text-gray-500">Sevimlilar yo&apos;q</div>}
                </div>
              </div>
            )}
          </AdminModal>

          {/* Edit Modal */}
          <AdminModal isOpen={editOpen} onClose={closeEdit} title={editUser ? `Tahrirlash #${editUser.id}` : 'Tahrirlash'} size="md" footer={<div className="flex justify-end gap-2"><button className="px-4 py-2 rounded bg-gray-100 text-gray-600 text-sm hover:bg-gray-200" onClick={closeEdit} disabled={saving}>Bekor</button><button className="px-4 py-2 rounded bg-green-600 text-white text-sm hover:bg-green-700" onClick={submitEdit} disabled={saving}>{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button></div>}>
            <form onSubmit={submitEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Ism" placeholder="Ism" value={editUser?.first_name} onChange={(v) => setEditUser(u => u ? { ...u, first_name: v } : u)} required />
                <FormInput label="Familiya" placeholder="Familiya" value={editUser?.last_name} onChange={(v) => setEditUser(u => u ? { ...u, last_name: v } : u)} required />
                <FormInput label="Email" type="email" placeholder="Email" value={editUser?.email} onChange={(v) => setEditUser(u => u ? { ...u, email: v } : u)} required />
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <input id="is_active" type="checkbox" checked={editUser?.is_active} onChange={() => setEditUser(u => u ? { ...u, is_active: !u.is_active } : u)} className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                    <label htmlFor="is_active" className="text-sm text-gray-700 cursor-pointer">Faol</label>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-gray-500 text-[11px] uppercase tracking-wide mb-1">Staff</div>
                      <button onClick={() => setEditUser(u => u ? { ...u, is_staff: !u.is_staff } : u)} className={`w-full px-3 py-1 rounded-md text-sm font-medium ${editUser?.is_staff ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Admin</button>
                    </div>
                    <div>
                      <div className="text-gray-500 text-[11px] uppercase tracking-wide mb-1">Superuser</div>
                      <button onClick={() => setEditUser(u => u ? { ...u, is_superuser: !u.is_superuser } : u)} className={`w-full px-3 py-1 rounded-md text-sm font-medium ${editUser?.is_superuser ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Super</button>
                    </div>
                    <div>
                      <div className="text-gray-500 text-[11px] uppercase tracking-wide mb-1">Tasdiqlangan</div>
                      <button onClick={() => setEditUser(u => u ? { ...u, is_verified: !u.is_verified } : u)} className={`w-full px-3 py-1 rounded-md text-sm font-medium ${editUser?.is_verified ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Verified</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </AdminModal>

          {/* Delete Confirm */}
          <ConfirmDialog open={confirmDeleteOpen} title="Foydalanuvchini o'chirish" description={`"${deleteTarget?.username}" o'chirilsinmi? Qaytarib bo'lmaydi.`} confirmLabel="O'chirish" cancelLabel="Bekor" onConfirm={confirmDelete} onCancel={() => { setConfirmDeleteOpen(false); setDeleteTarget(null); }} loading={saving} variant="danger" />
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
