import React from "react";
import { TrendingUp } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgClass: string;
  iconColorClass: string;
  trend?: number;
}

export function KpiCard({
  title,
  value,
  unit,
  icon: Icon,
  iconBgClass,
  iconColorClass,
  trend
}: KpiCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 ${iconBgClass} ${iconColorClass} rounded-full flex items-center justify-center text-xl`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <span className="flex items-center text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-md">
            <TrendingUp className="w-3.5 h-3.5 mr-1" /> {trend}%
          </span>
        )}
      </div>
      <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
        {title}
      </p>
      <h2 className="text-3xl font-black text-slate-800">
        {value}{" "}
        {unit && <span className="text-lg text-slate-400 font-medium">{unit}</span>}
      </h2>
    </div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
        <div className="w-12 h-6 bg-slate-200 rounded-md"></div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
      <div className="h-8 bg-slate-200 rounded w-32"></div>
    </div>
  );
}
