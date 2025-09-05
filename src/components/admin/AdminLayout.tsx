'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X, LayoutDashboard, Users, Package, BookOpen, Factory, Layers, Settings, FileText, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Boshqaruv', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Foydalanuvchilar', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
  { label: 'Mahsulotlar', href: '/admin/products', icon: <Package className="w-4 h-4" /> },
  { label: 'Buyurtmalar', href: '/admin/orders', icon: <ShoppingCart className="w-4 h-4" /> },
  { label: 'Kurs arizalari', href: '/admin/course-applications', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Franshiza arizalari', href: '/admin/franchise-applications', icon: <Factory className="w-4 h-4" /> },
  { label: 'Kurslar', href: '/admin/courses', icon: <Layers className="w-4 h-4" /> },
  { label: 'Ta\'lim', href: '/admin/education', icon: <Layers className="w-4 h-4" /> },
  { label: 'Blog', href: '/admin/blog', icon: <FileText className="w-4 h-4" /> },
  { label: 'Sozlamalar', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(s => !s);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed z-40 inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} `}>
        <div className="h-16 flex items-center px-4 border-b">
          <span className="text-lg font-semibold text-green-600">OrganicGreen Admin</span>
          <button
            className="ml-auto lg:hidden p-2 rounded hover:bg-gray-100"
            onClick={toggleSidebar}
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map(item => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      active ? 'bg-green-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t p-4 text-sm text-gray-600 flex items-center justify-between">
          <div className="truncate max-w-[140px]">
            {user?.username || 'Admin'}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        {/* Top bar */}
        <header className="h-16 bg-white border-b flex items-center px-4 gap-4 sticky top-0 z-20">
          <button
            className="lg:hidden p-2 rounded hover:bg-gray-100"
            onClick={toggleSidebar}
            aria-label="Menyuni ochish"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            {title && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
