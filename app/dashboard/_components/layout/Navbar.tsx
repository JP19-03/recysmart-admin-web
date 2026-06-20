"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { Menu, Bell, ChevronDown, Leaf } from "lucide-react";

interface NavbarProps {
  onOpenMenu: () => void;
}

export function Navbar({ onOpenMenu }: NavbarProps) {
  const { data: session } = useSession();


  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 shadow-sm justify-between md:hidden z-30">
      {/* Mobile-only toggle and logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMenu}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center shadow-md">
          <Leaf className="text-white w-4.5 h-4.5" />
        </div>
        <span className="font-bold tracking-tight text-slate-800">
          RecySmart <span className="font-light text-slate-500">OS</span>
        </span>
      </div>

      {/* Mobile-only user avatar */}
      <div>
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "Admin"}
            className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-green-700 flex items-center justify-center text-white text-xs font-bold shadow">
            {session?.user?.name ? session.user.name[0].toUpperCase() : "A"}
          </div>
        )}
      </div>
    </header>
  );
}
