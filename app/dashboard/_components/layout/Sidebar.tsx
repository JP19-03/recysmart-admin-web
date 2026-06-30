"use client";

import { useSession, signOut } from "next-auth/react";
import React, { useState } from "react";
import { NavItem } from "./NavItem";
import {
  Leaf,
  PieChart,
  Cpu,
  Users,
  Gamepad,
  Store,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";

interface SidebarProps {
  isOpenMobile?: boolean;
  setIsOpenMobile?: (isOpen: boolean) => void;
}

export function Sidebar({
  isOpenMobile = false,
  setIsOpenMobile,
}: SidebarProps) {
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: PieChart },
    { name: "IoT Edge Network", href: "/dashboard/iot", icon: Cpu },
    { name: "Citizens", href: "/dashboard/citizens", icon: Users },
  ];

  const platform = [
    { name: "Gamification Rules", href: "/dashboard/rules", icon: Gamepad },
    { name: "Partner Brands", href: "/dashboard/brands", icon: Store },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay Background */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile && setIsOpenMobile(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`bg-slate-900 text-slate-300 flex flex-col shrink-0 z-50 h-screen
          /* Desktop flow */
          md:relative transition-all duration-300 ease-in-out
          ${collapsed ? "md:w-20" : "md:w-64"}
          
          /* Mobile flow */
          fixed inset-y-0 left-0 w-64
          transform transition-transform duration-300 ease-in-out md:transform-none md:translate-x-0
          ${isOpenMobile ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header Logo section */}
        <div className={`h-20 flex items-center border-b border-slate-800 shrink-0 ${
          collapsed ? "md:justify-center px-4" : "justify-between px-6"
        }`}>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center shadow-lg">
              <Leaf className="text-white w-5 h-5" />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold text-white tracking-tight ml-3 animate-in fade-in duration-200">
                RecySmart <span className="font-light text-slate-500">OS</span>
              </span>
            )}
          </div>
          
          {/* Desktop Collapse Trigger */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="hidden md:block p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          
          {/* Mobile Drawer Close trigger */}
          <button
            onClick={() => setIsOpenMobile && setIsOpenMobile(false)}
            className="block md:hidden p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Collapsed Expand Trigger (Centered Arrow) */}
        {collapsed && (
          <div className="hidden md:flex justify-center py-2 border-b border-slate-800/50">
            <button
              onClick={() => setCollapsed(false)}
              className="p-1.5 rounded-full bg-slate-800/80 hover:bg-green-600 hover:text-white text-slate-400 transition-all duration-200"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation list */}
        <div className={`flex-1 overflow-y-auto py-6 space-y-6 ${collapsed ? "px-2" : "px-4"}`}>
          <div>
            {!collapsed ? (
              <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 animate-in fade-in duration-200">
                Overview
              </p>
            ) : (
              <div className="border-b border-slate-800/30 my-2" />
            )}
            <nav className="space-y-1">
              {navigation.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  collapsed={isOpenMobile ? false : collapsed}
                  onClick={() => setIsOpenMobile && setIsOpenMobile(false)}
                />
              ))}
            </nav>
          </div>

          <div>
            {!collapsed ? (
              <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 animate-in fade-in duration-200">
                Platform
              </p>
            ) : (
              <div className="border-b border-slate-800/30 my-2" />
            )}
            <nav className="space-y-1">
              {platform.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  collapsed={isOpenMobile ? false : collapsed}
                  onClick={() => setIsOpenMobile && setIsOpenMobile(false)}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* Profile section footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 shrink-0 space-y-3">
          <div className={`flex items-center px-2 ${collapsed ? "md:justify-center" : "justify-between"}`}>
            <div className="flex items-center min-w-0" title={collapsed ? (session?.user?.name || "System Admin") : undefined}>
              <img
                src={session?.user?.image || "https://i.pravatar.cc/150?img=11"}
                alt={session?.user?.name || "Admin"}
                className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover shrink-0"
              />
              {!collapsed && (
                <div className="ml-3 overflow-hidden animate-in fade-in duration-200">
                  <p className="text-sm font-bold text-white truncate">
                    {session?.user?.name || "System Admin"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {session?.user?.email || "admin@recysmart.com"}
                  </p>
                </div>
              )}
            </div>

            {/* Logout button (only if not collapsed) */}
            {!collapsed && (
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Logout button (only if collapsed, rendered below avatar) */}
          {collapsed && (
            <div className="hidden md:flex justify-center">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
