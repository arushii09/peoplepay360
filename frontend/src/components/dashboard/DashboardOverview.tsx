"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  Calculator,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Plus,
  Clock,
  FileText,
  Check
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

interface DashboardOverviewProps {
  onNavigate: (navId: string) => void;
  onSelectEmployee?: (empId: number) => void;
}

const PAYROLL_TREND_DATA = [
  { month: "May", gross: 19.2, net: 18.0 },
  { month: "Jun", gross: 20.1, net: 18.8 },
  { month: "Jul", gross: 21.0, net: 19.7 },
  { month: "Aug", gross: 22.4, net: 20.9 },
  { month: "Sep (Cur)", gross: 23.2, net: 21.6 },
];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigate,
}) => {
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("September 2026");

  // Workflow state: Review Payrun -> Fix Warning -> Validate -> Payslip
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<1 | 2 | 3 | 4>(1);

  // Warnings resolution state
  const [warnings, setWarnings] = useState([
    {
      id: "warn-attendance",
      title: "Incomplete attendance",
      detail: "3 employees have unlogged shifts or missing check-out timestamps",
      actionLabel: "Fix Attendance",
      resolved: false,
    },
    {
      id: "warn-contract",
      title: "Missing active contract",
      detail: "Rohan Verma contract expired Aug 31; missing active contract for Sep",
      actionLabel: "Renew Contract",
      resolved: false,
    },
    {
      id: "warn-duplicate",
      title: "Duplicate payrun",
      detail: "Preflight constraint: 1 duplicate entry detected for EMP-103",
      actionLabel: "Deduplicate",
      resolved: false,
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleResolveWarning = (id: string) => {
    setWarnings((prev) =>
      prev.map((w) => (w.id === id ? { ...w, resolved: true } : w))
    );
  };

  const allWarningsResolved = warnings.every((w) => w.resolved);

  return (
    <div className="space-y-6">
      {/* 1. Header Bar matching wireframe */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8F3E6]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0F2F1E] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#5C645C] mt-0.5">
            Good morning, HR Manager
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              suppressHydrationWarning
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none py-2 pl-4 pr-9 rounded-xl bg-[#FFFFFF] border border-[#CBD2C4] text-xs font-semibold text-[#0F2F1E] focus:outline-none focus:border-[#0F2F1E] cursor-pointer"
            >
              <option value="September 2026">September 2026</option>
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5C645C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. Top 4 KPI Cards matching wireframe */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Employees */}
        <div
          onClick={() => onNavigate("employees")}
          className="p-5 rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] hover:border-[#0F2F1E] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#5C645C] text-xs">
            <span className="font-semibold uppercase tracking-wider">Employees</span>
            <Users className="w-4 h-4 text-[#2E6845]" />
          </div>
          <div className="text-3xl font-bold font-serif text-[#0F2F1E] mt-2">
            248
          </div>
          <p className="text-[11px] text-[#2E6845] mt-1 font-medium">
            Active roster in system
          </p>
        </div>

        {/* Card 2: Pending Leave */}
        <div
          onClick={() => onNavigate("time-off")}
          className="p-5 rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] hover:border-[#0F2F1E] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#5C645C] text-xs">
            <span className="font-semibold uppercase tracking-wider">Pending Leave</span>
            <Calendar className="w-4 h-4 text-[#2E6845]" />
          </div>
          <div className="text-3xl font-bold font-serif text-[#0F2F1E] mt-2">
            12
          </div>
          <p className="text-[11px] text-amber-700 mt-1 font-medium">
            Requires decision before payrun
          </p>
        </div>

        {/* Card 3: Payrun */}
        <div
          onClick={() => onNavigate("payroll")}
          className="p-5 rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] hover:border-[#0F2F1E] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#5C645C] text-xs">
            <span className="font-semibold uppercase tracking-wider">Payrun</span>
            <Calculator className="w-4 h-4 text-[#2E6845]" />
          </div>
          <div className="text-2xl font-bold font-serif text-[#0F2F1E] mt-2">
            Calculated
          </div>
          <p className="text-[11px] text-[#2E6845] mt-1 font-medium">
            Preflight check in progress
          </p>
        </div>

        {/* Card 4: Net Payroll */}
        <div className="p-5 rounded-xl border border-[#E8F3E6] bg-[#FFFFFF]">
          <div className="flex items-center justify-between text-[#5C645C] text-xs">
            <span className="font-semibold uppercase tracking-wider">Net Payroll</span>
            <DollarSign className="w-4 h-4 text-[#2E6845]" />
          </div>
          <div className="text-3xl font-bold font-serif text-[#0F2F1E] mt-2">
            ₹21.6L
          </div>
          <p className="text-[11px] text-[#5C645C] mt-1">
            Period net payable allocation
          </p>
        </div>
      </div>

      {/* 3. Row 2: Payroll Overview (Recharts) & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payroll Overview Chart (Col 8) */}
        <div className="lg:col-span-8 p-6 rounded-xl border border-[#E8F3E6] bg-[#FFFFFF]">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8F3E6]">
            <div>
              <h2 className="text-base font-bold font-serif text-[#0F2F1E]">
                Payroll Overview
              </h2>
              <p className="text-xs text-[#5C645C] mt-0.5">
                Monthly Gross vs Net Payroll Trend (in Lakhs INR)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F3E6] text-[#0F2F1E]">
              Recharts Engine
            </span>
          </div>

          <div className="h-64 mt-4 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PAYROLL_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8F3E6" vertical={false} />
                  <XAxis dataKey="month" stroke="#5C645C" fontSize={11} tickLine={false} />
                  <YAxis stroke="#5C645C" fontSize={11} tickLine={false} unit="L" />
                  <Tooltip
                    formatter={(value: any) => [`₹${value} Lakhs`, ""]}
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#CBD2C4",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "#1A1A1A",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  />
                  <Bar dataKey="gross" name="Gross Pay" fill="#0F2F1E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="net" name="Net Disbursed" fill="#9FD067" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#5C645C]">
                Loading trend visualization...
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions (Col 4) */}
        <div className="lg:col-span-4 p-6 rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-[#E8F3E6]">
              <h2 className="text-base font-bold font-serif text-[#0F2F1E]">
                Quick Actions
              </h2>
              <p className="text-xs text-[#5C645C] mt-0.5">
                Core HR operations shortcuts
              </p>
            </div>

            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => onNavigate("employees")}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#E8F3E6] bg-[#F6F7F2] hover:bg-[#E7E9E1] transition-colors text-xs font-semibold text-[#0F2F1E] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4 text-[#2E6845]" />
                  <span>+ Employee</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#5C645C]" />
              </button>

              <button
                type="button"
                suppressHydrationWarning
                onClick={() => onNavigate("attendance")}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#E8F3E6] bg-[#F6F7F2] hover:bg-[#E7E9E1] transition-colors text-xs font-semibold text-[#0F2F1E] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#2E6845]" />
                  <span>+ Attendance</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#5C645C]" />
              </button>

              <button
                type="button"
                suppressHydrationWarning
                onClick={() => onNavigate("time-off")}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#E8F3E6] bg-[#F6F7F2] hover:bg-[#E7E9E1] transition-colors text-xs font-semibold text-[#0F2F1E] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#2E6845]" />
                  <span>Review Leave</span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                  12
                </span>
              </button>

              <button
                type="button"
                suppressHydrationWarning
                onClick={() => onNavigate("payroll")}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#0F2F1E] bg-[#0F2F1E] text-white hover:bg-[#1F4D32] transition-colors text-xs font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-4 h-4 text-[#9FD067]" />
                  <span>Create Payrun</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#9FD067]" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8F3E6] text-[11px] text-[#5C645C]">
            Connected schema: changes reflect in September payrun automatically.
          </div>
        </div>
      </div>

      {/* 4. Row 3: Current Payrun matching wireframe */}
      <div className="p-6 rounded-xl border border-[#E8F3E6] bg-[#FFFFFF]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8F3E6]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5C645C]">
              Current Payrun
            </span>
            <h2 className="text-xl font-bold font-serif text-[#0F2F1E]">
              September 2026
            </h2>
          </div>

          <button
            type="button"
            suppressHydrationWarning
            onClick={() => {
              setActiveWorkflowStep(1);
              setReviewModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-lg bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#1F4D32] transition-colors self-start sm:self-auto cursor-pointer"
          >
            Review Payrun →
          </button>
        </div>

        {/* Progress Bar 82% */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#1A1A1A]">
              Preflight Calculation Progress
            </span>
            <span className="font-bold font-mono text-[#0F2F1E]">82% Completed</span>
          </div>
          <div className="w-full bg-[#E7E9E1] h-3 rounded-full overflow-hidden flex">
            <div
              className="bg-[#0F2F1E] h-full transition-all duration-500"
              style={{ width: "82%" }}
            />
          </div>
        </div>

        {/* Status Counts matching wireframe */}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium">
          <div className="px-3 py-1.5 rounded-lg bg-[#E8F3E6] text-[#0F2F1E] border border-[#CBD2C4]">
            <strong>241</strong> Calculated
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
            <strong>{warnings.filter((w) => !w.resolved).length}</strong> Warnings Pending
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-red-50 text-red-900 border border-red-200">
            <strong>2</strong> Blocked Records
          </div>
          <span className="text-[11px] text-[#5C645C] ml-auto">
            Click &quot;Review Payrun&quot; to unblock and disburse.
          </span>
        </div>
      </div>

      {/* 5. Row 4: Payroll Warnings matching wireframe */}
      <div className="p-6 rounded-xl border border-[#E8F3E6] bg-[#FFFFFF]">
        <div className="pb-3 border-b border-[#E8F3E6] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-serif text-[#0F2F1E]">
              Payroll Warnings
            </h2>
            <p className="text-xs text-[#5C645C] mt-0.5">
              Preflight guardrails intercepting invalid data prior to finalization
            </p>
          </div>
          {allWarningsResolved ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E8F3E6] text-[#0F2F1E] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6845]" />
              All Warnings Resolved
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              3 Items Require Review
            </span>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {warnings.map((warn) => (
            <div
              key={warn.id}
              className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                warn.resolved
                  ? "bg-[#F6F7F2] border-[#E8F3E6] opacity-75"
                  : "bg-[#FFFFFF] border-amber-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {warn.resolved ? (
                  <CheckCircle2 className="w-4 h-4 text-[#2E6845] shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-bold text-[#1A1A1A] flex items-center gap-2">
                    <span>{warn.title}</span>
                    {warn.resolved && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#E8F3E6] text-[#0F2F1E]">
                        Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5C645C] mt-0.5">{warn.detail}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {warn.resolved ? (
                  <span className="text-xs text-[#2E6845] font-semibold">Fixed</span>
                ) : (
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => {
                      handleResolveWarning(warn.id);
                      setReviewModalOpen(true);
                      setActiveWorkflowStep(2);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#E7E9E1] text-[#0F2F1E] text-xs font-semibold hover:bg-[#CBD2C4] border border-[#CBD2C4] transition-colors cursor-pointer"
                  >
                    Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Row 5: Recent Payruns & HR Activity matching wireframe */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payruns */}
        <div className="p-6 rounded-xl border border-[#E8F3E6] bg-[#FFFFFF]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8F3E6]">
            <h2 className="text-base font-bold font-serif text-[#0F2F1E]">
              Recent Payruns
            </h2>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => onNavigate("payroll")}
              className="text-xs font-semibold text-[#0F2F1E] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F6F7F2] border border-[#E8F3E6] text-xs">
              <div>
                <span className="font-bold text-[#0F2F1E]">September 2026</span>
                <div className="text-[11px] text-[#5C645C]">248 Employees • ₹21.6L Net</div>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-[#E8F3E6] text-[#0F2F1E] border border-[#CBD2C4]">
                Validated
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F6F7F2] border border-[#E8F3E6] text-xs">
              <div>
                <span className="font-bold text-[#0F2F1E]">August 2026</span>
                <div className="text-[11px] text-[#5C645C]">246 Employees • ₹20.9L Net</div>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-[#E7E9E1] text-[#1A1A1A]">
                Paid
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F6F7F2] border border-[#E8F3E6] text-xs">
              <div>
                <span className="font-bold text-[#0F2F1E]">July 2026</span>
                <div className="text-[11px] text-[#5C645C]">242 Employees • ₹19.7L Net</div>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-[#E7E9E1] text-[#1A1A1A]">
                Paid
              </span>
            </div>
          </div>
        </div>

        {/* HR Activity */}
        <div className="p-6 rounded-xl border border-[#E8F3E6] bg-[#FFFFFF]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8F3E6]">
            <h2 className="text-base font-bold font-serif text-[#0F2F1E]">
              HR Activity
            </h2>
            <span className="text-xs text-[#5C645C]">Live Connected Stream</span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#F6F7F2] border border-[#E8F3E6] text-xs">
              <FileText className="w-4 h-4 text-[#2E6845] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-[#0F2F1E]">Contract updated</div>
                <p className="text-[11px] text-[#5C645C]">
                  Aarav Mehta contract renewed at ₹60,000/mo base with 240h overtime anchor.
                </p>
                <span className="text-[10px] text-[#9AA29A]">10 minutes ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#F6F7F2] border border-[#E8F3E6] text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#2E6845] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-[#0F2F1E]">Leave approved</div>
                <p className="text-[11px] text-[#5C645C]">
                  Priya Sharma casual leave (2 days) approved; automatically marked for paid deduction.
                </p>
                <span className="text-[10px] text-[#9AA29A]">45 minutes ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#F6F7F2] border border-[#E8F3E6] text-xs">
              <Calculator className="w-4 h-4 text-[#2E6845] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-[#0F2F1E]">Payrun calculated</div>
                <p className="text-[11px] text-[#5C645C]">
                  September batch run completed for 241 employees; 3 exceptions queued for review.
                </p>
                <span className="text-[10px] text-[#9AA29A]">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Action Modal: Review Payrun → Fix Warning → Validate → Payslip */}
      {reviewModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setReviewModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#FFFFFF] border border-[#E8F3E6] rounded-xl p-6 text-[#1A1A1A] space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8F3E6]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C645C]">
                  PeoplePay360 Guided Resolution Workflow
                </span>
                <h3 className="text-lg font-bold font-serif text-[#0F2F1E]">
                  Review Payrun → Fix Warning → Validate → Payslip
                </h3>
              </div>
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setReviewModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#E7E9E1] text-[#1A1A1A] hover:bg-[#CBD2C4] text-xs font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Stepper Header */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
              <div
                className={`py-2 px-1 rounded-lg ${
                  activeWorkflowStep === 1
                    ? "bg-[#0F2F1E] text-white"
                    : "bg-[#E8F3E6] text-[#0F2F1E]"
                }`}
              >
                1. Review Payrun
              </div>
              <div
                className={`py-2 px-1 rounded-lg ${
                  activeWorkflowStep === 2
                    ? "bg-[#0F2F1E] text-white"
                    : "bg-[#E8F3E6] text-[#0F2F1E]"
                }`}
              >
                2. Fix Warnings
              </div>
              <div
                className={`py-2 px-1 rounded-lg ${
                  activeWorkflowStep === 3
                    ? "bg-[#0F2F1E] text-white"
                    : "bg-[#E8F3E6] text-[#0F2F1E]"
                }`}
              >
                3. Validate
              </div>
              <div
                className={`py-2 px-1 rounded-lg ${
                  activeWorkflowStep === 4
                    ? "bg-[#0F2F1E] text-white"
                    : "bg-[#E8F3E6] text-[#0F2F1E]"
                }`}
              >
                4. Payslip
              </div>
            </div>

            {/* Step 1: Review Payrun */}
            {activeWorkflowStep === 1 && (
              <div className="space-y-4 text-xs">
                <p className="text-[#5C645C]">
                  Reviewing current September 2026 batch calculation. 241 records are clean, while 3 exceptions require resolution before payroll finalization.
                </p>
                <div className="p-4 rounded-lg bg-[#F6F7F2] border border-[#E8F3E6] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#5C645C]">Total Gross Expected:</span>
                    <span className="font-bold text-[#0F2F1E]">₹23,20,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5C645C]">Net Payable:</span>
                    <span className="font-bold text-[#0F2F1E]">₹21,60,000</span>
                  </div>
                  <div className="flex justify-between text-amber-800 font-medium">
                    <span>Unresolved Exceptions:</span>
                    <span>3 preflight warnings</span>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setActiveWorkflowStep(2)}
                    className="px-5 py-2.5 rounded-lg bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#1F4D32] cursor-pointer"
                  >
                    Proceed to Fix Warnings →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Fix Warnings */}
            {activeWorkflowStep === 2 && (
              <div className="space-y-4 text-xs">
                <p className="text-[#5C645C]">
                  Resolve intercepted preflight warnings with one-click resolution:
                </p>
                <div className="space-y-2.5">
                  {warnings.map((warn) => (
                    <div
                      key={warn.id}
                      className="p-3 rounded-lg border border-[#E8F3E6] bg-[#F6F7F2] flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-[#0F2F1E]">{warn.title}</div>
                        <div className="text-[11px] text-[#5C645C]">{warn.detail}</div>
                      </div>
                      {warn.resolved ? (
                        <span className="text-xs font-bold text-[#2E6845] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Resolved
                        </span>
                      ) : (
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={() => handleResolveWarning(warn.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#1F4D32] cursor-pointer"
                        >
                          {warn.actionLabel}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setActiveWorkflowStep(1)}
                    className="px-4 py-2 rounded-lg bg-[#E7E9E1] text-[#1A1A1A] text-xs font-semibold cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    suppressHydrationWarning
                    disabled={!allWarningsResolved}
                    onClick={() => setActiveWorkflowStep(3)}
                    className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      allWarningsResolved
                        ? "bg-[#0F2F1E] text-white hover:bg-[#1F4D32]"
                        : "bg-[#E7E9E1] text-[#9AA29A] cursor-not-allowed"
                    }`}
                  >
                    Run Preflight Validation →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Validate */}
            {activeWorkflowStep === 3 && (
              <div className="space-y-4 text-xs text-center py-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#E8F3E6] text-[#2E6845] flex items-center justify-center font-bold text-xl">
                  ✓
                </div>
                <div>
                  <h4 className="text-base font-bold font-serif text-[#0F2F1E]">
                    Preflight Validation Passed
                  </h4>
                  <p className="text-[#5C645C] mt-1 max-w-md mx-auto">
                    All 248 employees have active contracts, reconciled attendance logs, and verified salary rule sequences. Zero blocked records.
                  </p>
                </div>
                <div className="flex justify-between pt-4 border-t border-[#E8F3E6]">
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setActiveWorkflowStep(2)}
                    className="px-4 py-2 rounded-lg bg-[#E7E9E1] text-[#1A1A1A] text-xs font-semibold cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setActiveWorkflowStep(4)}
                    className="px-5 py-2.5 rounded-lg bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#1F4D32] cursor-pointer"
                  >
                    Generate Final Payslips →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Payslip Output */}
            {activeWorkflowStep === 4 && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-lg bg-[#F6F7F2] border border-[#2E6845] space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-[#2E6845] uppercase tracking-wider">
                        Validated Payslip Ledger Generated
                      </span>
                      <h4 className="text-base font-bold font-serif text-[#0F2F1E]">
                        Aarav Mehta (EMP-101)
                      </h4>
                      <p className="text-[#5C645C]">Platform Engineering • September 2026</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#5C645C]">Net Disbursable:</span>
                      <div className="text-xl font-bold font-serif text-[#0F2F1E]">
                        ₹57,500
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#FFFFFF] border border-[#E8F3E6] space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span>Basic Salary (50% Contract):</span>
                      <span className="font-mono font-medium">+₹30,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>House Rent Allowance HRA (30%):</span>
                      <span className="font-mono font-medium">+₹18,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime (10h × ₹250/hr):</span>
                      <span className="font-mono font-medium text-[#2E6845]">+₹2,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unpaid Leave (1 day × ₹2,000/day):</span>
                      <span className="font-mono font-medium">-₹2,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Statutory Deductions (PF + Tax):</span>
                      <span className="font-mono font-medium">-₹6,000</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => {
                      setReviewModalOpen(false);
                      setActiveWorkflowStep(1);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#E7E9E1] text-[#1A1A1A] text-xs font-semibold cursor-pointer"
                  >
                    Done
                  </button>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => {
                      setReviewModalOpen(false);
                      onNavigate("payroll");
                    }}
                    className="px-5 py-2.5 rounded-lg bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#1F4D32] cursor-pointer"
                  >
                    Open Full Payroll Engine →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
