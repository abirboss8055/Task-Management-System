import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EmployeeMyTasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 text-xs uppercase tracking-wider text-slate-500">
        <Link href="/employee/dashboard" className="flex items-center hover:text-navy">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
        </Link>
      </div>
      <div className="border-b border-line pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-navy">My Assigned Tasks</h1>
        <p className="text-xs text-slate-500 mt-1">Review active and completed tasks assigned to you.</p>
      </div>
      <div className="bg-surface border border-line p-12 text-center text-slate-500 text-xs uppercase tracking-wider">
        Assigned Tasks List Placeholder
      </div>
    </div>
  );
}
