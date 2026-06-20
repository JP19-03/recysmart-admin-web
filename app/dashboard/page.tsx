"use client";

import React, { useState } from "react";
import { useDashboard } from "../../src/hooks/index";
import { KpiCard, KpiCardSkeleton } from "@/components/dashboard/KpiCard";
import { IoTNetworkTable } from "@/components/dashboard/IoTNetworkTable";
import {
  Recycle,
  Cloud,
  Ticket,
  Cpu,
  Search,
  Bell,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  const { data, error, isLoading, isError } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNetwork =
    data?.iotNetwork.filter((device) => {
      const query = searchQuery.toLowerCase();
      return (
        device.id.toLowerCase().includes(query) ||
        device.location.toLowerCase().includes(query)
      );
    }) || [];

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
        <h1 className="text-2xl font-bold text-slate-800">Global Overview</h1>

        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by Bin ID or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 w-64 text-slate-700"
            />
          </div>
          <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
        {/* Error Alert */}
        {isError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm font-medium animate-in fade-in duration-300">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">Error loading metrics</p>
              <p className="opacity-90">
                {(error as any)?.message ||
                  "Could not retrieve dashboard information."}
              </p>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KpiCardSkeleton />
              <KpiCardSkeleton />
              <KpiCardSkeleton />
              <KpiCardSkeleton />
            </div>

            <IoTNetworkTable devices={[]} isLoading={true} />
          </>
        )}

        {/* Dynamic Data Content */}
        {!isLoading && !isError && data && (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Plastic Recycled Card */}
              <KpiCard
                title="Plastic Recycled"
                value={data.kpis.totalPlasticKg.toLocaleString()}
                unit="kg"
                icon={Recycle}
                iconBgClass="bg-blue-50"
                iconColorClass="text-blue-500"
                trend={data.kpis.plasticGrowthPercentage}
              />

              {/* CO2 Avoided Card */}
              <KpiCard
                title="CO2 Avoided"
                value={data.kpis.co2AvoidedKg.toLocaleString()}
                unit="kg"
                icon={Cloud}
                iconBgClass="bg-green-50"
                iconColorClass="text-green-500"
              />

              {/* Coupons Redeemed Card */}
              <KpiCard
                title="Coupons Redeemed"
                value={data.kpis.couponsRedeemed.toLocaleString()}
                icon={Ticket}
                iconBgClass="bg-purple-50"
                iconColorClass="text-purple-500"
              />

              {/* Active Smart Bins Card */}
              <KpiCard
                title="Active Smart Bins"
                value={`${data.kpis.bins.active} / ${data.kpis.bins.total}`}
                icon={Cpu}
                iconBgClass="bg-orange-50"
                iconColorClass="text-orange-500"
              />
            </div>

            {/* IoT Edge Network Table Card */}
            <IoTNetworkTable
              devices={filteredNetwork}
              isLoading={false}
              onAddBin={() => console.log("Add bin clicked")}
            />
          </>
        )}
      </div>
    </main>
  );
}
