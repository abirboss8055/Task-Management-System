"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Users, ShieldAlert, ArrowLeftRight } from "lucide-react";

export default function ManagerNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: "Dashboard", href: "/manager/dashboard", icon: LayoutDashboard },
    { label: "Tasks", href: "/manager/tasks", icon: CheckSquare },
    { label: "Team", href: "/manager/team", icon: Users },
  ];

  return (
    <header className="w-full bg-navy text-surface border-b-2 border-maroon">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Editorial Title */}
          <div className="flex items-center space-x-6">
            <Link href="/manager/dashboard" className="flex flex-col">
              <span className="text-lg font-bold tracking-widest uppercase text-ivory">
                COMRADES LEGACY
              </span>
              <span className="text-[10px] tracking-wider uppercase text-slate-300 font-medium">
                Internal Ops • Manager Portal
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-1 pl-4 border-l border-white/20">
              {navLinks.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors rounded-none ${
                      isActive
                        ? "bg-maroon text-surface border-b-2 border-surface"
                        : "text-slate-200 hover:text-white hover:bg-navy-hover"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action / Role Badge / Switch View */}
          <div className="flex items-center space-x-4">
            <Link
              href="/employee/dashboard"
              className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase text-slate-300 hover:text-white border border-white/30 hover:border-white transition-colors"
              title="Switch to employee preview"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Employee View</span>
            </Link>

            <div className="flex items-center space-x-2 pl-3 border-l border-white/20">
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-maroon text-white border border-maroon-hover">
                MANAGER
              </span>
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                Captain
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t border-white/10 flex divide-x divide-white/10 bg-navy-hover">
        {navLinks.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-[11px] font-semibold tracking-wider uppercase ${
                isActive ? "bg-maroon text-white" : "text-slate-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
