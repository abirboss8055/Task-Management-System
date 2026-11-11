"use client";

import React, { useState, useEffect } from "react";
import {
  ListTodo,
  Clock,
  CalendarCheck2,
  CheckCircle2,
  Plus,
  SlidersHorizontal,
  Kanban,
  FileQuestion,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import NewTaskModal from "@/components/NewTaskModal";
import FestivalCalendar from "@/components/FestivalCalendar";
import { checkTopPerformersAction } from "@/actions/task-actions";

export default function ManagerDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FEATURE 1: Top Performer Toast Check (Fires only once per session)
  useEffect(() => {
    const hasFiredThisSession = sessionStorage.getItem("top_performer_toast_fired");

    if (!hasFiredThisSession) {
      checkTopPerformersAction().then((performers) => {
        if (performers && performers.length > 0) {
          performers.forEach((performer) => {
            toast(`🔥 ${performer.fullName} is on fire! 5 tasks completed this week.`, {
              description: "High velocity production throughput recorded across this week's queue.",
              duration: 7000,
            });
          });
          sessionStorage.setItem("top_performer_toast_fired", "true");
        }
      });
    }
  }, []);

  // Metrics overview
  const metrics = [
    {
      id: "total",
      label: "TOTAL TASKS",
      count: "24",
      subtext: "Across all categories",
      icon: ListTodo,
      borderColor: "border-navy",
    },
    {
      id: "in_progress",
      label: "IN PROGRESS",
      count: "7",
      subtext: "Active production",
      icon: Clock,
      borderColor: "border-maroon",
    },
    {
      id: "scheduled",
      label: "SCHEDULED",
      count: "5",
      subtext: "Upcoming campaigns",
      icon: CalendarCheck2,
      borderColor: "border-amber-700",
    },
    {
      id: "done",
      label: "COMPLETED",
      count: "12",
      subtext: "Completed this month",
      icon: CheckCircle2,
      borderColor: "border-emerald-800",
    },
  ];

  // Kanban Columns
  const kanbanColumns = [
    { key: "PENDING", title: "PENDING", count: 0, tag: "Awaiting Action" },
    { key: "SCHEDULED", title: "SCHEDULED", count: 0, tag: "Queued Starts" },
    { key: "IN_PROGRESS", title: "IN PROGRESS", count: 0, tag: "In Production" },
    { key: "DONE", title: "DONE", count: 0, tag: "Archived Complete" },
  ];

  return (
    <div className="space-y-8">
      {/* Modal Integration */}
      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          console.log("Task successfully created!");
        }}
      />

      {/* Editorial Page Header */}
      <div className="border-b border-line pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold tracking-widest text-maroon uppercase mb-1">
            <span>Comrades Legacy</span>
            <span>•</span>
            <span>Internal Task Management</span>
          </div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-navy">
            Manager Operations Dashboard
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl tracking-wide">
            Real-time apparel production pipelines, campaign schedules, and cross-team workflows.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="inline-flex items-center space-x-2 bg-surface text-navy px-4 py-2.5 text-xs font-bold uppercase tracking-wider border border-navy hover:bg-ivory transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-maroon text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-maroon hover:bg-maroon-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Metric Grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-navy/70">
            Performance Overview
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">Status: Live Preview</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`bg-surface p-5 border border-line border-t-4 ${item.borderColor} flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                    {item.label}
                  </span>
                  <Icon className="w-4 h-4 text-navy/60" />
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-black text-navy tracking-tight font-mono">
                    {item.count}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">
                    {item.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURE 2: Festival Calendar Widget */}
      <section>
        <FestivalCalendar />
      </section>

      {/* Kanban Board Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-line pb-3 gap-2">
          <div className="flex items-center space-x-2">
            <Kanban className="w-4 h-4 text-maroon" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy">
              Task Kanban Board
            </h2>
          </div>
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
            Category: <span className="font-bold text-navy">All Departments</span>
          </div>
        </div>

        {/* Kanban Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => (
            <div
              key={col.key}
              className="bg-surface border border-line flex flex-col min-h-[440px]"
            >
              {/* Column Header */}
              <div className="bg-ivory border-b border-line px-4 py-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-navy">
                    {col.title}
                  </h3>
                  <span className="text-[10px] text-slate-500 tracking-wide">
                    {col.tag}
                  </span>
                </div>
                <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold font-mono bg-navy text-surface border border-navy">
                  {col.count}
                </span>
              </div>

              {/* Column Empty State */}
              <div className="flex-1 p-5 flex flex-col items-center justify-center text-center bg-surface">
                <div className="w-12 h-12 border border-dashed border-line bg-ivory flex items-center justify-center mb-3 text-navy/40">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-navy uppercase tracking-wider">
                  No {col.title.toLowerCase()} tasks
                </p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[180px]">
                  Tasks assigned or moved to this status will appear here.
                </p>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 inline-flex items-center space-x-1.5 px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-maroon hover:text-white border border-maroon hover:bg-maroon transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Status / Action Notice */}
      <div className="bg-surface border-2 border-line p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-ivory border border-line text-maroon">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
              Board Standing by for Production Tasks
            </h4>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Tasks created via the &ldquo;New Task&rdquo; button are saved directly to your Hostinger MySQL database.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="whitespace-nowrap px-4 py-2 text-xs font-bold uppercase tracking-wider bg-navy text-white hover:bg-navy-hover transition-colors"
        >
          Create New Task
        </button>
      </div>
    </div>
  );
}
