"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { NavbarSpacer } from "@/components/layout/NavbarSpacer";
import { Footer } from "@/components/layout/Footer";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      {!isAdmin && <NavbarSpacer />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
