"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Calendar,
  Clock,
  FileText,
  Calculator,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  RefreshCw,
  Download,
  Building2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  X,
  ExternalLink,
  Sun,
  Moon
} from "lucide-react";
import { UserRole } from "@/components/auth/AuthView";

interface PayrollDashboardViewProps {
  currentUserRole?: UserRole;
  onNavigate?: (navId: string) => void;
  onNavigateToStructures?: () => void;
  onNavigateToPayruns?: () => void;
}

// Mock Multi-Model Aggregated Data
interface PeriodData {
  period: string;
  totalNetSalary: string;
  netSalaryNumeric: number;
  salaryChangePercent: string;
  payslipsGenerated: number;
  payslipsPaid: number;
  payslipsPending: number;
  payslipsDone: number;
  payslipsWarning: number;
  avgSalaryPerEmployee: string;
  avgSalaryNumeric: number;
  approvedTimeOffDays: number;
  attendanceHealth: number;
  deptCosts: {
    dept: string;
    amount: string;
    amountNumeric: number;
    headcount: number;
    color: string;
  }[];
  monthlyTrend: {
    month: string;
    amountLakhs: number;
    formatted: string;
    isCurrent?: boolean;
  }[];
  attendanceStats: {
    present: number;
    late: number;
    absent: number;
    missingCheckouts: number;
    manualEdits: number;
    attendanceAvg: number;
    overtimeHours: number;
  };
  timeOffBreakdown: {
    type: string;
    approvedDays: number;
    pending: number;
    remainingBalance: string;
    badgeColor: string;
  }[];
  departmentBreakdown: {
    dept: string;
    headcount: number;
    monthlySalary: string;
    manager: string;
  }[];
  alerts: {
    id: string;
    type: "bank" | "duplicate" | "draft" | "contract";
    title: string;
    severity: "danger" | "warning" | "info";
    detail: string;
    action: string;
    resolved: boolean;
  }[];
}

