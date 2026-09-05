"use client";

import React, { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Clock,
  Calendar,
  Calculator,
  ShieldCheck,
  Bell,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Menu,
  X,
  UserCheck,
  Sliders,
  Settings,
  Shield
} from "lucide-react";
import { UserRole } from "@/components/auth/AuthView";

interface AppShellProps {
  children: ReactNode;
  activeNav: string;
  onNavigate: (navId: string) => void;
  title?: string;
  subtitle?: string;
  breadcrumbs?: { label: string; onClick?: () => void }[];
  currentUserRole?: UserRole;
  currentUserName?: string;
  currentUserEmail?: string;
  onSignOut?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeNav,
  onNavigate,
  title,
  subtitle,
  breadcrumbs,
  currentUserRole = "hr_manager",
  currentUserName = "Elena Rostova",
  currentUserEmail = "hr.manager@peoplepay.com",
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Dynamic role-based navigation per Specification Section 3
  const getNavGroups = () => {
    // 1. EMPLOYEE: Own records only, no HR/Payroll admin
    if (currentUserRole === "employee") {
      return [
        {
          group: "Self-Service Access",
          items: [
            { id: "my-profile", label: "My Profile & Contract", icon: UserCheck, badge: "" },
            { id: "my-attendance", label: "My Attendance Logs", icon: Clock, badge: "Punches" },
            { id: "my-leaves", label: "My Leave Requests", icon: Calendar, badge: "3 Bal" },
            { id: "my-payslip", label: "My Monthly Payslip", icon: Calculator, badge: "₹57,500" }
          ]
        }
      ];
    }

    // 2. HR MANAGER: Full CRUD on HR modules, strictly NO payroll access
    if (currentUserRole === "hr_manager") {
      return [
        {
          group: "Overview",
          items: [
            { id: "dashboard", label: "HR Dashboard", icon: LayoutDashboard, badge: "" }
          ]
        },
        {
          group: "HR Operations (Full CRUD)",
          items: [
            { id: "employees", label: "Employee Directory", icon: Users, badge: "5" },
            { id: "contracts", label: "Contracts Hub", icon: FileText, badge: "" },
            { id: "attendance", label: "Attendance & OT", icon: Clock, badge: "" },
            { id: "time-off", label: "Time Off Approvals", icon: Calendar, badge: "12 Pending" }
          ]
        }
      ];
    }

    // 3. HR PAYROLL USER: HR Manager permissions + Payruns/Payslips CRUD, Salary Rules Read-Only
    if (currentUserRole === "hr_payroll_user") {
      return [
        {
          group: "Overview",
          items: [
            { id: "dashboard", label: "Operations Dashboard", icon: LayoutDashboard, badge: "" }
          ]
        },
        {
          group: "HR Operations (Full CRUD)",
          items: [
            { id: "employees", label: "Employee Directory", icon: Users, badge: "5" },
            { id: "contracts", label: "Contracts Hub", icon: FileText, badge: "" },
            { id: "attendance", label: "Attendance & OT", icon: Clock, badge: "" },
            { id: "time-off", label: "Time Off Approvals", icon: Calendar, badge: "12 Pending" }
          ]
        },
        {
          group: "Payroll Processing",
          items: [
            { id: "payroll", label: "Payruns & Payslips", icon: Calculator, badge: "CRU Access" }
          ]
        }
      ];
    }

    // 4. HR PAYROLL MANAGER: Full CRUD on HR and Payroll, Payruns & Salary Rules
    if (currentUserRole === "hr_payroll_manager") {
      return [
        {
          group: "Overview",
          items: [
            { id: "dashboard", label: "Executive Dashboard", icon: LayoutDashboard, badge: "" }
          ]
        },
        {
          group: "HR Operations (Full CRUD)",
          items: [
            { id: "employees", label: "Employee Directory", icon: Users, badge: "5" },
            { id: "contracts", label: "Contracts Hub", icon: FileText, badge: "" },
            { id: "attendance", label: "Attendance & OT", icon: Clock, badge: "" },
            { id: "time-off", label: "Time Off Approvals", icon: Calendar, badge: "12 Pending" }
          ]
        },
        {
          group: "Payroll Engine (Full Control)",
          items: [
            { id: "payroll", label: "Payroll Engine & Trace", icon: Calculator, badge: "Full CRUD" }
          ]
        }
      ];
    }

    // 5. ADMIN: Full access to all modules across platform + User management & Role assignment
    return [
      {
        group: "Overview",
        items: [
          { id: "dashboard", label: "Global Dashboard", icon: LayoutDashboard, badge: "" }
        ]
      },
      {
        group: "HR Operations (Full Access)",
        items: [
          { id: "employees", label: "Employee Directory", icon: Users, badge: "5" },
          { id: "contracts", label: "Contracts Hub", icon: FileText, badge: "" },
          { id: "attendance", label: "Attendance & OT", icon: Clock, badge: "" },
          { id: "time-off", label: "Time Off Approvals", icon: Calendar, badge: "12 Pending" }
        ]
      },
      {
        group: "Payroll Engine (Full Access)",
        items: [
          { id: "payroll", label: "Payroll Engine & Trace", icon: Calculator, badge: "Full Access" }
        ]
      },
      {
        group: "System Administration",
        items: [
          { id: "admin-roles", label: "User Roles & Permissions", icon: Shield, badge: "Admin Only" }
        ]
      }
    ];
  };

