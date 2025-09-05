'use client';
import React from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import ComingSoon from '../_components/ComingSoon';
import { BookOpen } from 'lucide-react';

export default function CoursesAdminPlaceholder() {
  return (
    <AdminGuard>
      <AdminLayout title="Kurslar" description="Kurslarni boshqarish moduli">
        <ComingSoon title="Kurslar bo'limi" description="Kurslarni boshqarish, tahrirlash va statistikani ko'rish funksiyalari yaqin kunlarda qo'shiladi." icon={<BookOpen className='w-12 h-12' />} />
      </AdminLayout>
    </AdminGuard>
  );
}
