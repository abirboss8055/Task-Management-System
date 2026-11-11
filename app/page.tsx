import Link from "next/link";
import { ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-ivory">
      <div className="max-w-xl w-full bg-surface border-2 border-navy p-8 sm:p-10">
        <div className="text-center space-y-2 border-b border-line pb-6">
          <span className="text-[11px] font-bold tracking-widest uppercase text-maroon">
            Comrades Legacy
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-navy">
            Task Management System
          </h1>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Internal operations portal for production management, schedule coordination, and team task tracking.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center mb-2">
            Select Portal Preview
          </div>

          <Link
            href="/manager/dashboard"
            className="flex items-center justify-between p-4 bg-ivory border border-navy hover:bg-navy hover:text-white transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-navy text-white group-hover:bg-maroon transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold uppercase tracking-wider">
                  Manager Portal
                </div>
                <div className="text-[11px] text-slate-500 group-hover:text-slate-200">
                  Dashboard, Task Kanban, Team Overview
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-maroon group-hover:text-white" />
          </Link>

          <Link
            href="/employee/dashboard"
            className="flex items-center justify-between p-4 bg-ivory border border-line hover:border-navy hover:bg-surface transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-700 text-white group-hover:bg-navy transition-colors">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-navy">
                  Employee Portal
                </div>
                <div className="text-[11px] text-slate-500">
                  Assigned Tasks, Status Updates, Comments
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-navy" />
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-line text-center text-[10px] text-slate-400 font-mono uppercase tracking-wider">
          Modern Heritage Editorial System • Flat Design • Sharp Edges
        </div>
      </div>
    </div>
  );
}
