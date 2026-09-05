"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Lock,
  ChevronRight,
  Sparkles,
  TrendingUp,
  DollarSign,
  AlertCircle,
  FileText
} from "lucide-react";
import { Payrun, PayrunStatus } from "@/types/hr";
import { initialPayruns } from "@/lib/mock-data";
import { UserRole } from "@/components/auth/AuthView";

interface PayrunListViewProps {
  currentUserRole?: UserRole;
  onCreatePayrunClick?: () => void;
  onViewPayrunDetails?: (payrun: Payrun) => void;
}

export const PayrunListView: React.FC<PayrunListViewProps> = ({
  currentUserRole = "hr_payroll_manager",
  onCreatePayrunClick,
  onViewPayrunDetails
}) => {
  const [payruns, setPayruns] = useState<Payrun[]>(initialPayruns);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isReadOnly = currentUserRole === "hr_payroll_user" || currentUserRole === "employee";
  const canModify = currentUserRole === "hr_payroll_manager" || currentUserRole === "admin";

  // Filtered Payruns
  const filteredPayruns = useMemo(() => {
    return payruns.filter((p) => {
      if (activeTab !== "ALL" && p.status !== activeTab) {
        return false;
      }
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.period_start.includes(searchQuery) &&
        !p.period_end.includes(searchQuery)
      ) {
        return false;
      }
      return true;
    });
  }, [payruns, activeTab, searchQuery]);

  // Aggregate Metrics
  const totalGrossDisbursed = useMemo(() => {
    return payruns.reduce((acc, p) => acc + p.total_gross, 0);
  }, [payruns]);

  const totalNetDisbursed = useMemo(() => {
    return payruns.reduce((acc, p) => acc + p.total_net, 0);
  }, [payruns]);

  const handleValidatePayrun = (id: number) => {
    const updated = payruns.map((p) => {
      if (p.id === id && (p.status === "DRAFT" || p.status === "COMPUTED")) {
        return { ...p, status: "VALIDATED" as PayrunStatus };
      }
      return p;
    });
    setPayruns(updated);
  };

  const handleMarkAsPaid = (id: number) => {
    const updated = payruns.map((p) => {
      if (p.id === id && p.status === "VALIDATED") {
        return { ...p, status: "PAID" as PayrunStatus };
      }
      return p;
    });
    setPayruns(updated);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return {
          label: "Draft Cycle",
          bg: "bg-slate-100 text-slate-700 border-slate-300",
          dot: "bg-slate-400"
        };
      case "COMPUTED":
        return {
          label: "Computed / Review",
          bg: "bg-cyan-50 text-cyan-800 border-cyan-200",
          dot: "bg-cyan-500"
        };
      case "VALIDATED":
        return {
          label: "Validated & Locked",
          bg: "bg-emerald-50 text-emerald-800 border-emerald-300",
          dot: "bg-emerald-500"
        };
      case "PAID":
        return {
          label: "Disbursed / Paid",
          bg: "bg-[#0F2F1E] text-emerald-300 border-emerald-700",
          dot: "bg-emerald-400"
        };
      default:
        return {
          label: status,
          bg: "bg-slate-100 text-slate-600 border-slate-200",
          dot: "bg-slate-400"
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0F2F1E] text-emerald-300 flex items-center justify-center shadow-xs border border-emerald-800/40">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl text-[#0F2F1E] font-serif tracking-tight">
                  Payroll & Payrun Cycles
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Row 4 Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage monthly disbursement cycles, enforce the status model (Draft &rarr; Review &rarr; Validated &rarr; Paid), and review preflight audit warnings.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {canModify && onCreatePayrunClick && (
            <button
              type="button"
              onClick={onCreatePayrunClick}
              className="px-4 py-2 rounded-xl bg-[#0F2F1E] text-emerald-300 hover:bg-[#16422b] text-xs font-semibold transition flex items-center gap-1.5 shadow-xs border border-emerald-800/40 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Payrun Wizard (Row 5)</span>
            </button>
          )}
        </div>
      </div>

      {/* ── KPI Row ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total Payruns</span>
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-slate-900">{payruns.length}</div>
            <span className="text-[11px] text-slate-400">Monthly cycles tracked</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Gross Liability</span>
            <DollarSign className="w-4 h-4 text-indigo-700" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-slate-900">
              ₹{totalGrossDisbursed.toLocaleString()}
            </div>
            <span className="text-[11px] text-indigo-700 font-medium">All active cycles</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Net Disbursable</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-emerald-800">
              ₹{totalNetDisbursed.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Bank transfer ready</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-[#0F2F1E] text-white border border-emerald-900/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-300/80">
            <span className="text-xs font-medium">Lifecycle State</span>
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-emerald-200">Enforced</div>
            <span className="text-[11px] text-emerald-300/80">Draft &rarr; Validated &rarr; Paid</span>
          </div>
        </div>
      </div>

      {/* ── Filter Tabs & Search ────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-full sm:w-auto overflow-x-auto">
          {[
            { id: "ALL", label: `All Cycles (${payruns.length})` },
            { id: "DRAFT", label: `Draft (${payruns.filter((p) => p.status === "DRAFT").length})` },
            { id: "COMPUTED", label: `Computed (${payruns.filter((p) => p.status === "COMPUTED").length})` },
            { id: "VALIDATED", label: `Validated (${payruns.filter((p) => p.status === "VALIDATED").length})` },
            { id: "PAID", label: `Paid (${payruns.filter((p) => p.status === "PAID").length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by cycle name or period..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* ── Payrun Cycle Cards Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredPayruns.map((payrun) => {
          const badge = getStatusBadge(payrun.status);
          const hasBlocking = (payrun.blocking_errors_count || 0) > 0;
          const hasWarnings = (payrun.warnings_count || 0) > 0;

          return (
            <div
              key={payrun.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      <span>{badge.label}</span>
                    </span>
                    <h3 className="font-bold text-base text-[#0F2F1E] font-serif mt-2">
                      {payrun.name}
                    </h3>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                    ID #{payrun.id}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {payrun.period_start} &rarr; {payrun.period_end}
                  </span>
                </div>

                {/* Structure Name */}
                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Structure:</span>
                  <span className="font-medium text-[11px] text-slate-800 line-clamp-1">
                    {payrun.salary_structure_name || "Standard Executive 2026"}
                  </span>
                </div>

                {/* Warning & Error Indicators */}
                {(hasBlocking || hasWarnings) && (
                  <div className="space-y-1 pt-1">
                    {hasBlocking && (
                      <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[11px] flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span className="font-medium">
                          {payrun.blocking_errors_count} Blocking Error (Requires Resolution)
                        </span>
                      </div>
                    )}
                    {hasWarnings && !hasBlocking && (
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{payrun.warnings_count} Informational Warning (Unpaid leaves)</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Gross Total</span>
                    <span className="font-bold font-mono text-slate-900">
                      ₹{payrun.total_gross.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-800 block">Net Disbursable</span>
                    <span className="font-bold font-mono text-emerald-700">
                      ₹{payrun.total_net.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons based on Status */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                {payrun.status === "DRAFT" && canModify && (
                  <button
                    type="button"
                    onClick={() => handleValidatePayrun(payrun.id)}
                    className="w-full py-2 rounded-xl bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#16422b] transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Run Calculation & Validate</span>
                  </button>
                )}

                {payrun.status === "VALIDATED" && canModify && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsPaid(payrun.id)}
                    className="w-full py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Disburse & Mark as Paid</span>
                  </button>
                )}

                {payrun.status === "PAID" && (
                  <div className="w-full py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cycle Disbursed & Completed</span>
                  </div>
                )}

                {onViewPayrunDetails && (
                  <button
                    type="button"
                    onClick={() => onViewPayrunDetails(payrun)}
                    className="w-full py-1.5 rounded-xl bg-slate-50 text-slate-700 text-xs font-medium hover:bg-slate-100 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span>View Cycle Payslips ({payrun.employee_count})</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
