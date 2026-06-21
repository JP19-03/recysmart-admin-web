"use client";

import Link from "next/link";
import { Partner } from "@/src/schemas";
import { Store } from "lucide-react";

interface PartnerCardProps {
  partner: Partner;
  isActive: boolean;
  onToggleStatus: () => void;
}

export function PartnerCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs animate-pulse overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex gap-4 items-start">
        <div className="w-16 h-16 bg-slate-200 rounded-xl shrink-0"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 rounded w-32"></div>
          <div className="h-3 bg-slate-100 rounded w-24"></div>
          <div className="h-5 bg-slate-100 rounded w-20 mt-2"></div>
        </div>
      </div>
      <div className="p-5 flex-1 bg-slate-50/50 space-y-3">
        <div className="h-5 bg-slate-200 rounded w-full"></div>
        <div className="h-5 bg-slate-200 rounded w-full"></div>
        <div className="h-5 bg-slate-200 rounded w-full"></div>
      </div>
      <div className="p-4 border-t border-slate-100 bg-white flex gap-2">
        <div className="h-9 bg-slate-200 rounded flex-1"></div>
        <div className="h-9 bg-slate-200 rounded w-10"></div>
      </div>
    </div>
  );
}

export function PartnerCard({
  partner,
  isActive,
  onToggleStatus,
}: PartnerCardProps) {
  // Format points reclaimed (e.g. 45200 -> "45.2k")
  const formatPoints = (pts: number) => {
    if (pts >= 1000) {
      return `${(pts / 1000).toFixed(1)}k`;
    }
    return pts.toString();
  };

  // Derive a mockup category name based on partner RUC/ID to make the UI feel alive
  const getCategory = (companyName: string) => {
    const name = companyName.toLowerCase();
    if (name.includes("mart") || name.includes("super") || name.includes("retail")) {
      return "Retail";
    }
    if (name.includes("cafe") || name.includes("starbucks") || name.includes("food") || name.includes("restaurant")) {
      return "Food & Beverage";
    }
    return "Entertainment & Services";
  };

  const category = getCategory(partner.companyName);

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col ${
        !isActive ? "opacity-75 grayscale hover:grayscale-0" : ""
      }`}
    >
      {/* Brand card header */}
      <div className="p-6 border-b border-slate-100 flex gap-4 items-start relative">
        <div className="absolute top-4 right-4">
          <span
            className={`w-2.5 h-2.5 rounded-full inline-block ${
              isActive
                ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                : "bg-red-500"
            }`}
          ></span>
        </div>
        
        {/* General Store Icon for Partner Brand Logo */}
        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl border shrink-0 ${
            isActive
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-slate-100 text-slate-400 border-slate-200"
          }`}
        >
          <Store className="w-8 h-8" />
        </div>
        
        <div className="min-w-0">
          <h3 className="font-bold text-slate-800 text-lg leading-tight truncate">
            {partner.companyName}
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-1">
            RUC: {partner.ruc}
          </p>
          <p
            className={`text-[10px] font-bold uppercase mt-2.5 inline-block px-2 py-0.5 rounded border ${
              isActive
                ? "bg-slate-100 text-slate-500 border-slate-200"
                : "bg-red-50 text-red-500 border-red-100"
            }`}
          >
            {isActive ? category : "Suspended"}
          </p>
        </div>
      </div>

      {/* Brand metrics content */}
      <div className="p-5 flex-1 bg-slate-50/50 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-3">
          <span className="text-xs text-slate-500 font-semibold">Active Rewards</span>
          <span className="text-sm font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">
            {partner.activeRewardsCount}
          </span>
        </div>
        <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-3">
          <span className="text-xs text-slate-500 font-semibold">Total Coupons Redeemed</span>
          <span className="text-sm font-bold text-green-600">
            {partner.totalCouponsRedeemed.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500 font-semibold">Points Reclaimed</span>
          <span className="text-sm font-bold text-slate-800">
            {formatPoints(partner.pointsReclaimed)}{" "}
            <span className="text-[10px] text-slate-400">pts</span>
          </span>
        </div>
      </div>

      {/* Brand card action footer */}
      <div className="p-4 border-t border-slate-100 bg-white flex justify-between gap-2">
        <Link
          href={`/dashboard/brands/${partner.id}/catalog`}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border text-center flex items-center justify-center cursor-pointer ${
            isActive
              ? "text-blue-600 hover:bg-blue-50 border-transparent"
              : "text-slate-400 bg-slate-50 border-slate-200 cursor-not-allowed pointer-events-none"
          }`}
        >
          View Catalog
        </Link>
        <button
          onClick={onToggleStatus}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-all border cursor-pointer shrink-0 ${
            isActive
              ? "text-slate-500 border-slate-200 hover:text-red-600 hover:bg-red-50 hover:border-red-100"
              : "bg-slate-900 border-transparent hover:bg-slate-800 text-white"
          }`}
          title={isActive ? "Suspend Access" : "Restore Access"}
        >
          {isActive ? "Suspend" : "Restore"}
        </button>
      </div>
    </div>
  );
}