const PERIOD_DATA_MAP: Record<string, PeriodData> = {
  "Sep 2026": {
    period: "Sep 2026",
    totalNetSalary: "₹ 18.4L",
    netSalaryNumeric: 1840000,
    salaryChangePercent: "+2.8% vs previous month",
    payslipsGenerated: 148,
    payslipsPaid: 142,
    payslipsPending: 6,
    payslipsDone: 4,
    payslipsWarning: 2,
    avgSalaryPerEmployee: "₹ 12,432",
    avgSalaryNumeric: 12432,
    approvedTimeOffDays: 34,
    attendanceHealth: 94,
    deptCosts: [
      { dept: "HR", amount: "₹ 440k", amountNumeric: 440000, headcount: 8, color: "#0F2F1E" },
      { dept: "Sales", amount: "₹ 750k", amountNumeric: 750000, headcount: 22, color: "#0F2F1E" },
      { dept: "Support", amount: "₹ 410k", amountNumeric: 410000, headcount: 14, color: "#0F2F1E" },
      { dept: "Finance", amount: "₹ 530k", amountNumeric: 530000, headcount: 12, color: "#0F2F1E" },
      { dept: "IT", amount: "₹ 970k", amountNumeric: 970000, headcount: 18, color: "#0F2F1E" }
    ],
    monthlyTrend: [
      { month: "Apr", amountLakhs: 15.2, formatted: "₹15.2L" },
      { month: "May", amountLakhs: 16.1, formatted: "₹16.1L" },
      { month: "Jun", amountLakhs: 16.8, formatted: "₹16.8L" },
      { month: "Jul", amountLakhs: 17.4, formatted: "₹17.4L" },
      { month: "Aug", amountLakhs: 17.9, formatted: "₹17.9L" },
      { month: "Sep", amountLakhs: 18.4, formatted: "18.4L", isCurrent: true }
    ],
    attendanceStats: {
      present: 84,
      late: 18,
      absent: 4,
      missingCheckouts: 5,
      manualEdits: 7,
      attendanceAvg: 96,
      overtimeHours: 142
    },
    timeOffBreakdown: [
      { type: "Paid Time Off", approvedDays: 24, pending: 3, remainingBalance: "118 Days", badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200" },
      { type: "Sick Leave", approvedDays: 6, pending: 1, remainingBalance: "N/A", badgeColor: "bg-blue-50 text-blue-800 border-blue-200" },
      { type: "Comp Off", approvedDays: 4, pending: 2, remainingBalance: "11 Days", badgeColor: "bg-purple-50 text-purple-800 border-purple-200" }
    ],
    departmentBreakdown: [
      { dept: "IT", headcount: 18, monthlySalary: "₹ 4.3L", manager: "Dev Anand" },
      { dept: "Sales", headcount: 22, monthlySalary: "₹ 5.8L", manager: "Rohan Verma" },
      { dept: "HR", headcount: 8, monthlySalary: "₹ 1.9L", manager: "Elena Rostova" },
      { dept: "Support", headcount: 14, monthlySalary: "₹ 2.5L", manager: "Priya Sharma" }
    ],
    alerts: [
      {
        id: "alert-1",
        type: "bank",
        title: "2 employees missing bank account",
        severity: "danger",
        detail: "Pooja Hegde and Vikram Rao require verified IFSC & account numbers before disbursement.",
        action: "Assign Bank",
        resolved: false
      },
      {
        id: "alert-2",
        type: "duplicate",
        title: "1 duplicate payslip warning",
        severity: "warning",
        detail: "Duplicate wage line generated for EMP-103 under overlapping contract dates.",
        action: "Deduplicate",
        resolved: false
      },
      {
        id: "alert-3",
        type: "draft",
        title: "4 drafts still not validated",
        severity: "warning",
        detail: "Recent additions in Sales team have unverified overtime hours.",
        action: "Validate Batch",
        resolved: false
      },
      {
        id: "alert-4",
        type: "contract",
        title: "3 contracts expiring this month",
        severity: "info",
        detail: "Fixed-term consultant contracts for IT specialists reach expiration on Sep 30.",
        action: "Review Renewals",
        resolved: false
      }
    ]
  },
  "Aug 2026": {
    period: "Aug 2026",
    totalNetSalary: "₹ 17.9L",
    netSalaryNumeric: 1790000,
    salaryChangePercent: "+1.9% vs previous month",
    payslipsGenerated: 146,
    payslipsPaid: 146,
    payslipsPending: 0,
    payslipsDone: 0,
    payslipsWarning: 0,
    avgSalaryPerEmployee: "₹ 12,260",
    avgSalaryNumeric: 12260,
    approvedTimeOffDays: 29,
    attendanceHealth: 96,
    deptCosts: [
      { dept: "HR", amount: "₹ 430k", amountNumeric: 430000, headcount: 8, color: "#0F2F1E" },
      { dept: "Sales", amount: "₹ 730k", amountNumeric: 730000, headcount: 21, color: "#0F2F1E" },
      { dept: "Support", amount: "₹ 400k", amountNumeric: 400000, headcount: 14, color: "#0F2F1E" },
      { dept: "Finance", amount: "₹ 520k", amountNumeric: 520000, headcount: 12, color: "#0F2F1E" },
      { dept: "IT", amount: "₹ 950k", amountNumeric: 950000, headcount: 18, color: "#0F2F1E" }
    ],
    monthlyTrend: [
      { month: "Apr", amountLakhs: 15.2, formatted: "₹15.2L" },
      { month: "May", amountLakhs: 16.1, formatted: "₹16.1L" },
      { month: "Jun", amountLakhs: 16.8, formatted: "₹16.8L" },
      { month: "Jul", amountLakhs: 17.4, formatted: "₹17.4L" },
      { month: "Aug", amountLakhs: 17.9, formatted: "17.9L", isCurrent: true },
      { month: "Sep", amountLakhs: 18.4, formatted: "₹18.4L" }
    ],
    attendanceStats: {
      present: 86,
      late: 14,
      absent: 2,
      missingCheckouts: 2,
      manualEdits: 4,
      attendanceAvg: 97,
      overtimeHours: 128
    },
    timeOffBreakdown: [
      { type: "Paid Time Off", approvedDays: 20, pending: 0, remainingBalance: "142 Days", badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200" },
      { type: "Sick Leave", approvedDays: 5, pending: 0, remainingBalance: "N/A", badgeColor: "bg-blue-50 text-blue-800 border-blue-200" },
      { type: "Comp Off", approvedDays: 4, pending: 0, remainingBalance: "15 Days", badgeColor: "bg-purple-50 text-purple-800 border-purple-200" }
    ],
    departmentBreakdown: [
      { dept: "IT", headcount: 18, monthlySalary: "₹ 4.2L", manager: "Dev Anand" },
      { dept: "Sales", headcount: 21, monthlySalary: "₹ 5.6L", manager: "Rohan Verma" },
      { dept: "HR", headcount: 8, monthlySalary: "₹ 1.9L", manager: "Elena Rostova" },
      { dept: "Support", headcount: 14, monthlySalary: "₹ 2.4L", manager: "Priya Sharma" }
    ],
    alerts: []
  }
};

export const PayrollDashboardView: React.FC<PayrollDashboardViewProps> = ({
  currentUserRole = "hr_payroll_manager",
  onNavigate,
  onNavigateToStructures,
  onNavigateToPayruns
}) => {
  // State for Filters
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Sep 2026");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments");
  const [selectedEmployeeType, setSelectedEmployeeType] = useState<string>("All Types");
  const [selectedCompany, setSelectedCompany] = useState<string>("OKP Pvt Ltd");

  // Visual Theme mode: Default to Clean White Theme per user request
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Active top sub-nav tab
  const [activeSubNav, setActiveSubNav] = useState<"HR" | "Employees" | "Attendance" | "Time Off" | "Payroll">("Payroll");

  // Alert Resolution State
  const [alertsState, setAlertsState] = useState(PERIOD_DATA_MAP["Sep 2026"].alerts);
  const [selectedAlertModal, setSelectedAlertModal] = useState<string | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Active Data Slice
  const rawData = PERIOD_DATA_MAP[selectedPeriod] || PERIOD_DATA_MAP["Sep 2026"];

  // Filtered Dept Costs
  const filteredDeptCosts = useMemo(() => {
    if (selectedDepartment === "All Departments") {
      return rawData.deptCosts;
    }
    return rawData.deptCosts.filter((d) => d.dept.toLowerCase() === selectedDepartment.toLowerCase());
  }, [rawData, selectedDepartment]);

  // Max Cost for relative bar height
  const maxDeptCost = Math.max(...rawData.deptCosts.map((d) => d.amountNumeric), 1000000);

  const handleResolveAlert = (id: string, title: string) => {
    setAlertsState((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
    setSelectedAlertModal(null);
    setNotificationToast(`Resolved: ${title}`);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const handleSubNavClick = (tab: "HR" | "Employees" | "Attendance" | "Time Off" | "Payroll") => {
    setActiveSubNav(tab);
    if (!onNavigate) return;
    if (tab === "HR") onNavigate("dashboard");
    if (tab === "Employees") onNavigate("employees");
    if (tab === "Attendance") onNavigate("attendance");
    if (tab === "Time Off") onNavigate("time-off");
    if (tab === "Payroll") onNavigate("payroll-dashboard");
  };

  const activeAlert = alertsState.find((a) => a.id === selectedAlertModal);

  return (
    <div
      className={`min-h-screen rounded-3xl transition-colors duration-300 font-sans p-4 sm:p-6 lg:p-8 space-y-6 ${
        isDarkMode
          ? "bg-[#0D1117] text-slate-100 border border-slate-800 shadow-2xl"
          : "bg-white text-slate-900 border border-slate-200/90 shadow-xs"
      }`}
    >
      {/* ════════════════════════════════════════════════════════════════════════
          TOP CHALLENGE HEADER & SUB-NAV TABS (Matching Wireframe Section 6)
         ════════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div
          className={`flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4 ${
            isDarkMode ? "border-slate-800/80" : "border-slate-100"
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-lg font-bold font-serif tracking-tight flex items-center gap-1.5 ${
                  isDarkMode ? "text-white" : "text-[#0F2F1E]"
                }`}
              >
                <span className={isDarkMode ? "text-[#9FD067]" : "text-emerald-700"}>6)</span> Payroll Dashboard
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                  isDarkMode
                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                }`}
              >
                Multi-Model Aggregation
              </span>
            </div>
            <p
              className={`text-xs mt-1 font-mono ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Dashboard challenge: combine Payroll with HR data from multiple models and present useful insights with cards, charts, and summaries.
            </p>
          </div>

          {/* Theme Switcher & Actions */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDarkMode
                  ? "bg-slate-800/90 text-slate-200 hover:bg-slate-700 border border-slate-700"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs"
              }`}
              title="Toggle Dark / White Theme"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>White Theme</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Dark Sleek</span>
                </>
              )}
            </button>

            {onNavigateToPayruns && (
              <button
                type="button"
                suppressHydrationWarning
                onClick={onNavigateToPayruns}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0F2F1E] text-[#9FD067] hover:bg-[#1A452C] border border-emerald-900/50 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Payrun Flow →</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Sub-Nav Tabs: [HR] [Employees] [Attendance] [Time Off] [Payroll] ── */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(["HR", "Employees", "Attendance", "Time Off", "Payroll"] as const).map((tab) => {
            const isActive = activeSubNav === tab;
            return (
              <button
                key={tab}
                type="button"
                suppressHydrationWarning
                onClick={() => handleSubNavClick(tab)}
                className={`px-4 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                  isActive
                    ? isDarkMode
                      ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-xs ring-1 ring-indigo-500/30"
                      : "bg-[#0F2F1E] text-white shadow-xs"
                    : isDarkMode
                    ? "bg-slate-900/70 text-slate-400 border border-slate-800/80 hover:bg-slate-800 hover:text-slate-200"
                    : "bg-slate-100/80 text-slate-700 border border-slate-200 hover:bg-slate-200/80"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          MAIN VIEW TITLE & SUMMARY INTRO
         ════════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-1">
        <h1
          className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight ${
            isDarkMode ? "text-white" : "text-[#0F2F1E]"
          }`}
        >
          Payroll Dashboard
        </h1>
        <p
          className={`text-xs sm:text-sm ${
            isDarkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Dashboard should help payroll/HR users understand payments, staffing impact, leave patterns, and attendance quality for the selected period.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          FILTER CONTROLS BAR (Period, Department, Employee Type, Company)
         ════════════════════════════════════════════════════════════════════════ */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isDarkMode
            ? "bg-[#161D27] border-slate-800/90 shadow-inner"
            : "bg-slate-50/70 border-slate-200/80 shadow-2xs"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 1. Period Selector */}
          <div className="space-y-1">
            <label
              className={`text-[11px] font-mono uppercase tracking-wider block font-semibold ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Period
            </label>
            <div className="relative">
              <select
                suppressHydrationWarning
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={`w-full py-2 pl-3 pr-8 rounded-xl font-mono font-semibold text-xs border appearance-none focus:outline-hidden focus:ring-2 cursor-pointer ${
                  isDarkMode
                    ? "bg-[#0D1117] border-slate-700 text-slate-100 focus:ring-indigo-500/30"
                    : "bg-white border-slate-200 text-slate-900 focus:ring-emerald-500/20 shadow-2xs"
                }`}
              >
                <option value="Sep 2026">Sep 2026</option>
                <option value="Aug 2026">Aug 2026</option>
                <option value="Jul 2026">Jul 2026</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Department Selector */}
          <div className="space-y-1">
            <label
              className={`text-[11px] font-mono uppercase tracking-wider block font-semibold ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Department
            </label>
            <div className="relative">
              <select
                suppressHydrationWarning
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className={`w-full py-2 pl-3 pr-8 rounded-xl font-medium text-xs border appearance-none focus:outline-hidden focus:ring-2 cursor-pointer ${
                  isDarkMode
                    ? "bg-[#0D1117] border-slate-700 text-slate-100 focus:ring-indigo-500/30"
                    : "bg-white border-slate-200 text-slate-900 focus:ring-emerald-500/20 shadow-2xs"
                }`}
              >
                <option value="All Departments">All Departments</option>
                <option value="IT">IT</option>
                <option value="Sales">Sales</option>
                <option value="Support">Support</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3. Employee Type Selector */}
          <div className="space-y-1">
            <label
              className={`text-[11px] font-mono uppercase tracking-wider block font-semibold ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Employee Type
            </label>
            <div className="relative">
              <select
                suppressHydrationWarning
                value={selectedEmployeeType}
                onChange={(e) => setSelectedEmployeeType(e.target.value)}
                className={`w-full py-2 pl-3 pr-8 rounded-xl font-medium text-xs border appearance-none focus:outline-hidden focus:ring-2 cursor-pointer ${
                  isDarkMode
                    ? "bg-[#0D1117] border-slate-700 text-slate-100 focus:ring-indigo-500/30"
                    : "bg-white border-slate-200 text-slate-900 focus:ring-emerald-500/20 shadow-2xs"
                }`}
              >
                <option value="All Types">All Types</option>
                <option value="Full-Time Staff">Full-Time Staff</option>
                <option value="Contract Specialist">Contract Specialist</option>
                <option value="Part-Time">Part-Time</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 4. Company Selector */}
          <div className="space-y-1">
            <label
              className={`text-[11px] font-mono uppercase tracking-wider block font-semibold ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Company
            </label>
            <div className="relative">
              <select
                suppressHydrationWarning
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className={`w-full py-2 pl-3 pr-8 rounded-xl font-medium text-xs border appearance-none focus:outline-hidden focus:ring-2 cursor-pointer ${
                  isDarkMode
                    ? "bg-[#0D1117] border-slate-700 text-slate-100 focus:ring-indigo-500/30"
                    : "bg-white border-slate-200 text-slate-900 focus:ring-emerald-500/20 shadow-2xs"
                }`}
              >
                <option value="OKP Pvt Ltd">OKP Pvt Ltd</option>
                <option value="OKP Global Inc">OKP Global Inc</option>
                <option value="OKP Tech Labs">OKP Tech Labs</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          ROW 1: 5 SUMMARY KPI METRIC CARDS (Exact Layout & Typography)
         ════════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Net Salary Paid */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? "bg-[#161D27] border-slate-800/90 hover:border-slate-700"
              : "bg-slate-50/60 border-slate-200/90 hover:border-slate-300 shadow-2xs"
          }`}
        >
          <div
            className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Total Net Salary Paid
          </div>
          <div
            className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight mt-2 ${
              isDarkMode ? "text-white" : "text-[#0F2F1E]"
            }`}
          >
            {rawData.totalNetSalary}
          </div>
          <div
            className={`text-[11px] mt-1 font-mono font-medium flex items-center gap-1 ${
              isDarkMode ? "text-emerald-400" : "text-emerald-700 font-semibold"
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{rawData.salaryChangePercent}</span>
          </div>
        </div>

        {/* Card 2: Payslips Generated */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? "bg-[#161D27] border-slate-800/90 hover:border-slate-700"
              : "bg-slate-50/60 border-slate-200/90 hover:border-slate-300 shadow-2xs"
          }`}
        >
          <div
            className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Payslips Generated
          </div>
          <div
            className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight mt-2 ${
              isDarkMode ? "text-white" : "text-[#0F2F1E]"
            }`}
          >
            {rawData.payslipsGenerated}
          </div>
          <div
            className={`text-[11px] mt-1 font-medium ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            <span className={isDarkMode ? "text-emerald-400 font-bold" : "text-emerald-700 font-bold"}>
              {rawData.payslipsPaid} paid
            </span>
            ,{" "}
            <span className={isDarkMode ? "text-amber-400 font-bold" : "text-amber-700 font-bold"}>
              {rawData.payslipsPending} pending
            </span>
          </div>
        </div>

        {/* Card 3: Avg Salary / Employee */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? "bg-[#161D27] border-slate-800/90 hover:border-slate-700"
              : "bg-slate-50/60 border-slate-200/90 hover:border-slate-300 shadow-2xs"
          }`}
        >
          <div
            className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Avg Salary / Employee
          </div>
          <div
            className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight mt-2 ${
              isDarkMode ? "text-white" : "text-[#0F2F1E]"
            }`}
          >
            {rawData.avgSalaryPerEmployee}
          </div>
          <div
            className={`text-[11px] mt-1 font-mono font-medium ${
              isDarkMode ? "text-emerald-400" : "text-emerald-700 font-semibold"
            }`}
          >
            Based on current payrun
          </div>
        </div>

        {/* Card 4: Approved Time Off Days */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? "bg-[#161D27] border-slate-800/90 hover:border-slate-700"
              : "bg-slate-50/60 border-slate-200/90 hover:border-slate-300 shadow-2xs"
          }`}
        >
          <div
            className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Approved Time Off Days
          </div>
          <div
            className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight mt-2 ${
              isDarkMode ? "text-white" : "text-[#0F2F1E]"
            }`}
          >
            {rawData.approvedTimeOffDays} Days
          </div>
          <div
            className={`text-[11px] mt-1 font-medium ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Across selected period
          </div>
        </div>

        {/* Card 5: Attendance Health */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? "bg-[#161D27] border-slate-800/90 hover:border-slate-700"
              : "bg-slate-50/60 border-slate-200/90 hover:border-slate-300 shadow-2xs"
          }`}
        >
          <div
            className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Attendance Health
          </div>
          <div
            className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight mt-2 ${
              isDarkMode ? "text-white" : "text-[#0F2F1E]"
            }`}
          >
            {rawData.attendanceHealth}%
          </div>
          <div
            className={`text-[11px] mt-1 font-medium ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Present / reviewed records
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          ROW 2: MIDDLE INSIGHTS GRID (3 PANELS)
          Panel 1: Salary Cost by Department
          Panel 2: Monthly Net Salary Trend
          Panel 3: Payslip Status & Payroll Alerts
         ════════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── PANEL 1: Salary Cost by Department (Col 4) ────────────────────── */}
        <div
          className={`lg:col-span-4 p-5 sm:p-6 rounded-2xl border flex flex-col justify-between ${
            isDarkMode
              ? "bg-[#161D27] border-slate-800/90"
              : "bg-white border-slate-200/90 shadow-2xs"
          }`}
        >
          <div>
            <h3
              className={`text-sm font-bold font-serif ${
                isDarkMode ? "text-white" : "text-[#0F2F1E]"
              }`}
            >
              Salary Cost by Department
            </h3>
            <p
              className={`text-[11px] font-mono mt-0.5 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Source: Payslips + Employee Department
            </p>

            {/* Custom Department Bar Chart with Values on Top */}
            <div
              className={`mt-8 h-48 flex items-end justify-between gap-2 px-2 border-b pb-2 ${
                isDarkMode ? "border-slate-700/60" : "border-slate-200"
              }`}
            >
              {filteredDeptCosts.map((dept) => {
                const heightPercent = Math.max(
                  15,
                  Math.round((dept.amountNumeric / maxDeptCost) * 100)
                );
                return (
                  <div
                    key={dept.dept}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    {/* Value on Top */}
                    <span
                      className={`text-[10px] font-mono font-bold transition-transform group-hover:-translate-y-1 ${
                        isDarkMode ? "text-sky-400" : "text-[#0F2F1E]"
                      }`}
                    >
                      {dept.amount}
                    </span>

                    {/* Bar Pill */}
                    <div
                      className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 relative shadow-inner flex items-center justify-center overflow-hidden ${
                        isDarkMode
                          ? "bg-[#1E3A5F] hover:bg-[#2563EB] group-hover:brightness-125 border border-sky-500/30"
                          : "bg-[#0F2F1E] hover:bg-[#1A452C] border border-emerald-900/30"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-30" />
                    </div>

                    {/* Department Label */}
                    <span
                      className={`text-[11px] font-mono font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      {dept.dept}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-mono ${
              isDarkMode
                ? "border-slate-800/60 text-slate-400"
                : "border-slate-100 text-slate-500"
            }`}
          >
            <span>Aggregated 5 Departments</span>
            <span
              className={`font-semibold ${
                isDarkMode ? "text-sky-400" : "text-emerald-800 font-bold"
              }`}
            >
              Total ₹ 31.0L
            </span>
          </div>
        </div>

        {/* ── PANEL 2: Monthly Net Salary Trend (Col 4) ─────────────────────── */}
        <div
          className={`lg:col-span-4 p-5 sm:p-6 rounded-2xl border flex flex-col justify-between ${
            isDarkMode
              ? "bg-[#161D27] border-slate-800/90"
              : "bg-white border-slate-200/90 shadow-2xs"
          }`}
        >
          <div>
            <h3
              className={`text-sm font-bold font-serif ${
                isDarkMode ? "text-white" : "text-[#0F2F1E]"
              }`}
            >
              Monthly Net Salary Trend
            </h3>
            <p
              className={`text-[11px] font-mono mt-0.5 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Source: Historical Payslips / Payruns
            </p>

            {/* SVG Trend Line Visualization */}
            <div className="mt-8 relative h-48 w-full flex flex-col justify-end">
              {/* Highlight Tag for Sep */}
              <div className="absolute right-1 top-6 z-10">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shadow-xs ${
                    isDarkMode
                      ? "bg-sky-500/20 text-sky-300 border border-sky-400/40"
                      : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  }`}
                >
                  18.4L
                </span>
              </div>

              <svg
                viewBox="0 0 320 120"
                className="w-full h-32 overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={isDarkMode ? "#38BDF8" : "#0F2F1E"}
                      stopOpacity={isDarkMode ? "0.35" : "0.20"}
                    />
                    <stop
                      offset="100%"
                      stopColor={isDarkMode ? "#38BDF8" : "#0F2F1E"}
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>

                {/* Area fill */}
                <path
                  d="M 10 90 Q 60 75, 110 65 T 210 40 T 310 20 L 310 115 L 10 115 Z"
                  fill="url(#trendGradient)"
                />

                {/* Main line */}
                <path
                  d="M 10 90 Q 60 75, 110 65 T 210 40 T 310 20"
                  fill="none"
                  stroke={isDarkMode ? "#38BDF8" : "#0F2F1E"}
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Points */}
                {[
                  { cx: 10, cy: 90 },
                  { cx: 70, cy: 75 },
                  { cx: 130, cy: 65 },
                  { cx: 190, cy: 52 },
                  { cx: 250, cy: 38 },
                  { cx: 310, cy: 20 }
                ].map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.cx}
                    cy={pt.cy}
                    r={idx === 5 ? 5 : 3.5}
                    fill={idx === 5 ? (isDarkMode ? "#38BDF8" : "#0F2F1E") : isDarkMode ? "#0D1117" : "#FFFFFF"}
                    stroke={isDarkMode ? "#38BDF8" : "#0F2F1E"}
                    strokeWidth="2.5"
                    className="transition-all hover:scale-125"
                  />
                ))}
              </svg>

              {/* Month X-Axis */}
              <div
                className={`flex justify-between text-[11px] font-mono border-t pt-2 px-1 ${
                  isDarkMode
                    ? "text-slate-400 border-slate-700/60"
                    : "text-slate-600 border-slate-200"
                }`}
              >
                {rawData.monthlyTrend.map((t) => (
                  <span
                    key={t.month}
                    className={
                      t.isCurrent
                        ? isDarkMode
                          ? "text-sky-400 font-bold"
                          : "text-emerald-900 font-bold"
                        : isDarkMode
                        ? "text-slate-400"
                        : "text-slate-600"
                    }
                  >
                    {t.month}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-mono ${
              isDarkMode
                ? "border-slate-800/60 text-slate-400"
                : "border-slate-100 text-slate-500"
            }`}
          >
            <span>6-Month Trajectory</span>
            <span
              className={`font-semibold ${
                isDarkMode ? "text-emerald-400" : "text-emerald-800 font-bold"
              }`}
            >
              +21.0% YTD Growth
            </span>
          </div>
        </div>

        {/* ── PANEL 3: Payslip Status & Payroll Alerts (Col 4) ──────────────── */}
        <div
          className={`lg:col-span-4 p-5 sm:p-6 rounded-2xl border flex flex-col justify-between ${
            isDarkMode
              ? "bg-[#161D27] border-slate-800/90"
              : "bg-white border-slate-200/90 shadow-2xs"
          }`}
        >
          <div className="space-y-4">
            <div>
              <h3
                className={`text-sm font-bold font-serif ${
                  isDarkMode ? "text-white" : "text-[#0F2F1E]"
                }`}
              >
                Payslip Status &amp; Payroll Alerts
              </h3>
              <p
                className={`text-[11px] font-mono mt-0.5 ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Source: Payrun + Payslip validation
              </p>
            </div>

            {/* Status Split Progress Bar */}
            <div className="space-y-2">
              <div
                className={`text-[11px] font-mono font-semibold ${
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Status split
              </div>

              {/* Stacked Multi-Segment Bar */}
              <div
                className={`w-full h-4 rounded-md overflow-hidden flex border ${
                  isDarkMode
                    ? "border-slate-700/60 bg-slate-900"
                    : "border-slate-200 bg-slate-100"
                }`}
              >
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: "76%" }}
                  title="Paid: 142"
                />
                <div
                  className="bg-sky-500 h-full transition-all"
                  style={{ width: "10%" }}
                  title="Done: 4"
                />
                <div
                  className="bg-amber-500 h-full transition-all"
                  style={{ width: "8%" }}
                  title="Pending: 6"
                />
                <div
                  className="bg-rose-500 h-full transition-all"
                  style={{ width: "6%" }}
                  title="Warning: 2"
                />
              </div>

              {/* Status Legend */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono">
                <div
                  className={`flex items-center gap-1.5 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                  <span>Paid ({rawData.payslipsPaid})</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-sky-500" />
                  <span>Done ({rawData.payslipsDone})</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                  <span>Pending ({rawData.payslipsPending})</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
                  <span>Warning ({rawData.payslipsWarning})</span>
                </div>
              </div>
            </div>

            {/* Current Alerts List */}
            <div className="space-y-2 pt-2">
              <div
                className={`text-[11px] font-mono font-semibold ${
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Current alerts
              </div>

              <div className="space-y-1.5 text-xs">
                {alertsState.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlertModal(alert.id)}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                      alert.resolved
                        ? isDarkMode
                          ? "bg-slate-900/40 border-slate-800 opacity-60 line-through text-slate-500"
                          : "bg-slate-100/60 border-slate-200 opacity-60 line-through text-slate-400"
                        : alert.severity === "danger"
                        ? isDarkMode
                          ? "bg-rose-950/30 border-rose-800/60 text-rose-300 hover:bg-rose-950/50"
                          : "bg-rose-50 border-rose-200 text-rose-900 hover:bg-rose-100"
                        : alert.severity === "warning"
                        ? isDarkMode
                          ? "bg-amber-950/30 border-amber-800/60 text-amber-300 hover:bg-amber-950/50"
                          : "bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100"
                        : isDarkMode
                        ? "bg-sky-950/30 border-sky-800/60 text-sky-300 hover:bg-sky-950/50"
                        : "bg-sky-50 border-sky-200 text-sky-900 hover:bg-sky-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          alert.severity === "danger"
                            ? "bg-rose-500"
                            : alert.severity === "warning"
                            ? "bg-amber-500"
                            : "bg-sky-500"
                        }`}
                      />
                      <span className="font-mono text-[11px] truncate font-medium">
                        {alert.title}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold underline shrink-0 pl-2">
                      {alert.resolved ? "Resolved" : "Fix →"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-mono ${
              isDarkMode
                ? "border-slate-800/60 text-slate-400"
                : "border-slate-100 text-slate-500"
            }`}
          >
            <span>Preflight Validation</span>
            <span
              className={`font-semibold ${
                isDarkMode ? "text-amber-400" : "text-amber-800 font-bold"
              }`}
            >
              {alertsState.filter((a) => !a.resolved).length} Action Items
            </span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          ROW 3: BOTTOM MULTI-MODEL BREAKDOWN (4 GRID PANELS)
          Panel 1: Attendance Overview
          Panel 2: Time Off Overview
          Panel 3: Department Overview
          Panel 4: Models to Aggregate (Architecture Card)
         ════════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ── CARD 1: Attendance Overview ──────────────────────────────────── */}
        <div
          className={`p-5 rounded-2xl border flex flex-col justify-between ${
            isDarkMode
              ? "bg-[#161D27] border-slate-800/90"
              : "bg-white border-slate-200/90 shadow-2xs"
          }`}
        >
          <div>
            <h3
              className={`text-sm font-bold font-serif ${
                isDarkMode ? "text-white" : "text-[#0F2F1E]"
              }`}
            >
              Attendance Overview
            </h3>
            <p
              className={`text-[11px] font-mono mt-0.5 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Source: Attendance
            </p>

            <div className="mt-5 grid grid-cols-12 gap-3 items-end">
              {/* Left 3 Stat Bars */}
              <div
                className={`col-span-6 flex items-end justify-between gap-2 h-28 border-b pb-2 ${
                  isDarkMode ? "border-slate-700/60" : "border-slate-200"
                }`}
              >
                {/* Present (84) */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isDarkMode ? "text-sky-400" : "text-emerald-800"
                    }`}
                  >
                    {rawData.attendanceStats.present}
                  </span>
                  <div
                    className={`w-full rounded-t-md h-20 ${
                      isDarkMode
                        ? "bg-[#1E3A5F] border border-sky-400/40"
                        : "bg-emerald-600"
                    }`}
                  />
                  <span
                    className={`text-[9px] font-mono ${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Present
                  </span>
                </div>

                {/* Late (18) */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isDarkMode ? "text-amber-400" : "text-amber-700"
                    }`}
                  >
                    {rawData.attendanceStats.late}
                  </span>
                  <div
                    className={`w-full rounded-t-md h-9 ${
                      isDarkMode
                        ? "bg-amber-950/60 border border-amber-500/40"
                        : "bg-amber-500"
                    }`}
                  />
                  <span
                    className={`text-[9px] font-mono ${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Late
                  </span>
                </div>

                {/* Absent (4) */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isDarkMode ? "text-rose-400" : "text-rose-700"
                    }`}
                  >
                    {rawData.attendanceStats.absent}
                  </span>
                  <div
                    className={`w-full rounded-t-md h-4 ${
                      isDarkMode
                        ? "bg-rose-950/60 border border-rose-500/40"
                        : "bg-rose-500"
                    }`}
                  />
                  <span
                    className={`text-[9px] font-mono ${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Absent
                  </span>
                </div>
              </div>

              {/* Right Side Stats */}
              <div className="col-span-6 space-y-1.5 text-[11px] font-mono pl-2">
                <div className={isDarkMode ? "text-slate-300" : "text-slate-700"}>
                  Missing check-outs:{" "}
                  <span className={isDarkMode ? "text-amber-400 font-bold" : "text-amber-800 font-bold"}>
                    {rawData.attendanceStats.missingCheckouts}
                  </span>
                </div>
                <div className={isDarkMode ? "text-slate-300" : "text-slate-700"}>
                  Manual edits:{" "}
                  <span className={isDarkMode ? "text-sky-400 font-bold" : "text-sky-800 font-bold"}>
                    {rawData.attendanceStats.manualEdits}
                  </span>
                </div>
                <div className={isDarkMode ? "text-slate-300" : "text-slate-700"}>
                  Attendance avg:{" "}
                  <span className={isDarkMode ? "text-emerald-400 font-bold" : "text-emerald-800 font-bold"}>
                    {rawData.attendanceStats.attendanceAvg}%
                  </span>
                </div>
                <div className="pt-1">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isDarkMode
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                    }`}
                  >
                    +{rawData.attendanceStats.overtimeHours}h Overtime
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between text-[10px] font-mono ${
              isDarkMode
                ? "border-slate-800/60 text-slate-400"
                : "border-slate-100 text-slate-500"
            }`}
          >
            <span>Punches Connected</span>
            <span className={isDarkMode ? "text-emerald-400 font-semibold" : "text-emerald-800 font-bold"}>
              96% Accuracy
            </span>
          </div>
        </div>

        {/* ── CARD 2: Time Off Overview ────────────────────────────────────── */}
        <div
          className={`p-5 rounded-2xl border flex flex-col justify-between ${
            isDarkMode
              ? "bg-[#161D27] border-slate-800/90"
              : "bg-white border-slate-200/90 shadow-2xs"
          }`}
        >
          <div>
            <h3
              className={`text-sm font-bold font-serif ${
                isDarkMode ? "text-white" : "text-[#0F2F1E]"
              }`}
            >
              Time Off Overview
            </h3>
            <p
              className={`text-[11px] font-mono mt-0.5 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Source: Time Off Requests + Allocations
            </p>

            {/* Time Off Table */}
            <div
              className={`mt-4 border rounded-xl overflow-hidden ${
                isDarkMode ? "border-slate-700/60" : "border-slate-200"
              }`}
            >
              <table className="w-full text-left text-[11px] font-mono">
                <thead
                  className={`border-b text-[10px] uppercase font-semibold ${
                    isDarkMode
                      ? "bg-slate-900/90 text-slate-400 border-slate-700/60"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  <tr>
                    <th className="py-2 px-2.5">Type</th>
                    <th className="py-2 px-1 text-center">Approved</th>
                    <th className="py-2 px-1 text-center">Pending</th>
                    <th className="py-2 px-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDarkMode
                      ? "divide-slate-800 text-slate-200"
                      : "divide-slate-100 text-slate-800"
                  }`}
                >
                  {rawData.timeOffBreakdown.map((row) => (
                    <tr
                      key={row.type}
                      className={isDarkMode ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}
                    >
                      <td
                        className={`py-2 px-2.5 font-semibold ${
                          isDarkMode ? "text-slate-300" : "text-slate-800"
                        }`}
                      >
                        {row.type}
                      </td>
                      <td
                        className={`py-2 px-1 text-center font-bold ${
                          isDarkMode ? "text-emerald-400" : "text-emerald-700"
                        }`}
                      >
                        {row.approvedDays}
                      </td>
                      <td
                        className={`py-2 px-1 text-center font-bold ${
                          isDarkMode ? "text-amber-400" : "text-amber-700"
                        }`}
                      >
                        {row.pending}
                      </td>
                      <td
                        className={`py-2 px-2 text-right font-medium ${
                          isDarkMode ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {row.remainingBalance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between text-[10px] font-mono ${
              isDarkMode
                ? "border-slate-800/60 text-slate-400"
                : "border-slate-100 text-slate-500"
            }`}
          >
            <span>Leave Log Integration</span>
            <span className={isDarkMode ? "text-emerald-400 font-semibold" : "text-emerald-800 font-bold"}>
              34 Days Approved
            </span>
          </div>
        </div>

        {/* ── CARD 3: Department Overview ──────────────────────────────────── */}
        <div
          className={`p-5 rounded-2xl border flex flex-col justify-between ${
            isDarkMode
              ? "bg-[#161D27] border-slate-800/90"
              : "bg-white border-slate-200/90 shadow-2xs"
          }`}
        >
          <div>
            <h3
              className={`text-sm font-bold font-serif ${
                isDarkMode ? "text-white" : "text-[#0F2F1E]"
              }`}
            >
              Department Overview
            </h3>
            <p
              className={`text-[11px] font-mono mt-0.5 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Source: Employee + Contract + Payslip totals
            </p>

            {/* Department Table */}
            <div
              className={`mt-4 border rounded-xl overflow-hidden ${
                isDarkMode ? "border-slate-700/60" : "border-slate-200"
              }`}
            >
              <table className="w-full text-left text-[11px] font-mono">
                <thead
                  className={`border-b text-[10px] uppercase font-semibold ${
                    isDarkMode
                      ? "bg-slate-900/90 text-slate-400 border-slate-700/60"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  <tr>
                    <th className="py-2 px-2.5">Department</th>
                    <th className="py-2 px-2 text-center">Headcount</th>
                    <th className="py-2 px-2.5 text-right">Monthly Salary</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDarkMode
                      ? "divide-slate-800 text-slate-200"
                      : "divide-slate-100 text-slate-800"
                  }`}
                >
                  {rawData.departmentBreakdown.map((row) => (
                    <tr
                      key={row.dept}
                      className={isDarkMode ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}
                    >
                      <td
                        className={`py-2 px-2.5 font-semibold ${
                          isDarkMode ? "text-slate-300" : "text-slate-800"
                        }`}
                      >
                        {row.dept}
                      </td>
                      <td
                        className={`py-2 px-2 text-center font-bold ${
                          isDarkMode ? "text-sky-400" : "text-sky-700"
                        }`}
                      >
                        {row.headcount}
                      </td>
                      <td
                        className={`py-2 px-2.5 text-right font-bold ${
                          isDarkMode ? "text-emerald-400" : "text-[#0F2F1E]"
                        }`}
                      >
                        {row.monthlySalary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between text-[10px] font-mono ${
              isDarkMode
                ? "border-slate-800/60 text-slate-400"
                : "border-slate-100 text-slate-500"
            }`}
          >
            <span>62 Team Members</span>
            <span className={isDarkMode ? "text-emerald-400 font-semibold" : "text-emerald-800 font-bold"}>
              ₹ 14.5L Total
            </span>
          </div>
        </div>

        {/* ── CARD 4: Models to Aggregate (Architecture Challenge Card) ────── */}
        <div
          className={`p-5 rounded-2xl border flex flex-col justify-between ${
            isDarkMode
              ? "bg-[#161D27] border-slate-800/90"
              : "bg-white border-slate-200/90 shadow-2xs"
          }`}
        >
          <div>
            <h3
              className={`text-sm font-bold font-serif ${
                isDarkMode ? "text-white" : "text-[#0F2F1E]"
              }`}
            >
              Models to Aggregate
            </h3>
            <p
              className={`text-[11px] font-mono mt-0.5 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              This is the actual challenge behind the dashboard
            </p>

            <div
              className={`mt-4 space-y-2 text-[11px] font-mono leading-relaxed ${
                isDarkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              <div className="flex items-start gap-1.5">
                <span className={isDarkMode ? "text-sky-400 font-bold" : "text-sky-600 font-bold"}>•</span>
                <span>
                  <strong className={isDarkMode ? "text-slate-100" : "text-slate-900"}>Employees / Departments</strong> → headcount, ownership, grouping
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className={isDarkMode ? "text-emerald-400 font-bold" : "text-emerald-600 font-bold"}>•</span>
                <span>
                  <strong className={isDarkMode ? "text-slate-100" : "text-slate-900"}>Contracts</strong> → wage, schedule, active employees
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className={isDarkMode ? "text-indigo-400 font-bold" : "text-indigo-600 font-bold"}>•</span>
                <span>
                  <strong className={isDarkMode ? "text-slate-100" : "text-slate-900"}>Payruns / Payslips</strong> → salary totals, paid vs pending, trend data
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className={isDarkMode ? "text-amber-400 font-bold" : "text-amber-600 font-bold"}>•</span>
                <span>
                  <strong className={isDarkMode ? "text-slate-100" : "text-slate-900"}>Attendance</strong> → presence, absences, late entries, overtime
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className={isDarkMode ? "text-purple-400 font-bold" : "text-purple-600 font-bold"}>•</span>
                <span>
                  <strong className={isDarkMode ? "text-slate-100" : "text-slate-900"}>Time Off Requests / Allocations</strong> → leave taken and leave balances
                </span>
              </div>
            </div>
          </div>

          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between text-[10px] font-mono ${
              isDarkMode
                ? "border-slate-800/60 text-slate-400"
                : "border-slate-100 text-slate-500"
            }`}
          >
            <span>5 Core Relational Models</span>
            <span className={isDarkMode ? "text-sky-400 font-semibold" : "text-[#0F2F1E] font-bold"}>
              1 Unified Pipeline
            </span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          ALERT RESOLUTION MODAL / DRAWER
         ════════════════════════════════════════════════════════════════════════ */}
      {selectedAlertModal && activeAlert && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedAlertModal(null)}
        >
          <div
            className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl space-y-5 ${
              isDarkMode
                ? "bg-[#161D27] border-slate-700 text-slate-100"
                : "bg-white border-slate-200 text-slate-900"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`flex items-center justify-between border-b pb-3 ${
                isDarkMode ? "border-slate-700/60" : "border-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle
                  className={`w-5 h-5 ${
                    activeAlert.severity === "danger"
                      ? isDarkMode ? "text-rose-400" : "text-rose-600"
                      : activeAlert.severity === "warning"
                      ? isDarkMode ? "text-amber-400" : "text-amber-600"
                      : isDarkMode ? "text-sky-400" : "text-sky-600"
                  }`}
                />
                <h3 className="text-base font-bold font-serif">{activeAlert.title}</h3>
              </div>
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setSelectedAlertModal(null)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold cursor-pointer ${
                  isDarkMode
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div
                className={`p-3.5 rounded-xl border ${
                  isDarkMode
                    ? "bg-slate-900/80 border-slate-800 text-slate-300"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div
                  className={`font-semibold mb-1 ${
                    isDarkMode ? "text-slate-200" : "text-slate-900"
                  }`}
                >
                  Preflight Diagnostic Detail:
                </div>
                <p>{activeAlert.detail}</p>
              </div>

              <div
                className={`p-3 rounded-xl border text-[11px] font-mono ${
                  isDarkMode
                    ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-300"
                    : "bg-emerald-50 border-emerald-200 text-emerald-800"
                }`}
              >
                ✓ Action will automatically re-run payroll calculation engine for affected payslips.
              </div>
            </div>

            <div
              className={`flex items-center justify-end gap-2.5 pt-2 border-t ${
                isDarkMode ? "border-slate-700/60" : "border-slate-100"
              }`}
            >
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setSelectedAlertModal(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isDarkMode
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => handleResolveAlert(activeAlert.id, activeAlert.title)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0F2F1E] text-[#9FD067] hover:bg-[#1A452C] transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeAlert.action} &amp; Validate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#0F2F1E] text-[#9FD067] text-xs font-mono font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-emerald-800/50">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notificationToast}</span>
        </div>
      )}
    </div>
  );
};
