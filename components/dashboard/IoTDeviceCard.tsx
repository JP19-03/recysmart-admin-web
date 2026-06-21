"use client";

import React from "react";
import { SmartBin } from "@/src/schemas";
import {
  Cpu,
  MapPin,
  Wifi,
  WifiOff,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  Lock,
  Play,
  Terminal,
  Power,
  Truck,
  RotateCw,
} from "lucide-react";

interface IoTDeviceCardProps {
  bin: SmartBin;
  onLogs?: () => void;
  onReboot?: () => void;
  onDispatch?: () => void;
  onPing?: () => void;
}

export function IoTDeviceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse flex flex-col h-70">
      <div className="p-5 border-b border-slate-100 flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-5 bg-slate-200 rounded w-28"></div>
          <div className="h-3.5 bg-slate-100 rounded w-44"></div>
        </div>
        <div className="h-6 bg-slate-200 rounded-full w-16"></div>
      </div>
      <div className="p-5 flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 bg-slate-200 rounded w-16"></div>
            <div className="h-3 bg-slate-200 rounded w-8"></div>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full w-full"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-14 bg-slate-50 rounded-lg border border-slate-100"></div>
          <div className="h-14 bg-slate-50 rounded-lg border border-slate-100"></div>
        </div>
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
        <div className="h-8 bg-slate-200 rounded flex-1"></div>
        <div className="h-8 bg-slate-200 rounded flex-1"></div>
      </div>
    </div>
  );
}

export function IoTDeviceCard({
  bin,
  onLogs,
  onReboot,
  onDispatch,
  onPing,
}: IoTDeviceCardProps) {
  const capacityPercentage =
    bin.maxCapacity > 0
      ? Math.round((bin.currentCapacity / bin.maxCapacity) * 100)
      : 0;

  const isOffline = bin.status === "MAINTENANCE";
  const isFull = bin.status === "FULL" || capacityPercentage >= 90;
  const isWarning =
    capacityPercentage >= 75 &&
    capacityPercentage < 90 &&
    bin.status !== "FULL";

  // Contextual border and highlight colors
  let cardClass = "bg-white border-slate-200 hover:shadow-md";
  let statusBadgeClass = "bg-green-50 text-green-600 border-green-200";
  let statusDotClass = "bg-green-500 animate-pulse";
  let progressColor = "bg-blue-500";
  let progressTextClass = "text-blue-600 font-bold";

  if (isOffline) {
    cardClass = "bg-slate-50 border-slate-200 opacity-75";
    statusBadgeClass = "bg-slate-200 text-slate-500 border-slate-300";
    statusDotClass = "bg-slate-400";
  } else if (isFull) {
    cardClass =
      "bg-white border-red-200 hover:shadow-md ring-1 ring-red-500/20";
    statusBadgeClass = "bg-green-50 text-green-600 border-green-200";
    progressColor = "bg-red-500";
    progressTextClass = "text-red-600 font-bold";
  } else if (isWarning) {
    cardClass =
      "bg-white border-amber-200 hover:shadow-md ring-1 ring-amber-500/20";
    statusBadgeClass = "bg-green-50 text-green-600 border-green-200";
    progressColor = "bg-amber-500";
    progressTextClass = "text-amber-600 font-bold";
  }

  return (
    <div
      className={`rounded-2xl border shadow-sm transition-all flex flex-col overflow-hidden relative ${cardClass}`}
    >
      {/* Warning Badge for Critical levels */}
      {!isOffline && isFull && (
        <div className="absolute -right-8 top-4 bg-red-500 text-white text-[9px] font-bold py-0.5 px-9 transform rotate-45 shadow-xs uppercase tracking-wider">
          Critical
        </div>
      )}

      {/* Header Info */}
      <div className="p-5 border-b border-slate-100 flex justify-between items-start pr-12">
        <div className="min-w-0">
          <h3 className="font-bold text-slate-800 text-base leading-tight truncate flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-slate-500" />
            {bin.id.substring(0, 8).toUpperCase()}
          </h3>
          <p className="text-xs text-slate-500 flex items-center mt-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
            {bin.locationName}
          </p>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border shrink-0 ${statusBadgeClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusDotClass}`}></span>
          {isOffline ? "Offline" : "Online"}
        </span>
      </div>

      {/* Capacity & Sensors Body */}
      <div className="p-5 flex-1 flex flex-col justify-center space-y-4">
        {isOffline ? (
          /* Offline content */
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-center h-20 bg-slate-100 rounded-lg border border-slate-200 border-dashed">
              <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <WifiOff className="w-4 h-4 text-slate-400" /> Connection Lost
              </p>
            </div>
            <div className="text-[10px] text-slate-400 text-center font-mono">
              Last seen: 4 hours ago via MQTT
            </div>
          </div>
        ) : (
          /* Active content */
          <>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Capacity Level
                </span>
                <span className={progressTextClass}>{capacityPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`${progressColor} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${capacityPercentage}%` }}
                ></div>
              </div>
              <p
                className={`text-[10px] mt-1 text-right font-semibold ${isFull ? "text-red-500" : "text-slate-400"}`}
              >
                Estimated: {bin.currentCapacity} / {bin.maxCapacity} bottles
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  Weight Sensor
                </p>
                <p className="text-xs font-bold text-slate-700 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  OK (HX711)
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                {isFull ? (
                  <>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      Door Motor
                    </p>
                    <p className="text-xs font-bold text-orange-600 mt-0.5 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      Locked
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      Vision AI
                    </p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      Ready
                    </p>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Actions Footer */}
      <div
        className={`p-4 border-t border-slate-100 flex justify-between gap-2 shrink-0 ${
          isFull
            ? "bg-red-50/50"
            : isOffline
              ? "bg-slate-100/50"
              : "bg-slate-50"
        }`}
      >
        {isOffline ? (
          <button
            onClick={onPing}
            className="flex-1 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" /> Ping Device
          </button>
        ) : isFull ? (
          <button
            onClick={onDispatch}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5" /> Dispatch Pickup
          </button>
        ) : (
          <>
            <button
              onClick={onLogs}
              className="flex-1 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-slate-400" /> Logs
            </button>
            <button
              onClick={onReboot}
              className="flex-1 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Power className="w-3.5 h-3.5 text-slate-400" /> Reboot
            </button>
          </>
        )}
      </div>
    </div>
  );
}
