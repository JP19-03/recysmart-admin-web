"use client";

import React, { useState } from "react";
import { Citizen } from "@/src/schemas";
import {
  Coins,
  Crown,
  Sprout,
  Trees,
  FileText,
  Ban,
  Unlock,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CitizensTableProps {
  citizens: Citizen[];
  isLoading?: boolean;
  total?: number;
}

export function CitizenRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-3 bg-slate-100 rounded w-32"></div>
          <div className="h-2.5 bg-slate-100 rounded w-20"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-slate-200 rounded w-16 mb-2"></div>
        <div className="h-3 bg-slate-100 rounded w-20"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-slate-200 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-slate-200 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="h-6 bg-slate-200 rounded w-12 ml-auto"></div>
      </td>
    </tr>
  );
}

export function CitizensTable({
  citizens,
  isLoading = false,
  total,
}: CitizensTableProps) {
  // Local state to simulate status toggle (active vs suspended) without persisting to DB
  const [localStatuses, setLocalStatuses] = useState<Record<string, boolean>>({});

  const getCitizenStatus = (citizen: Citizen) => {
    return localStatuses[citizen.id] !== undefined
      ? localStatuses[citizen.id]
      : citizen.isActive;
  };

  const handleToggleStatus = (citizenId: string, currentStatus: boolean) => {
    setLocalStatuses((prev) => ({
      ...prev,
      [citizenId]: !currentStatus,
    }));
  };

  const getLevelStyling = (levelTitle: string = "Eco Beginner") => {
    const title = levelTitle.toLowerCase();
    if (title.includes("master")) {
      return {
        bg: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        icon: Crown,
      };
    }
    if (title.includes("warrior")) {
      return {
        bg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        icon: Trees,
      };
    }
    return {
      bg: "bg-slate-100 text-slate-600 border border-slate-200",
      icon: Sprout,
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
      {/* Table Title and Metadata */}
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
        <h3 className="text-sm font-bold text-slate-800">
          Registered Users (<span className="text-blue-600">{total ?? citizens.length}</span>)
        </h3>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-200">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Citizen Profile</th>
              <th className="px-6 py-4">Wallet Balance</th>
              <th className="px-6 py-4">Gamification Level</th>
              <th className="px-6 py-4">Account Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              <>
                <CitizenRowSkeleton />
                <CitizenRowSkeleton />
                <CitizenRowSkeleton />
              </>
            ) : citizens.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  No citizen accounts found matching your search.
                </td>
              </tr>
            ) : (
              citizens.map((citizen) => {
                const isActive = getCitizenStatus(citizen);
                const levelStyling = getLevelStyling(citizen.wallet?.levelTitle);
                const LevelIcon = levelStyling.icon;

                return (
                  <tr
                    key={citizen.id}
                    className={`hover:bg-slate-50/50 transition-colors group ${
                      !isActive ? "bg-red-50/10" : ""
                    }`}
                  >
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                        {citizen.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                          {citizen.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {citizen.email}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          ID: {citizen.id}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Coins className="text-green-500 w-4 h-4" />
                        <span className="font-bold text-slate-700">
                          {citizen.wallet?.currentBalance.toLocaleString() ?? "0"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                        Lifetime: {citizen.wallet?.lifetimePoints.toLocaleString() ?? "0"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${levelStyling.bg}`}
                      >
                        <LevelIcon className="w-3 h-3" /> {citizen.wallet?.levelTitle ?? "Eco Beginner"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          isActive
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        {isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer inline-block"
                        title="View Audit Logs"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(citizen.id, isActive)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer inline-block ml-2 ${
                          isActive
                            ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
                            : "text-slate-400 hover:text-green-600 hover:bg-green-50"
                        }`}
                        title={isActive ? "Suspend Wallet" : "Restore Wallet"}
                      >
                        {isActive ? <Ban className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && (
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 text-sm text-slate-500">
          <p>
            Showing <span className="font-bold text-slate-800">1</span> to{" "}
            <span className="font-bold text-slate-800">
              {citizens.length}
            </span>{" "}
            of <span className="font-bold text-slate-800">{total ?? citizens.length}</span> citizens
          </p>
          <div className="flex gap-2">
            <button
              className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-100 transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
              disabled
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-100 transition-colors text-blue-600 font-bold cursor-pointer">
              1
            </button>
            <button
              className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-100 transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
              disabled
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
