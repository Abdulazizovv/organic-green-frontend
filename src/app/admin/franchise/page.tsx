'use client';
import React from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import ComingSoon from '../_components/ComingSoon';
import { Factory } from 'lucide-react';

export default function FranchiseAdminPlaceholder() {
  return (
    <AdminGuard>
      <AdminLayout title="Franshiza" description="Franshiza boshqaruvi moduli">
        <ComingSoon title="Franshiza bo'limi" description="Franshiza paketlari, talablar va monitoring tizimi tez orada qo'shiladi." icon={<Factory className='w-12 h-12' />} />
      </AdminLayout>
    </AdminGuard>
  );
}
