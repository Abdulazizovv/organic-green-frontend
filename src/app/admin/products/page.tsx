'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { adminAPI, AdminProduct, CreateProductPayload, UpdateProductPayload, Paginated, AdminProductDetail, ProductCategory } from '@/services/adminAPI';
import { AdminModal } from '@/components/admin/AdminModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { FormInput } from '@/components/admin/FormControls';
import Image from 'next/image';
import { Plus, Search, Loader2, Eye, Star, Filter, RefreshCw, Grid as GridIcon, List as ListIcon, Image as ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface ProductFormState extends Partial<CreateProductPayload> { id?: string; images?: File[]; }
const emptyForm: ProductFormState = { name_uz: '', name_ru: '', name_en: '', price: '', sale_price: '', stock: 0, category: 0, is_active: true, is_featured: false, images: [] };

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [meta, setMeta] = useState({ page: 1, page_size: 20, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormState>(emptyForm);
  const { showSuccess, showError } = useToast();
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [detail, setDetail] = useState<AdminProductDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterFeatured, setFilterFeatured] = useState<boolean | undefined>(undefined);
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [view, setView] = useState<'grid' | 'table'>('grid');

  const fetchCategories = useCallback(() => {
    setCatLoading(true);
    adminAPI.getProductCategories()
      .then(r => {
        const raw: unknown = r.data;
        type MaybePaged<T> = { results: T[] } | T[] | unknown;
        const val = raw as MaybePaged<ProductCategory>;
        if (Array.isArray(val)) { setCategories(val as ProductCategory[]); return; }
        if (val && typeof val === 'object' && 'results' in val) {
          const maybe = (val as { results: unknown }).results;
          if (Array.isArray(maybe)) {
            const typed: ProductCategory[] = maybe.filter((x): x is ProductCategory => {
              return !!x && typeof x === 'object' && 'id' in x && 'name_uz' in x;
            }) as ProductCategory[];
            setCategories(typed);
            return;
          }
        }
        setCategories([]);
      })
      .catch(() => { setCategories([]); showError('Kategoriyalarni yuklashda xatolik'); })
      .finally(() => setCatLoading(false));
  }, [showError]);

  const fetchProducts = useCallback(() => {
    setLoading(true); setError(null);
    const params: { [k: string]: string | number | boolean | undefined } = { page: meta.page, page_size: meta.page_size };
    if (search) params.search = search;
    if (ordering) params.ordering = ordering;
    if (filterFeatured !== undefined) params.is_featured = filterFeatured;
    if (filterActive !== undefined) params.is_active = filterActive;
    adminAPI.getProducts(params)
      .then((r) => { const data = r.data as Paginated<AdminProduct>; setProducts(data.results); setMeta(m => ({ ...m, total: data.count })); })
      .catch(e => setError(e?.message || 'Mahsulotlarni yuklashda xatolik'))
      .finally(() => setLoading(false));
  }, [meta.page, meta.page_size, search, ordering, filterFeatured, filterActive]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const stats = useMemo(() => {
    const total = meta.total;
    const active = products.filter(p => p.is_active).length;
    const featured = products.filter(p => p.is_featured).length;
    const outOfStock = products.filter(p => p.stock <= 0).length;
    return { total, active, featured, outOfStock };
  }, [products, meta.total]);

  const openCreate = () => { setFormData(emptyForm); setFormOpen(true); };
  const openEdit = async (p: AdminProduct) => {
    try { const r = await adminAPI.getProduct(p.id); const d = r.data; setFormData({ ...d, id: d.id }); setFormOpen(true); }
    catch { showError('Mahsulotni yuklashda xatolik'); }
  };
  const closeForm = () => { setFormOpen(false); setFormData(emptyForm); };

  const loadDetail = async (id: string) => { try { const r = await adminAPI.getProduct(id); setDetail(r.data); setDetailOpen(true); } catch { showError('Tafsilotlarni yuklashda xatolik'); } };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name_uz || !formData.price || !formData.category) { showError('Majburiy maydonlar to\'ldirilmagan'); return; }
    // Slug generatsiya (agar backend talab qilsa) – faqat jo'natishda qo'shamiz
    const makeSlug = (s: string) => s
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const ensuredSlug = formData.slug || makeSlug(formData.name_uz || formData.name_en || 'product');

    try {
      setSaving(true);
      if (formData.id) {
        console.groupCollapsed('%c[Product Update]','color: #2563eb');
        console.log('ID:', formData.id);
        const update: UpdateProductPayload = {
          name_uz: formData.name_uz!, name_ru: formData.name_ru!, name_en: formData.name_en!, price: formData.price!, sale_price: formData.sale_price || undefined,
          stock: Number(formData.stock), category: Number(formData.category), is_active: !!formData.is_active, is_featured: !!formData.is_featured,
          slug: ensuredSlug
        };
        console.log('Payload (JSON PATCH):', update);
        await adminAPI.updateProduct(formData.id, update);
        console.groupEnd();
        showSuccess('Mahsulot yangilandi');
      } else {
        console.groupCollapsed('%c[Product Create]','color: #047857');
        console.log('Mode:', formData.images && formData.images.length ? 'multipart/form-data' : 'json');
        console.log('Raw formData state:', formData);
        if (formData.images && formData.images.length > 0) {
          const fd = new FormData();
          fd.append('name_uz', formData.name_uz || ''); fd.append('name_ru', formData.name_ru || ''); fd.append('name_en', formData.name_en || '');
          fd.append('price', formData.price || '0'); if (formData.sale_price) fd.append('sale_price', formData.sale_price);
            fd.append('stock', String(formData.stock || 0)); fd.append('category', String(formData.category));
          fd.append('is_active', String(!!formData.is_active)); fd.append('is_featured', String(!!formData.is_featured));
          if (ensuredSlug) fd.append('slug', ensuredSlug);
          formData.images.forEach((file, idx) => { fd.append(`images[${idx}].image`, file); fd.append(`images[${idx}].alt_text_uz`, idx === 0 ? 'Asosiy rasm' : file.name); if (idx === 0) fd.append(`images[${idx}].is_primary`, 'true'); fd.append(`images[${idx}].order`, String(idx)); });
          // Debug: ko'rish uchun barcha FormData maydonlarini log qilamiz
          for (const pair of fd.entries()) { console.log('FD =>', pair[0], pair[1]); }
          await adminAPI.createProduct(fd);
        } else {
          const payload: CreateProductPayload = { name_uz: formData.name_uz || '', name_ru: formData.name_ru || '', name_en: formData.name_en || '', price: formData.price || '0', sale_price: formData.sale_price || undefined, stock: Number(formData.stock) || 0, category: Number(formData.category), is_active: !!formData.is_active, is_featured: !!formData.is_featured, slug: ensuredSlug };
          console.log('Payload (JSON POST):', payload);
          await adminAPI.createProduct(payload);
        }
        console.groupEnd();
        showSuccess('Mahsulot yaratildi');
      }
      closeForm(); fetchProducts();
    } catch (err) {
      console.group('%c[Product Save ERROR]','color:#dc2626');
      console.error('Exception object:', err);
      type AxiosLikeError = { response?: { status?: number; data?: Record<string, unknown> }; };
      const anyErr = err as AxiosLikeError;
      const resp = anyErr?.response;
      if (resp) {
        console.error('Status:', resp.status);
        console.error('Response data:', resp.data);
        let msg: string | undefined = typeof resp.data?.detail === 'string' ? resp.data?.detail as string : typeof resp.data?.message === 'string' ? resp.data?.message as string : undefined;
        if (!msg && resp.data && typeof resp.data === 'object') {
          msg = Object.entries(resp.data)
            .map(([k, v]) => {
              if (k === 'detail' || k === 'message') return '';
              if (Array.isArray(v)) return `${k}: ${v.join(', ')}`;
              return `${k}: ${v}`;
            })
            .filter(Boolean)
            .join('; ');
        }
        showError(msg || 'Saqlashda xatolik (400)');
      } else {
        showError('Saqlashda xatolik (tarmoq)');
      }
      console.groupEnd();
    } finally { setSaving(false); }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => { const files = Array.from(e.target.files || []); setFormData(f => ({ ...f, images: [...(f.images || []), ...files] })); };
  const removeImage = (idx: number) => setFormData(f => ({ ...f, images: (f.images || []).filter((_, i) => i !== idx) }));

  const requestDelete = (p: AdminProduct) => { setDeleteTarget(p); setConfirmDeleteOpen(true); };
  const confirmDelete = async () => { if (!deleteTarget) return; try { setSaving(true); await adminAPI.deleteProduct(deleteTarget.id); fetchProducts(); showSuccess('Mahsulot o&apos;chirildi'); } catch { showError('O&apos;chirishda xatolik'); } finally { setSaving(false); setConfirmDeleteOpen(false); setDeleteTarget(null); } };

  // Cards view
  const productCards = (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map(p => (
        <div key={p.id} className="group relative border rounded-xl bg-white overflow-hidden hover:shadow-md transition flex flex-col">
          <div className="relative h-40 bg-gray-100">
            {p.primary_image_url ? (
              <Image src={p.primary_image_url} alt={p.name_uz} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs flex-col gap-1"><ImageIcon className="w-5 h-5" /> Rasm yo&apos;q</div>
            )}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {p.is_featured && <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500 text-white shadow">Tavsiya</span>}
              {!p.is_active && <span className="px-2 py-0.5 rounded text-[10px] bg-gray-500 text-white shadow">Nofaol</span>}
            </div>
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => loadDetail(p.id)} className="p-1 rounded bg-white/80 hover:bg-white shadow"><Eye className="w-3 h-3" /></button>
              <button onClick={() => openEdit(p)} className="p-1 rounded bg-white/80 hover:bg-white shadow"><Pencil className="w-3 h-3" /></button>
              <button onClick={() => requestDelete(p)} className="p-1 rounded bg-white/80 hover:bg-white shadow text-red-600"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h4 className="font-medium text-sm line-clamp-2 mb-2">{p.name_uz}</h4>
            <div className="text-xs text-gray-500 mb-3">{p.category_name || 'Kategoriya'}</div>
            <div className="mt-auto">
              <div className="text-sm font-semibold text-gray-900">{p.price}{p.sale_price && <span className="ml-2 text-xs line-through text-red-500 opacity-70">{p.sale_price}</span>}</div>
              <div className="text-[11px] text-gray-500 mt-1">Ombor: {p.stock}</div>
            </div>
          </div>
        </div>
      ))}
      {products.length === 0 && !loading && <div className="col-span-full p-10 text-center text-gray-500 text-sm">Mahsulotlar topilmadi</div>}
    </div>
  );

  return (
    <AdminGuard>
      <AdminLayout title="Mahsulotlar" description="Mahsulotlarni boshqarish va optimallashtirish">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-5 md:grid-cols-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-600 to-emerald-500 text-white shadow"><div className="flex items-center justify-between mb-1"><span className="text-xs uppercase tracking-wide opacity-80">Jami</span></div><p className="text-2xl font-semibold">{stats.total}</p><p className="text-[11px] opacity-70">Mahsulotlar</p></div>
            <div className="p-4 rounded-lg bg-white border shadow-sm"><div className="flex items-center justify-between mb-1"><span className="text-xs uppercase tracking-wide text-gray-500">Faol</span></div><p className="text-2xl font-semibold text-gray-800">{stats.active}</p><p className="text-[11px] text-gray-500">Faol</p></div>
            <div className="p-4 rounded-lg bg-white border shadow-sm"><div className="flex items-center justify-between mb-1"><span className="text-xs uppercase tracking-wide text-gray-500">Tavsiya</span></div><p className="text-2xl font-semibold text-gray-800">{stats.featured}</p><p className="text-[11px] text-gray-500">Tanlangan</p></div>
            <div className="p-4 rounded-lg bg-white border shadow-sm"><div className="flex items-center justify-between mb-1"><span className="text-xs uppercase tracking-wide text-gray-500">Tugagan</span></div><p className="text-2xl font-semibold text-gray-800">{stats.outOfStock}</p><p className="text-[11px] text-gray-500">Sotuvda yo&apos;q</p></div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => { setSearch(e.target.value); setMeta(m => ({ ...m, page: 1 })); }} placeholder="Qidirish..." className="pl-7 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-52 bg-white" />
              </div>
              <button onClick={() => { setFilterActive(p => p === true ? undefined : true); setMeta(m => ({ ...m, page: 1 })); }} className={`inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium ${filterActive ? 'bg-green-600 border-green-600 text-white' : 'bg-white hover:bg-gray-50'}`}><Filter className="w-3 h-3" /> Faol</button>
              <button onClick={() => { setFilterActive(p => p === false ? undefined : false); setMeta(m => ({ ...m, page: 1 })); }} className={`inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium ${filterActive === false ? 'bg-gray-700 border-gray-700 text-white' : 'bg-white hover:bg-gray-50'}`}>Nofaol</button>
              <button onClick={() => { setFilterFeatured(p => p === true ? undefined : true); setMeta(m => ({ ...m, page: 1 })); }} className={`inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium ${filterFeatured ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white hover:bg-gray-50'}`}><Star className="w-3 h-3" /> Tavsiya</button>
              <button onClick={() => { setFilterFeatured(p => p === false ? undefined : false); setMeta(m => ({ ...m, page: 1 })); }} className={`inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium ${filterFeatured === false ? 'bg-gray-700 border-gray-700 text-white' : 'bg-white hover:bg-gray-50'}`}>Tavsiya emas</button>
              <button onClick={() => { setOrdering('-created_at'); }} className="inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium bg-white hover:bg-gray-50"><RefreshCw className="w-3 h-3" /> Eng yangi</button>
              <button onClick={fetchProducts} className="inline-flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium bg-white hover:bg-gray-50"><RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Yangilash</button>
              <div className="flex items-center gap-1 ml-2 border rounded-md overflow-hidden">
                <button onClick={() => setView('grid')} className={`px-2 py-2 text-xs ${view === 'grid' ? 'bg-green-600 text-white' : 'bg-white hover:bg-gray-50'}`}><GridIcon className="w-3 h-3" /></button>
                <button onClick={() => setView('table')} className={`px-2 py-2 text-xs ${view === 'table' ? 'bg-green-600 text-white' : 'bg-white hover:bg-gray-50'}`}><ListIcon className="w-3 h-3" /></button>
              </div>
            </div>
            <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700"><Plus className="w-4 h-4" /> Yangi mahsulot</button>
          </div>

          {/* List */}
          {error && <div className="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
          <div className="min-h-[200px]">
            {loading && <div className="py-16 text-center text-gray-500 text-sm flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Yuklanmoqda...</div>}
            {!loading && (view === 'grid' ? productCards : (
              <div className="overflow-x-auto border rounded-lg bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Mahsulot</th>
                      <th className="px-4 py-2 text-left">Narx</th>
                      <th className="px-4 py-2 text-left">Ombor</th>
                      <th className="px-4 py-2 text-left">Holat</th>
                      <th className="px-4 py-2 text-left">Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden">
                              {p.primary_image_url ? <Image src={p.primary_image_url} alt={p.name_uz} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-4 h-4" /></div>}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{p.name_uz}</div>
                              <div className="text-[11px] text-gray-500">{p.category_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">{p.price}{p.sale_price && <span className="text-xs text-red-500 ml-1 line-through opacity-70">{p.sale_price}</span>}</td>
                        <td className="px-4 py-2 text-sm">{p.stock}</td>
                        <td className="px-4 py-2 text-xs">
                          <div className="flex flex-col gap-1">
                            <span className={`px-2 py-0.5 rounded ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.is_active ? 'Faol' : 'Nofaol'}</span>
                            <span className={`px-2 py-0.5 rounded ${p.is_featured ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>{p.is_featured ? 'Tavsiya' : 'Oddiy'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-xs">
                          <div className="flex gap-2">
                            <button onClick={() => loadDetail(p.id)} className="px-2 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100">Ko&apos;rish</button>
                            <button onClick={() => openEdit(p)} className="px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Tahrir</button>
                            <button onClick={() => requestDelete(p)} className="px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">O&apos;chirish</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && <tr><td colSpan={5} className="px-4 py-16 text-center text-gray-500 text-sm">Mahsulotlar topilmadi</td></tr>}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-4 text-sm">
            <div>Jami: {meta.total}</div>
            <div className="flex items-center gap-2">
              <select value={meta.page_size} onChange={e => setMeta(m => ({ ...m, page_size: Number(e.target.value), page: 1 }))} className="border rounded px-2 py-1 text-sm">
                {[12,20,50,100].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="flex items-center gap-1">
                <button disabled={meta.page<=1} onClick={() => setMeta(m => ({ ...m, page: 1 }))} className="px-2 py-1 border rounded disabled:opacity-40">«</button>
                <button disabled={meta.page<=1} onClick={() => setMeta(m => ({ ...m, page: m.page-1 }))} className="px-2 py-1 border rounded disabled:opacity-40">‹</button>
                <span className="px-2">{meta.page}</span>
                <button disabled={meta.page>=Math.ceil(meta.total/meta.page_size)} onClick={() => setMeta(m => ({ ...m, page: m.page+1 }))} className="px-2 py-1 border rounded disabled:opacity-40">›</button>
                <button disabled={meta.page>=Math.ceil(meta.total/meta.page_size)} onClick={() => setMeta(m => ({ ...m, page: Math.ceil(meta.total/meta.page_size) }))} className="px-2 py-1 border rounded disabled:opacity-40">»</button>
              </div>
            </div>
          </div>

          {/* Create / Edit Modal */}
          <AdminModal isOpen={formOpen} onClose={closeForm} title={formData.id ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'} size="xl" footer={(<div className="flex justify-between items-center gap-4 w-full">
            <div className="text-[11px] text-gray-500 flex-1">Rasm tanlansa multipart form-data yuboriladi.</div>
            <div className="flex gap-2">
              <button onClick={closeForm} className="px-4 py-2 rounded bg-gray-100 text-gray-600 text-sm hover:bg-gray-200" disabled={saving}>Bekor</button>
              <button onClick={submitForm} className="px-4 py-2 rounded bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-60" disabled={saving}>{saving ? <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saqlanmoqda</span> : 'Saqlash'}</button>
            </div>
          </div>)}>
            <form onSubmit={submitForm} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <FormInput label="Nom (UZ)" value={formData.name_uz} onChange={e => setFormData(f => ({ ...f, name_uz: e.target.value }))} required />
                <FormInput label="Nom (RU)" value={formData.name_ru} onChange={e => setFormData(f => ({ ...f, name_ru: e.target.value }))} required />
                <FormInput label="Nom (EN)" value={formData.name_en} onChange={e => setFormData(f => ({ ...f, name_en: e.target.value }))} required />
                <FormInput label="Narx" type="number" value={formData.price} onChange={e => setFormData(f => ({ ...f, price: e.target.value }))} required />
                <FormInput label="Chegirma narx" type="number" value={formData.sale_price} onChange={e => setFormData(f => ({ ...f, sale_price: e.target.value }))} />
                <FormInput label="Soni" type="number" value={formData.stock?.toString()} onChange={e => setFormData(f => ({ ...f, stock: Number(e.target.value) }))} required />
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Kategoriya</label>
                  <div className="flex items-center gap-2">
                    <select value={formData.category || 0} onChange={e => setFormData(f => ({ ...f, category: Number(e.target.value) }))} className="flex-1 border rounded px-2 py-2 text-sm bg-white">
                      <option value={0}>Tanlang...</option>
                      {Array.isArray(categories) && categories.map(c => <option key={c.id} value={c.id}>{c.name_uz}</option>)}
                    </select>
                    <button type="button" onClick={fetchCategories} className="p-2 border rounded hover:bg-gray-50"><RefreshCw className={`w-4 h-4 ${catLoading ? 'animate-spin' : ''}`} /></button>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-3">
                  <label className="block text-xs font-medium text-gray-600">Rasmlar</label>
                  <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="border rounded text-xs w-full file:mr-2 file:py-1 file:px-2 file:border-0 file:bg-green-600 file:text-white file:text-xs file:rounded hover:file:bg-green-700" />
                  {formData.images && formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 max-h-28 overflow-auto">
                      {formData.images.map((file, idx) => (
                        <div key={idx} className="relative group">
                          <Image src={URL.createObjectURL(file)} width={72} height={72} className="w-18 h-18 object-cover rounded border" alt={file.name} />
                          <button type="button" onClick={() => removeImage(idx)} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-80 group-hover:opacity-100">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!formData.is_active} onChange={e => setFormData(f => ({ ...f, is_active: e.target.checked }))} className="h-4 w-4" /> Faol</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!formData.is_featured} onChange={e => setFormData(f => ({ ...f, is_featured: e.target.checked }))} className="h-4 w-4" /> Tavsiya</label>
              </div>
            </form>
          </AdminModal>

          {/* Detail Modal */}
          <AdminModal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title={detail?.name_uz || 'Mahsulot'} size="xl" footer={<div className="flex justify-end"><button onClick={() => setDetailOpen(false)} className="px-4 py-2 rounded bg-gray-100 text-gray-600 text-sm hover:bg-gray-200">Yopish</button></div>}>
            {!detail && <div className="py-10 text-center text-sm text-gray-500">Yuklanmoqda...</div>}
            {detail && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  {detail.images_list && detail.images_list.map(img => (
                    <div key={img.id} className="relative">
                      <Image src={img.image_url} alt={img.alt_text_uz || detail.name_uz} width={96} height={96} className={`w-24 h-24 object-cover rounded border ${img.is_primary ? 'ring-2 ring-green-500' : ''}`} />
                    </div>
                  ))}
                  {(!detail.images_list || detail.images_list.length === 0) && (
                    <div className="text-xs text-gray-500 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Rasm yo&apos;q</div>
                  )}
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 text-[11px] uppercase tracking-wide mb-1">Asosiy ma&apos;lumot</div>
                    <p><span className="text-gray-600">Kategoriya:</span> {detail.category_name || detail.category}</p>
                    <p><span className="text-gray-600">Narx:</span> {detail.price} {detail.sale_price && (<span className="text-red-500 line-through ml-1 text-xs">{detail.sale_price}</span>)}</p>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[11px] uppercase tracking-wide mb-1">Statistika</div>
                    <p>Buyurtmalar: {detail.orders_count ?? 0}</p>
                    <p>Sevimlilar: {detail.favorites_count ?? 0}</p>
                    <p>Jami sotilgan: {detail.total_sold ?? 0}</p>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[11px] uppercase tracking-wide mb-1">Holat</div>
                    <p>Faol: {detail.is_active ? 'Ha' : 'Yo\'q'}</p>
                    <p>Tavsiya: {detail.is_featured ? 'Ha' : 'Yo\'q'}</p>
                    <p>Ombor: {detail.stock}</p>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-[11px] uppercase tracking-wide mb-2">So&apos;ngi buyurtmalar</div>
                  {detail.recent_orders && detail.recent_orders.length > 0 ? (
                    <div className="overflow-x-auto border rounded">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-100 text-gray-600">
                          <tr>
                            <th className="px-3 py-2 text-left">#</th>
                            <th className="px-3 py-2 text-left">Miqdor</th>
                            <th className="px-3 py-2 text-left">Narx</th>
                            <th className="px-3 py-2 text-left">Vaqt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detail.recent_orders?.map(o => (
                            <tr key={o.order_id} className="border-t">
                              <td className="px-3 py-1 font-mono text-[11px]">{o.order_number}</td>
                              <td className="px-3 py-1">{o.quantity}</td>
                              <td className="px-3 py-1">{o.price}</td>
                              <td className="px-3 py-1">{new Date(o.created_at).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : <div className="text-xs text-gray-500">Buyurtmalar yo&apos;q</div>}
                </div>
              </div>
            )}
          </AdminModal>

          <ConfirmDialog open={confirmDeleteOpen} title="Mahsulotni o'chirish" description={`"${deleteTarget?.name_uz}" o'chirilsinmi? Qaytarib bo'lmaydi.`} confirmLabel="O'chirish" cancelLabel="Bekor" onConfirm={confirmDelete} onCancel={() => { setConfirmDeleteOpen(false); setDeleteTarget(null); }} loading={saving} variant="danger" />
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}