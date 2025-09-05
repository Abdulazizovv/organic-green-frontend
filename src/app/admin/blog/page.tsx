'use client';
import React from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import ComingSoon from '../_components/ComingSoon';
import { FileText } from 'lucide-react';

export default function BlogAdminPlaceholder() {
  return (
    <AdminGuard>
      <AdminLayout title="Blog" description="Blog maqolalarini boshqarish tizimi">
        <ComingSoon title="Blog bo'limi" description="Maqolalar, toifalar va kontent kalendari boshqaruvi tez orada tayyor bo'ladi." icon={<FileText className='w-12 h-12' />} />
      </AdminLayout>
    </AdminGuard>
  );
}
