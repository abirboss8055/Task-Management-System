"use client";

import React, { useState } from "react";
import { CheckSquare, Clock, AlertCircle, ArrowUpRight, MessageSquare, Link as LinkIcon } from "lucide-react";
import EmployeeTaskModal, { TaskDetail } from "@/components/EmployeeTaskModal";
import { Priority, Status } from "@prisma/client";

export default function EmployeeDashboardPage() {
  // Sample production tasks for interactive preview
  const [tasks, setTasks] = useState<TaskDetail[]>([
    {
      ID: 101,
      Title: "Winter 2026 Panjabi Collection - Sample Fitting & Fabric QC",
      Description:
        "Inspect sleeve measurements, collar stiffness, and check thread integrity on the initial batch of 20 units before mass production approval.",
      Category: "Sample Fitting & QC",
      Priority: "HIGH" as Priority,
      Status: "IN_PROGRESS" as Status,
      Created_At: new Date(),
      Scheduled_Start_Date: new Date(),
      Manager: {
        Full_Name: "Captain Abir",
        Username: "captain",
      },
      Links: [
        { ID: 1, URL: "https://drive.google.com/tech-pack/winter-panjabi-v1.pdf" },
        { ID: 2, URL: "https://comradeslegacy.com/specs/qc-checklist" },
      ],
    },
    {
      ID: 102,
      Title: "Outdoor Campaign Catalog Shoot - Creative Layout Coordination",
      Description:
        "Coordinate with photographer Nokib regarding golden hour lighting and model styling for the heritage outerwear line.",
      Category: "Photoshoot & Creative",
      Priority: "MEDIUM" as Priority,
      Status: "SCHEDULED" as Status,
      Created_At: new Date(),
      Scheduled_Start_Date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      Manager: {
        Full_Name: "Captain Abir",
        Username: "captain",
      },
      Links: [{ ID: 3, URL: "https://pinterest.com/comrades-moodboard-2026" }],
    },
  ]);

  const [selectedTask, setSelectedTask] = useState<TaskDetail | null>(null);

  const handleStatusChange = (taskId: number, newStatus: Status) => {
    setTasks((prev) =>
      prev.map((t) => (t.ID === taskId ? { ...t, Status: newStatus } : t))
    );
    if (selectedTask && selectedTask.ID === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, Status: newStatus } : null));
    }
  };

  const myMetrics = [
    { label: "Assigned To Me", count: String(tasks.length), icon: CheckSquare, border: "border-navy" },
    {
      label: "In Progress",
      count: String(tasks.filter((t) => t.Status === "IN_PROGRESS").length),
      icon: Clock,
      border: "border-maroon",
    },
    {
      label: "Scheduled",
      count: String(tasks.filter((t) => t.Status === "SCHEDULED").length),
      icon: AlertCircle,
      border: "border-amber-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Modal Integration */}
      <EmployeeTaskModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onStatusChange={handleStatusChange}
      />

      <div className="border-b border-line pb-6">
        <div className="flex items-center space-x-2 text-xs font-bold tracking-widest text-maroon uppercase mb-1">
          <span>Comrades Legacy</span>
          <span>•</span>
          <span>Staff Operations</span>
        </div>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-navy">
          Employee Dashboard
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl tracking-wide">
          Click any assigned task to view production instructions, update status, and chat with your manager.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {myMetrics.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`bg-surface p-5 border border-line border-t-4 ${item.border}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                  {item.label}
                </span>
                <Icon className="w-4 h-4 text-navy/60" />
              </div>
              <div className="mt-4 text-3xl font-black text-navy font-mono">
                {item.count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assigned Tasks Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-navy">
            My Production Queue
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">
            Click card to open task modal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((t) => (
            <div
              key={t.ID}
              onClick={() => setSelectedTask(t)}
              className="bg-surface border border-line hover:border-navy p-5 cursor-pointer transition-colors group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-maroon bg-maroon-light px-2 py-0.5">
                    {t.Category}
                  </span>
                  <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 border border-navy/20 bg-ivory text-navy">
                    {t.Status}
                  </span>
                </div>

                <h3 className="text-sm font-bold uppercase tracking-tight text-navy group-hover:text-maroon transition-colors line-clamp-2">
                  {t.Title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {t.Description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center space-x-3">
                  {t.Links && t.Links.length > 0 && (
                    <span className="flex items-center space-x-1 font-mono">
                      <LinkIcon className="w-3 h-3 text-slate-400" />
                      <span>{t.Links.length}</span>
                    </span>
                  )}
                  <span className="flex items-center space-x-1">
                    <MessageSquare className="w-3 h-3 text-slate-400" />
                    <span>Chat</span>
                  </span>
                </div>

                <span className="inline-flex items-center text-maroon font-bold uppercase text-[10px] tracking-wider group-hover:translate-x-0.5 transition-transform">
                  <span>Open Task</span>
                  <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
