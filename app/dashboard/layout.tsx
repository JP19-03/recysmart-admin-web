"use client";

import React, { useState } from "react";
import { Sidebar } from "./_components/layout/Sidebar";
import { Navbar } from "./_components/layout/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar isOpenMobile={isOpenMobile} setIsOpenMobile={setIsOpenMobile} />

      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <Navbar onOpenMenu={() => setIsOpenMobile(true)} />

        <main className="flex-1 overflow-y-auto p-6 w-full max-w-full bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}