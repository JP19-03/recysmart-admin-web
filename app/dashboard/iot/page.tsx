"use client";

import React, { useState, useMemo } from "react";
import { useBins } from "@/src/hooks/useBins";
import { KpiCard, KpiCardSkeleton } from "@/components/dashboard/KpiCard";
import {
  IoTDeviceCard,
  IoTDeviceCardSkeleton,
} from "@/components/dashboard/IoTDeviceCard";
import { RegisterBinDialog } from "@/components/dashboard/RegisterBinDialog";
import { SmartBin, CreateSmartBinData } from "@/src/schemas";
import {
  Cpu,
  Wifi,
  AlertTriangle,
  Camera,
  Search,
  Bell,
  Plus,
  Grid,
  Map as MapIcon,
  X,
  Target,
  Navigation,
  Truck,
  Terminal,
  Power,
} from "lucide-react";

interface ToastState {
  message: string;
  type: "info" | "success" | "warning";
  visible: boolean;
}

export default function IotEdgeNetworkPage() {
  const { data, error, isLoading, isError } = useBins();
  
  // Navigation states
  const [viewMode, setViewMode] = useState<"GRID" | "MAP">("GRID");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ONLINE" | "OFFLINE" | "CRITICAL"
  >("ALL");

  // Selected bin detail for Map View popup
  const [selectedBinId, setSelectedBinId] = useState<string | null>(null);

  // Modal registration form state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // In-app interactive feedback toasts
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "info",
    visible: false,
  });

  const showToast = (
    message: string,
    type: "info" | "success" | "warning" = "info",
  ) => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  // Device actions mocks
  const handleLogs = (id: string, location: string) => {
    showToast(
      `Streaming logs from device: ${id.substring(0, 8).toUpperCase()}...`,
      "info",
    );
  };

  const handleReboot = (id: string, location: string) => {
    showToast(
      `Reboot signal sent to: ${id.substring(0, 8).toUpperCase()}`,
      "success",
    );
  };

  const handleDispatch = (location: string) => {
    showToast(`Collection crew dispatched to ${location}`, "warning");
  };

  const handlePing = (id: string) => {
    showToast(
      `Pinging ${id.substring(0, 8).toUpperCase()} via MQTT...`,
      "info",
    );
  };

  // Filter smart bins
  const filteredBins = useMemo(() => {
    if (!data) return [];
    return data.filter((bin) => {
      const capacityPercentage =
        bin.maxCapacity > 0
          ? Math.round((bin.currentCapacity / bin.maxCapacity) * 100)
          : 0;

      const isOffline = bin.status === "MAINTENANCE";
      const isCritical = bin.status === "FULL" || capacityPercentage >= 90;

      // Status Matches
      if (statusFilter === "OFFLINE" && !isOffline) return false;
      if (statusFilter === "ONLINE" && isOffline) return false;
      if (statusFilter === "CRITICAL" && !isCritical) return false;

      // Search matches
      const query = searchQuery.toLowerCase();
      return (
        bin.id.toLowerCase().includes(query) ||
        bin.locationName.toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery, statusFilter]);

  // Dynamically compute KPIs
  const computedKpis = useMemo(() => {
    if (!data) return { total: 0, online: 0, critical: 0, scansToday: 0 };

    let total = data.length;
    let online = 0;
    let critical = 0;
    let scanAccumulator = 0;

    data.forEach((bin) => {
      const pct =
        bin.maxCapacity > 0
          ? Math.round((bin.currentCapacity / bin.maxCapacity) * 100)
          : 0;
      if (bin.status !== "MAINTENANCE") {
        online++;
      }
      if (bin.status === "FULL" || pct >= 90) {
        critical++;
      }
      // Derive a dynamic realistic mock scan value based on bottle count
      scanAccumulator += bin.currentCapacity * 4 + (bin.maxCapacity % 17);
    });

    return {
      total,
      online,
      critical,
      scansToday: scanAccumulator + 1200, // Offset for global stats
    };
  }, [data]);

  // Coordinates Normalization for radar blueprint map view
  const mapCoordinates = useMemo(() => {
    if (filteredBins.length === 0) return [];

    let minLat = -12.052;
    let maxLat = -12.042;
    let minLng = -77.048;
    let maxLng = -77.038;

    // Check if coordinates stretch outside default bounds
    filteredBins.forEach((bin) => {
      if (bin.latitude < minLat) minLat = bin.latitude - 0.001;
      if (bin.latitude > maxLat) maxLat = bin.latitude + 0.001;
      if (bin.longitude < minLng) minLng = bin.longitude - 0.001;
      if (bin.longitude > maxLng) maxLng = bin.longitude + 0.001;
    });

    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;

    return filteredBins.map((bin) => {
      const top =
        latRange > 0 ? ((maxLat - bin.latitude) / latRange) * 100 : 50;
      const left =
        lngRange > 0 ? ((bin.longitude - minLng) / lngRange) * 100 : 50;

      return {
        ...bin,
        mapY: Math.max(8, Math.min(92, top)),
        mapX: Math.max(8, Math.min(92, left)),
      };
    });
  }, [filteredBins]);

  const selectedBin = useMemo(() => {
    return filteredBins.find((b) => b.id === selectedBinId) || null;
  }, [selectedBinId, filteredBins]);

  return (
    <main className="flex-1 flex flex-col overflow-hidden relative">
      {/* Toast Alert overlay */}
      {toast.visible && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-xl border flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5 duration-300 ${
            toast.type === "success"
              ? "bg-emerald-900 border-emerald-800 text-emerald-100"
              : toast.type === "warning"
                ? "bg-red-950 border-red-900 text-red-100"
                : "bg-slate-900 border-slate-800 text-slate-100"
          }`}
        >
          {toast.type === "warning" ? (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <Wifi className="w-5 h-5 text-green-400 shrink-0" />
          )}
          <span className="text-xs font-bold font-sans">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="py-4 sm:py-0 sm:h-20 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 gap-4 z-10 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            IoT Edge Network
          </h1>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            Monitor ESP32 hardware, AI camera status, and physical bin capacity.
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by Bin ID or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 w-full sm:w-64 text-slate-700 transition-all"
            />
          </div>

          {/* Grid/Map View Switcher */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode("GRID")}
              className={`p-1.5 rounded-md flex items-center justify-center cursor-pointer transition-all ${
                viewMode === "GRID"
                  ? "bg-white shadow-xs text-slate-800"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("MAP")}
              className={`p-1.5 rounded-md flex items-center justify-center cursor-pointer transition-all ${
                viewMode === "MAP"
                  ? "bg-white shadow-xs text-slate-800"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Map View"
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Register Trigger */}
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" /> Register ESP32
          </button>
        </div>
      </header>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
        {/* Error Alert */}
        {isError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm font-medium animate-in fade-in duration-300">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">Error loading IoT edge network data</p>
              <p className="opacity-90">
                {(error as any)?.message ||
                  "Could not retrieve Smart Bin connection details."}
              </p>
            </div>
          </div>
        )}

        {/* Loading Skeleton metrics */}
        {isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <KpiCardSkeleton />
              <KpiCardSkeleton />
              <KpiCardSkeleton />
              <KpiCardSkeleton />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <IoTDeviceCardSkeleton />
              <IoTDeviceCardSkeleton />
              <IoTDeviceCardSkeleton />
            </div>
          </>
        )}

        {/* Loaded Data */}
        {!isLoading && !isError && data && (
          <>
            {/* KPI Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KpiCard
                title="Total Deployed"
                value={`${computedKpis.total} Bins`}
                icon={Cpu}
                iconBgClass="bg-blue-50"
                iconColorClass="text-blue-500"
              />
              <KpiCard
                title="Online / Active"
                value={computedKpis.online}
                icon={Wifi}
                iconBgClass="bg-green-50"
                iconColorClass="text-green-500"
              />
              <KpiCard
                title="Needs Collection"
                value={computedKpis.critical}
                icon={AlertTriangle}
                iconBgClass="bg-red-50"
                iconColorClass="text-red-500"
              />
              <KpiCard
                title="AI Scans Today"
                value={computedKpis.scansToday.toLocaleString()}
                icon={Camera}
                iconBgClass="bg-purple-50"
                iconColorClass="text-purple-500"
              />
            </div>

            {/* Quick Status Filters toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-200/50 pb-4">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  statusFilter === "ALL"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                All Devices ({data.length})
              </button>
              <button
                onClick={() => setStatusFilter("ONLINE")}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  statusFilter === "ONLINE"
                    ? "bg-green-600 text-white border-green-600 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-green-50"
                }`}
              >
                Online ({computedKpis.online})
              </button>
              <button
                onClick={() => setStatusFilter("OFFLINE")}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  statusFilter === "OFFLINE"
                    ? "bg-slate-500 text-white border-slate-500 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Offline ({data.length - computedKpis.online})
              </button>
              <button
                onClick={() => setStatusFilter("CRITICAL")}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  statusFilter === "CRITICAL"
                    ? "bg-red-600 text-white border-red-600 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-red-50"
                }`}
              >
                Needs Pickup ({computedKpis.critical})
              </button>
            </div>

            {/* Grid View Mode */}
            {viewMode === "GRID" &&
              (filteredBins.length === 0 ? (
                <div className="p-16 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-xs">
                  <AlertTriangle className="w-12 h-12 text-slate-400" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">
                      No ESP32 devices found
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      No deployed bins match your search or filter
                      configuration.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBins.map((bin) => (
                    <IoTDeviceCard
                      key={bin.id}
                      bin={bin}
                      onLogs={() => handleLogs(bin.id, bin.locationName)}
                      onReboot={() => handleReboot(bin.id, bin.locationName)}
                      onDispatch={() => handleDispatch(bin.locationName)}
                      onPing={() => handlePing(bin.id)}
                    />
                  ))}
                </div>
              ))}

            {/* Map View Mode */}
            {viewMode === "MAP" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side: Campus Radar Simulator */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl relative h-130 overflow-hidden shadow-inner flex flex-col justify-between p-6">
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))]from-green-500/5 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-35 pointer-events-none"></div>

                  {/* Radar Ring Animation */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-120 h-120 border border-green-500/10 rounded-full animate-ping pointer-events-none duration-10000"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-green-500/10 rounded-full pointer-events-none"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-green-500/10 rounded-full pointer-events-none"></div>

                  {/* Header Legend */}
                  <div className="flex justify-between items-center z-10">
                    <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-500 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 font-mono">
                        University Campus Radar
                      </span>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-4 text-[10px] font-mono text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>{" "}
                        Online
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>{" "}
                        Full
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-500"></span>{" "}
                        Offline
                      </span>
                    </div>
                  </div>

                  {/* Mock Campus Zones Titles */}
                  <div className="absolute top-[18%] left-[20%] text-slate-600 text-[10px] font-bold font-mono tracking-widest pointer-events-none uppercase">
                    Science Block
                  </div>
                  <div className="absolute top-[28%] left-[70%] text-slate-600 text-[10px] font-bold font-mono tracking-widest pointer-events-none uppercase">
                    Central Library
                  </div>
                  <div className="absolute top-[65%] left-[25%] text-slate-600 text-[10px] font-bold font-mono tracking-widest pointer-events-none uppercase">
                    Engineering Block
                  </div>
                  <div className="absolute top-[75%] left-[68%] text-slate-600 text-[10px] font-bold font-mono tracking-widest pointer-events-none uppercase">
                    Cafeteria Zone B
                  </div>

                  {/* Coordinate Pin Nodes */}
                  {mapCoordinates.map((bin) => {
                    const capacityPercentage =
                      bin.maxCapacity > 0
                        ? Math.round(
                            (bin.currentCapacity / bin.maxCapacity) * 100,
                          )
                        : 0;

                    const isOffline = bin.status === "MAINTENANCE";
                    const isFull =
                      bin.status === "FULL" || capacityPercentage >= 90;

                    let pinColor =
                      "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]";
                    if (isOffline) pinColor = "bg-slate-500";
                    else if (isFull)
                      pinColor =
                        "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]";

                    return (
                      <button
                        key={bin.id}
                        onClick={() => setSelectedBinId(bin.id)}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 hover:scale-125 z-20 transition-all cursor-pointer group`}
                        style={{ top: `${bin.mapY}%`, left: `${bin.mapX}%` }}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full block border-2 border-slate-900 ${pinColor}`}
                        ></span>

                        {/* Inline Tiny Hover Tooltip */}
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 bg-slate-950 text-white font-mono text-[9px] px-1.5 py-0.5 rounded border border-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none">
                          {bin.locationName} ({capacityPercentage}%)
                        </span>
                      </button>
                    );
                  })}

                  {/* Radar coordinates info footer */}
                  <div className="z-10 flex justify-between text-[9px] font-mono text-slate-500">
                    <span>GPS FIX: ACTIVE (SBAS)</span>
                    <span>LAT: -12.0463 / LNG: -77.0427</span>
                  </div>
                </div>

                {/* Right Side: Marker Details Pane */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between h-130 shadow-sm">
                  {selectedBin ? (
                    <div className="flex-1 flex flex-col justify-between h-full">
                      {/* Top Header */}
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                              Selected Node Details
                            </span>
                            <h3 className="font-bold text-slate-800 text-lg mt-0.5">
                              {selectedBin.locationName}
                            </h3>
                            <p className="text-[11px] text-slate-500 font-mono mt-1">
                              ID: {selectedBin.id}
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedBinId(null)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Middle info content */}
                        <div className="space-y-4 border-t border-b border-slate-100 py-4 my-4">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 font-medium">
                              Status
                            </span>
                            <span
                              className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase border ${
                                selectedBin.status === "MAINTENANCE"
                                  ? "bg-slate-100 text-slate-500 border-slate-200"
                                  : "bg-green-50 text-green-600 border-green-200"
                              }`}
                            >
                              {selectedBin.status}
                            </span>
                          </div>

                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 font-medium">
                              Telemetry Coordinates
                            </span>
                            <span className="font-bold text-slate-700 font-mono">
                              {selectedBin.latitude.toFixed(4)},{" "}
                              {selectedBin.longitude.toFixed(4)}
                            </span>
                          </div>

                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 font-medium">
                              Max Limit Capacity
                            </span>
                            <span className="font-bold text-slate-700">
                              {selectedBin.maxCapacity} bottles
                            </span>
                          </div>

                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 font-medium">
                              Current Deposits
                            </span>
                            <span className="font-bold text-slate-700">
                              {selectedBin.currentCapacity} bottles
                            </span>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                                Capacity Fill Rate
                              </span>
                              <span className="font-bold text-slate-800">
                                {Math.round(
                                  (selectedBin.currentCapacity /
                                    selectedBin.maxCapacity) *
                                    100,
                                )}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full ${
                                  selectedBin.status === "MAINTENANCE"
                                    ? "bg-slate-400"
                                    : Math.round(
                                          (selectedBin.currentCapacity /
                                            selectedBin.maxCapacity) *
                                            100,
                                        ) >= 90
                                      ? "bg-red-500"
                                      : "bg-blue-500"
                                }`}
                                style={{
                                  width: `${Math.round(
                                    (selectedBin.currentCapacity /
                                      selectedBin.maxCapacity) *
                                      100,
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action trigger footer */}
                      <div className="space-y-2 mt-auto">
                        {selectedBin.status === "MAINTENANCE" ? (
                          <button
                            onClick={() => handlePing(selectedBin.id)}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Target className="w-4 h-4" /> Send Wakeup Ping
                          </button>
                        ) : Math.round(
                            (selectedBin.currentCapacity /
                              selectedBin.maxCapacity) *
                              100,
                          ) >= 90 ? (
                          <button
                            onClick={() =>
                              handleDispatch(selectedBin.locationName)
                            }
                            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Truck className="w-4 h-4" /> Dispatch Collection
                            Crew
                          </button>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() =>
                                handleLogs(
                                  selectedBin.id,
                                  selectedBin.locationName,
                                )
                              }
                              className="py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-center gap-1 transition-all cursor-pointer"
                            >
                              <Terminal className="w-3.5 h-3.5 text-slate-400" />{" "}
                              Read Logs
                            </button>
                            <button
                              onClick={() =>
                                handleReboot(
                                  selectedBin.id,
                                  selectedBin.locationName,
                                )
                              }
                              className="py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-750 flex items-center justify-center gap-1 transition-all cursor-pointer"
                            >
                              <Power className="w-3.5 h-3.5 text-slate-400" />{" "}
                              Reboot Unit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 gap-2.5">
                      <Navigation className="w-10 h-10 text-slate-300 animate-pulse" />
                      <div>
                        <h4 className="font-semibold text-slate-600 text-sm">
                          No node selected
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-50 mx-auto">
                          Click any coordinate pin on the radar map to display
                          device parameters.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Register ESP32 Glassmorphic Modal */}
      <RegisterBinDialog
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </main>
  );
}
