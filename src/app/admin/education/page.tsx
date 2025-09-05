'use client';
import React from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import ComingSoon from '../_components/ComingSoon';
import { GraduationCap } from 'lucide-react';

export default function EducationAdminPlaceholder() {
  return (
    <AdminGuard>
      <AdminLayout title="Ta'lim" description="Ta'lim tarkibi va materiallarini boshqarish">
        <ComingSoon title="Ta'lim bo'limi" description="Kurs modullari, darslar va o'quvchilar faoliyatini boshqarish imkoniyatlari qo'shiladi." icon={<GraduationCap className='w-12 h-12' />} />
      </AdminLayout>
    </AdminGuard>
  );
}