  const navGroups = getNavGroups();
  const allNavItems = navGroups.flatMap((g) => g.items);

  const getRoleDisplayName = () => {
    switch (currentUserRole) {
      case "employee":
        return "Employee (Aarav Mehta)";
      case "hr_manager":
        return "HR Operations Manager";
      case "hr_payroll_user":
        return "HR Payroll User (Specialist)";
      case "hr_payroll_manager":
        return "HR Payroll Manager (Director)";
      case "admin":
        return "System Administrator (Global)";
      default:
        return "Platform Member";
    }
  };

  const getRoleBadge = () => {
    switch (currentUserRole) {
      case "employee":
        return "EMPLOYEE";
      case "hr_manager":
        return "HR MANAGER";
      case "hr_payroll_user":
        return "HR PAYROLL USER";
      case "hr_payroll_manager":
        return "HR PAYROLL MGR";
      case "admin":
        return "ADMIN";
      default:
        return "USER";
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F2] text-[#1A1A1A] flex flex-col md:flex-row antialiased font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[#E8F3E6] bg-white shadow-xs z-30 sticky top-0 h-screen">
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#E8F3E6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0F2F1E] text-[#9FD067] flex items-center justify-center font-bold shadow-xs">
              ✦
            </div>
            <div>
              <div className="font-display font-bold text-base text-[#0F2F1E] tracking-tight leading-none font-serif">
                PeoplePay360
              </div>
              <span className="text-[10px] text-emerald-800 font-mono font-medium tracking-wide">
                EXPLAINABLE PAYROLL
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
          {navGroups.map((grp) => (
            <div key={grp.group}>
              <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                {grp.group}
              </div>
              <div className="space-y-1">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      suppressHydrationWarning
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#0F2F1E] text-white shadow-xs font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
                              : item.badge === "Admin Only"
                              ? "bg-purple-100 text-purple-800 font-bold"
                              : item.badge === "Read-Only"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-emerald-50 text-emerald-800"
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
          ))}
        </div>

        {/* Current Active Persona Widget & Sign Out */}
        <div className="p-3 border-t border-[#E8F3E6] bg-[#F6F7F2]/60 space-y-2">
          <div className="p-2.5 rounded-xl bg-white border border-[#E8F3E6] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-200 shrink-0">
                {currentUserRole === "employee"
                  ? "EM"
                  : currentUserRole === "hr_manager"
                  ? "HR"
                  : currentUserRole === "hr_payroll_user"
                  ? "PU"
                  : currentUserRole === "hr_payroll_manager"
                  ? "PM"
                  : "AD"}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-900 leading-tight truncate">
                  {currentUserName}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{currentUserEmail}</div>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold bg-[#E8F3E6] text-[#0F2F1E] px-1.5 py-0.5 rounded shrink-0">
              {getRoleBadge()}
            </span>
          </div>

          {onSignOut && (
            <button
              type="button"
              suppressHydrationWarning
              onClick={onSignOut}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#CBD2C4] bg-white text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-600" />
              <span>Sign Out to Landing</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden h-16 bg-white border-b border-[#E8F3E6] px-4 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0F2F1E] text-[#9FD067] flex items-center justify-center font-bold text-xs">
            ✦
          </div>
          <span className="font-display font-bold text-sm text-[#0F2F1E] font-serif">PeoplePay360</span>
        </div>
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg border border-slate-200 text-slate-600 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-3 z-40">
          <div className="text-xs font-semibold text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>{currentUserName}</span>
            <span className="text-[10px] font-mono font-bold bg-[#E8F3E6] text-[#0F2F1E] px-2 py-0.5 rounded">
              {getRoleBadge()}
            </span>
          </div>

          <div className="space-y-1">
            {allNavItems.map((item) => (
              <button
                key={item.id}
                type="button"
                suppressHydrationWarning
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer ${
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

          {onSignOut && (
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => {
                setMobileMenuOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-700 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out to Landing</span>
            </button>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#E8F3E6] bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          {/* Breadcrumbs / Page Title */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-slate-400">PeoplePay360</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            {breadcrumbs && breadcrumbs.length > 0 ? (
              breadcrumbs.map((b, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                  {b.onClick ? (
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={b.onClick}
                      className="font-medium text-slate-600 hover:text-slate-900 transition underline underline-offset-2 cursor-pointer"
                    >
                      {b.label}
                    </button>
                  ) : (
                    <span className="font-semibold text-[#0F2F1E]">{b.label}</span>
                  )}
                </React.Fragment>
              ))
            ) : (
              <span className="font-semibold text-[#0F2F1E]">{title || "Dashboard"}</span>
            )}
          </div>

          {/* Top Actions & Security Indicator */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3E6] border border-[#CBD2C4] text-[#0F2F1E] text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6845]" />
              <span>{getRoleDisplayName()}</span>
            </div>

            <button
              type="button"
              suppressHydrationWarning
              className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2E6845]" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content Body */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};
