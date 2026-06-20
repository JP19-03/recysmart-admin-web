"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import { Leaf, PieChart, Cpu, Users, Gamepad, Store } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Leaf className="w-12 h-12 text-green-500 animate-pulse" />
                    <p className="text-slate-400 font-medium">Cargando consola...</p>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        redirect("/login");
    }

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
        <div className="min-h-screen bg-slate-50 flex text-slate-800 antialiased">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                {/* Logo Section */}
                <div className="h-20 flex items-center px-6 border-b border-slate-800">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center mr-3 shadow-lg">
                        <Leaf className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">
                        RecySmart <span className="font-light text-slate-500">OS</span>
                    </span>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                    <div>
                        <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                            Overview
                        </p>
                        <nav className="space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${
                                            isActive
                                                ? "bg-green-500/10 text-green-400 font-semibold"
                                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                        }`}
                                    >
                                        <Icon className="w-5 h-5 mr-3 shrink-0" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div>
                        <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                            Platform
                        </p>
                        <nav className="space-y-1">
                            {platform.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${
                                            isActive
                                                ? "bg-green-500/10 text-green-400 font-semibold"
                                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                        }`}
                                    >
                                        <Icon className="w-5 h-5 mr-3 shrink-0" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* User Section */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    <div className="flex items-center px-2">
                        <img
                            src={session?.user?.image || "https://i.pravatar.cc/150?img=11"}
                            alt={session?.user?.name || "Admin"}
                            className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover"
                        />
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">
                                {session?.user?.name || "System Admin"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {session?.user?.email || "admin@recysmart.com"}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
                {children}
            </div>
        </div>
    );
}