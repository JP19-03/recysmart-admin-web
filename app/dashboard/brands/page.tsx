"use client";

import React, { useState } from "react";
import { usePartners } from "@/src/hooks/usePartners";
import { KpiCard, KpiCardSkeleton } from "@/components/dashboard/KpiCard";
import {
  PartnerCard,
  PartnerCardSkeleton,
} from "@/components/dashboard/PartnerCard";
import { Partner } from "@/src/schemas";
import { RegisterAllyDialog } from "./_components/RegisterAllyDialog";
import {
  Building2,
  Gift,
  Ticket,
  Search,
  Bell,
  AlertTriangle,
  Filter,
} from "lucide-react";

type CategoryFilter =
  | "ALL"
  | "Retail"
  | "Food & Beverage"
  | "Entertainment & Services"
  | "STATUS_ACTIVE"
  | "STATUS_SUSPENDED";

export default function PartnerBrandsPage() {
  const { data, error, isLoading, isError } = usePartners();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("ALL");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Local state to simulate status changes
  const [localStatuses, setLocalStatuses] = useState<Record<string, boolean>>(
    {},
  );

  const handleToggleStatus = (partnerId: string, currentActive: boolean) => {
    setLocalStatuses((prev) => ({
      ...prev,
      [partnerId]: !currentActive,
    }));
  };

  const getPartnerActiveState = (partner: Partner) => {
    return localStatuses[partner.id] !== undefined
      ? localStatuses[partner.id]
      : partner.isActive;
  };

  // Format category helper to match category derived inside PartnerCard component
  const getCategory = (companyName: string) => {
    const name = companyName.toLowerCase();
    if (
      name.includes("mart") ||
      name.includes("super") ||
      name.includes("retail")
    ) {
      return "Retail";
    }
    if (
      name.includes("cafe") ||
      name.includes("starbucks") ||
      name.includes("food") ||
      name.includes("restaurant")
    ) {
      return "Food & Beverage";
    }
    return "Entertainment & Services";
  };

  // Filter partners
  const filteredPartners =
    data?.partners.filter((partner) => {
      const active = getPartnerActiveState(partner);
      const category = getCategory(partner.companyName);

      // Search matches
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        partner.companyName.toLowerCase().includes(query) ||
        partner.ruc.toLowerCase().includes(query) ||
        partner.id.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Filter matches
      if (activeFilter === "ALL") return true;
      if (activeFilter === "STATUS_ACTIVE") return active;
      if (activeFilter === "STATUS_SUSPENDED") return !active;

      return category === activeFilter;
    }) || [];

  // Dynamically compute/adjust KPIs based on local suspend/restore simulation
  const computedStats = React.useMemo(() => {
    if (!data) return { totalAllies: 0, activeRewards: 0, globalRedeems: 0 };

    let totalAllies = data.stats.totalAllies;
    let activeRewards = data.stats.activeRewards;
    const globalRedeems = data.stats.globalRedeems;

    // Adjust counts based on simulated local toggles
    data.partners.forEach((partner) => {
      const originalActive = partner.isActive;
      const currentActive = getPartnerActiveState(partner);

      if (originalActive && !currentActive) {
        // Suspend simulation
        activeRewards = Math.max(0, activeRewards - partner.activeRewardsCount);
      } else if (!originalActive && currentActive) {
        // Restore simulation
        activeRewards = activeRewards + partner.activeRewardsCount;
      }
    });

    // Let's also verify totalAllies if we want it to count only active allies,
    // but totalAllies usually represents the registered number of brands, so we keep it constant.
    return {
      totalAllies,
      activeRewards,
      globalRedeems,
    };
  }, [data, localStatuses]);

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="py-4 sm:py-0 sm:h-20 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 gap-4 z-10 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Partner Brands Network
          </h1>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            Monitor and manage active rewards, RUC validations, and coupon
            performance across allies.
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
          {/* Registrar Aliado Button */}
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-lg cursor-pointer transition-all shadow-xs shrink-0"
          >
            Registrar Aliado
          </button>

          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, RUC or UUID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 w-full sm:w-64 text-slate-700 transition-all"
            />
          </div>
          <button className="relative text-slate-400 hover:text-slate-600 transition-colors shrink-0">
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
              <p className="font-bold">Error loading partner brand directory</p>
              <p className="opacity-90">
                {(error as any)?.message ||
                  "Could not retrieve partner statistics and details."}
              </p>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <KpiCardSkeleton />
              <KpiCardSkeleton />
              <KpiCardSkeleton />
            </div>

            <div className="h-10 w-full max-w-xl bg-slate-200 rounded-lg mb-6 animate-pulse"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PartnerCardSkeleton />
              <PartnerCardSkeleton />
              <PartnerCardSkeleton />
            </div>
          </>
        )}

        {/* Data Content */}
        {!isLoading && !isError && data && (
          <>
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <KpiCard
                title="Total Allies"
                value={computedStats.totalAllies}
                icon={Building2}
                iconBgClass="bg-blue-50"
                iconColorClass="text-blue-500"
              />

              <KpiCard
                title="Active Rewards"
                value={computedStats.activeRewards}
                icon={Gift}
                iconBgClass="bg-purple-50"
                iconColorClass="text-purple-500"
              />

              <KpiCard
                title="Global Redeems"
                value={computedStats.globalRedeems.toLocaleString()}
                icon={Ticket}
                iconBgClass="bg-green-50"
                iconColorClass="text-green-500"
              />
            </div>

            {/* Quick Category Filters Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-200/60 pb-4">
              <button
                onClick={() => setActiveFilter("ALL")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                  activeFilter === "ALL"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                All Brands ({data.partners.length})
              </button>
              <button
                onClick={() => setActiveFilter("Retail")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                  activeFilter === "Retail"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Retail
              </button>
              <button
                onClick={() => setActiveFilter("Food & Beverage")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                  activeFilter === "Food & Beverage"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Food & Beverage
              </button>
              <button
                onClick={() => setActiveFilter("Entertainment & Services")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                  activeFilter === "Entertainment & Services"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Entertainment & Services
              </button>
              <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
              <button
                onClick={() => setActiveFilter("STATUS_ACTIVE")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                  activeFilter === "STATUS_ACTIVE"
                    ? "bg-green-600 text-white border-green-600 shadow-xs"
                    : "bg-white text-green-600 border-slate-200 hover:bg-green-50/40"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveFilter("STATUS_SUSPENDED")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                  activeFilter === "STATUS_SUSPENDED"
                    ? "bg-red-600 text-white border-red-600 shadow-xs"
                    : "bg-white text-red-600 border-slate-200 hover:bg-red-50/40"
                }`}
              >
                Suspended
              </button>
            </div>

            {/* Partners Card Grid */}
            {filteredPartners.length === 0 ? (
              <div className="p-12 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Filter className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">
                    No matching partners found
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Try adjusting your search criteria or resetting filters.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPartners.map((partner) => {
                  const isActive = getPartnerActiveState(partner);
                  return (
                    <PartnerCard
                      key={partner.id}
                      partner={partner}
                      isActive={isActive}
                      onToggleStatus={() =>
                        handleToggleStatus(partner.id, isActive)
                      }
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Register Ally Dialog Modal Drawer */}
      <RegisterAllyDialog
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </main>
  );
}
