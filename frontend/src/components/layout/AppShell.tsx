"use client";

import React, { ReactNode, useState } from "react";
import {
  Users,
  FileText,
  Clock,
  Calendar,
  Calculator,
  ShieldCheck,
  Bell,
  CheckCircle2,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

interface AppShellProps {
  children: ReactNode;
  activeNav: string;
  onNavigate: (navId: string) => void;
  title?: string;
  subtitle?: string;
  breadcrumbs?: { label: string; onClick?: () => void }[];
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeNav,
  onNavigate,
  title,
  breadcrumbs
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "employees", label: "Employees", icon: Users, badge: "5", group: "HR Operations" },
    { id: "contracts", label: "Contracts", icon: FileText, group: "HR Operations" },
    { id: "attendance", label: "Attendance", icon: Clock, group: "HR Operations" },
    { id: "time-off", label: "Time Off", icon: Calendar, badge: "1 Pending", group: "HR Operations" },
    { id: "payroll", label: "Payruns & Payslips", icon: Calculator, group: "Payroll Engine" },
    { id: "auth", label: "Auth Sign-In/Up", icon: ShieldCheck, group: "Access" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col md:flex-row antialiased font-sans">
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white shadow-sm z-30">
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0F2F1E] text-[#9FD067] flex items-center justify-center font-bold shadow-sm">
              ✦
            </div>
            <div>
              <div className="font-display font-bold text-base text-[#0F2F1E] tracking-tight leading-none">
                PeoplePay360
              </div>
              <span className="text-[10px] text-emerald-700 font-mono font-medium tracking-wide">
                CONNECTED HR & PAYROLL
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
          <div>
            <div className="px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
              HR Operations
            </div>
            <div className="space-y-1">
              {navItems.filter(i => i.group === "HR Operations").map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#0F2F1E] text-white shadow-sm font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#9FD067]" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badge.includes("Pending")
                            ? "bg-amber-100 text-amber-800 font-semibold"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Payroll Engine
            </div>
            <div className="space-y-1">
              {navItems.filter(i => i.group === "Payroll Engine").map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#0F2F1E] text-white shadow-sm font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#9FD067]" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
              System
            </div>
            <div className="space-y-1">
              {navItems.filter(i => i.group === "Access").map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#0F2F1E] text-white shadow-sm font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#9FD067]" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-200">
                HR
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-800 leading-tight">HR Manager</div>
                <div className="text-[10px] text-slate-400 truncate">hr@peoplepay.com</div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          </div>
        </div>
      </aside>

      <div className="md:hidden h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0F2F1E] text-[#9FD067] flex items-center justify-center font-bold text-xs">
            ✦
          </div>
          <span className="font-display font-bold text-sm text-[#0F2F1E]">PeoplePay360</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg border border-slate-200 text-slate-600"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 z-40">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs ${
                activeNav === item.id ? "bg-[#0F2F1E] text-white font-semibold" : "text-slate-700"
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-slate-400">PeoplePay360</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            {breadcrumbs && breadcrumbs.length > 0 ? (
              breadcrumbs.map((b, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                  {b.onClick ? (
                    <button
                      onClick={b.onClick}
                      className="font-medium text-slate-600 hover:text-slate-900 transition underline underline-offset-2"
                    >
                      {b.label}
                    </button>
                  ) : (
                    <span className="font-semibold text-[#0F2F1E]">{b.label}</span>
                  )}
                </React.Fragment>
              ))
            ) : (
              <span className="font-semibold text-[#0F2F1E]">{title || "HR Operations"}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Payroll Engine Connected</span>
            </div>
            <button className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};
