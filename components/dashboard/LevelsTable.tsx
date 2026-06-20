"use client";

import { Level } from "@/src/schemas";
import {
  Crown,
  Trees,
  Leaf,
  Sprout,
  Pen,
  Plus,
  Layers,
  Globe,
} from "lucide-react";

interface LevelsTableProps {
  levels: Level[];
  isLoading?: boolean;
}

export function LevelRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-28"></div>
          <div className="h-3 bg-slate-100 rounded w-16"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-9 bg-slate-200 rounded w-28"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-slate-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="h-4 bg-slate-200 rounded w-6 ml-auto"></div>
      </td>
    </tr>
  );
}

export function LevelsTable({ levels, isLoading = false }: LevelsTableProps) {
  const getLevelStyling = (minPoints: number) => {
    if (minPoints >= 2500) {
      return {
        bg: "bg-blue-50 border-blue-400 text-blue-500 shadow-sm",
        icon: Globe,
      };
    }
    if (minPoints >= 1000) {
      return {
        bg: "bg-yellow-50 border-yellow-400 text-yellow-500 shadow-sm",
        icon: Crown,
      };
    }
    if (minPoints >= 500) {
      return {
        bg: "bg-emerald-50 border-emerald-500 text-emerald-500",
        icon: Trees,
      };
    }
    if (minPoints >= 100) {
      return {
        bg: "bg-amber-50 border-amber-600 text-amber-600",
        icon: Leaf,
      };
    }
    return {
      bg: "bg-slate-100 border-slate-300 text-slate-400",
      icon: Sprout,
    };
  };

  return (
    <div className="mb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Layers className="text-blue-500 w-5 h-5" /> User Progression Map
            (Levels)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Adjust the minimum lifetime points required to unlock each status
            tier.
          </p>
        </div>
        <button className="text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all border border-blue-100 flex items-center gap-1 cursor-pointer w-fit">
          <Plus className="w-4 h-4" /> Add Tier
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-widest font-semibold">
                <th className="px-6 py-4">Tier Name</th>
                <th className="px-6 py-4">Min. Points Required</th>
                <th className="px-6 py-4">Current Users</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <>
                  <LevelRowSkeleton />
                  <LevelRowSkeleton />
                  <LevelRowSkeleton />
                </>
              ) : levels.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No progression tiers defined.
                  </td>
                </tr>
              ) : (
                levels.map((level) => {
                  const levelStyling = getLevelStyling(level.minPointsRequired);
                  const LevelIcon = levelStyling.icon;
                  const isReadOnly =
                    level.minPointsRequired === 0 ||
                    level.name.toLowerCase().includes("beginner");

                  return (
                    <tr
                      key={level.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${levelStyling.bg}`}
                        >
                          <LevelIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {level.name}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">
                            ID: {level.id}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <input
                            type="number"
                            defaultValue={level.minPointsRequired}
                            readOnly={isReadOnly}
                            className={`w-24 px-3 py-1.5 border rounded text-slate-800 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                              isReadOnly
                                ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-white border-slate-300 hover:border-slate-400"
                            }`}
                          />
                          <span className="text-xs font-bold text-slate-400 ml-2 uppercase">
                            Pts
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-700">
                          {level.userCount.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">
                          users
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer inline-block ${
                            isReadOnly
                              ? "text-slate-200 cursor-not-allowed"
                              : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                          disabled={isReadOnly}
                          title="Edit Tier"
                        >
                          <Pen className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
