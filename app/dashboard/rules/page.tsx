"use client";

import { useLevels } from "@/src/hooks/useLevels";
import { LevelsTable } from "@/components/dashboard/LevelsTable";
import { BadgeCard } from "@/components/dashboard/BadgeCard";
import { CloudUpload, AlertTriangle, Medal } from "lucide-react";

export default function GamificationRulesPage() {
  const { data, error, isLoading, isError } = useLevels();

  const badges = [
    {
      emoji: "🌱",
      title: "First Recycle",
      description:
        "Awarded to citizens when they complete their first successful AI validation.",
      emojiBgClass: "bg-emerald-50 text-emerald-500",
      emojiBorderClass: "border-emerald-100",
      eventTrigger: "session.completed",
      ruleCode: "(validBottles >= 1)",
    },
    {
      emoji: "💯",
      title: "100 Points Club",
      description:
        "A major milestone indicating sustained user retention and app engagement.",
      emojiBgClass: "bg-red-50 text-red-500",
      emojiBorderClass: "border-red-100",
      eventTrigger: "session.completed",
      ruleCode: "(lifetimeEarned >= 100)",
    },
    {
      emoji: "🏋️",
      title: "Heavy Lifter",
      description:
        "Awarded to power users depositing large volumes in a single smart bin session.",
      emojiBgClass: "bg-blue-50 text-blue-500",
      emojiBorderClass: "border-blue-100",
      eventTrigger: "session.completed",
      ruleCode: "(validBottles >= 5)",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/50 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gamification Engine
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Configure progression thresholds and event-driven achievements.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Sync: NATS Broker Active
          </span>
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0">
            <CloudUpload className="w-4 h-4" /> Deploy Rules
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {isError && (
        <div className="p-8 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-lg">
              Error loading levels map
            </h4>
            <p className="text-sm text-slate-500 mt-1">
              {(error as any)?.message ||
                "Could not retrieve gamification progression metrics."}
            </p>
          </div>
        </div>
      )}

      {!isError && (
        <LevelsTable levels={data || []} isLoading={isLoading} />
      )}

      {/* Badges Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Medal className="text-purple-500 w-5 h-5" /> Event-Driven
            Achievements (Badges)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Read-only view of internal business rules triggered by the IoT edge
            network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, idx) => (
            <BadgeCard
              key={idx}
              emoji={badge.emoji}
              title={badge.title}
              description={badge.description}
              emojiBgClass={badge.emojiBgClass}
              emojiBorderClass={badge.emojiBorderClass}
              eventTrigger={badge.eventTrigger}
              ruleCode={badge.ruleCode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
