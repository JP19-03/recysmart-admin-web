"use client";

import { useState } from "react";
import { useCitizens } from "@/src/hooks/useCitizens";
import { CitizensTable } from "@/components/dashboard/CitizensTable";
import { Search, Filter, AlertTriangle } from "lucide-react";

export default function CitizensPage() {
  const { data, error, isLoading, isError } = useCitizens();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCitizens =
    data?.citizens.filter((citizen) => {
      const query = searchQuery.toLowerCase();
      return (
        citizen.name.toLowerCase().includes(query) ||
        citizen.email.toLowerCase().includes(query) ||
        citizen.id.toLowerCase().includes(query)
      );
    }) || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/50 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Citizens Directory
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage user accounts, audit wallets, and review transaction
            histories.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email or UUID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 text-slate-700 transition-all"
            />
          </div>
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-200 flex items-center gap-2 cursor-pointer">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="p-8 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-lg">
              Error loading directory
            </h4>
            <p className="text-sm text-slate-500 mt-1">
              {(error as any)?.message ||
                "Could not retrieve citizens details."}
            </p>
          </div>
        </div>
      )}

      {/* Citizens Table Component */}
      {!isError && (
        <CitizensTable
          citizens={filteredCitizens}
          isLoading={isLoading}
          total={data?.total}
        />
      )}
    </div>
  );
}
