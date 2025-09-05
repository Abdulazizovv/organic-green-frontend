'use client';
import React from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import ComingSoon from '../_components/ComingSoon';
import { Settings } from 'lucide-react';

export default function SettingsAdminPlaceholder() {
  return (
    <AdminGuard>
      <AdminLayout title="Sozlamalar" description="Tizim sozlamalari va konfiguratsiya">
        <ComingSoon title="Sozlamalar bo'limi" description="Platforma sozlamalari, rollar va ruxsatlar boshqaruvi yaqin kunlarda qo'shiladi." icon={<Settings className='w-12 h-12' />} />
      </AdminLayout>
    </AdminGuard>
  );
}
