"use client";

import React, { useState } from "react";
import {
  Calculator,
  Layers,
  Code2,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Lock
} from "lucide-react";
import { PayrunListView } from "./PayrunListView";
import { CreatePayrunWizard } from "./CreatePayrunWizard";
import { SalaryRulesView } from "./SalaryRulesView";
import { SalaryStructuresView } from "./SalaryStructuresView";
import { Payrun } from "@/types/hr";
import { initialPayruns } from "@/lib/mock-data";
import { UserRole } from "@/components/auth/AuthView";

interface PayrollEngineViewProps {
  currentUserRole?: UserRole;
  initialTab?: "payruns" | "create" | "rules" | "structures";
}

export const PayrollEngineView: React.FC<PayrollEngineViewProps> = ({
  currentUserRole = "hr_payroll_manager",
  initialTab = "payruns"
}) => {
  const [activeTab, setActiveTab] = useState<"payruns" | "create" | "rules" | "structures">(initialTab);
  const [payruns, setPayruns] = useState<Payrun[]>(initialPayruns);
  const [selectedPayrunForReview, setSelectedPayrunForReview] = useState<Payrun | null>(null);

  const isReadOnly = currentUserRole === "hr_payroll_user" || currentUserRole === "employee";
  const canModify = currentUserRole === "hr_payroll_manager" || currentUserRole === "admin";

  const handlePayrunCreated = (newPayrun: Payrun) => {
    setPayruns([newPayrun, ...payruns]);
    setActiveTab("payruns");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Sub-navigation Tabs ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-2 border border-slate-200/80 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("payruns")}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === "payruns"
                ? "bg-[#0F2F1E] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Payrun Cycles (Row 4)</span>
          </button>

          {canModify && (
            <button
              type="button"
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === "create"
                  ? "bg-[#0F2F1E] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Payrun Wizard (Row 5)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab("rules")}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === "rules"
                ? "bg-[#0F2F1E] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Salary Rules & Sequences (Row 3)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("structures")}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === "structures"
                ? "bg-[#0F2F1E] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Salary Structures Waterfall (Row 2)</span>
          </button>
        </div>

        {/* Role indicator */}
        <div className="pr-2 hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          {canModify ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full CRUD Control</span>
            </span>
          ) : (
            <span className="text-cyan-700 font-semibold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-cyan-600" />
              <span>Read-Only Mode</span>
            </span>
          )}
        </div>
      </div>

      {/* ── Active View Rendering ───────────────────────────────────────────── */}
      {activeTab === "payruns" && (
        <PayrunListView
          currentUserRole={currentUserRole}
          onCreatePayrunClick={() => setActiveTab("create")}
          onViewPayrunDetails={(p) => setSelectedPayrunForReview(p)}
        />
      )}

      {activeTab === "create" && (
        <CreatePayrunWizard
          currentUserRole={currentUserRole}
          onPayrunCreated={handlePayrunCreated}
          onCancel={() => setActiveTab("payruns")}
        />
      )}

      {activeTab === "rules" && (
        <SalaryRulesView
          currentUserRole={currentUserRole}
          onNavigateToStructures={() => setActiveTab("structures")}
        />
      )}

      {activeTab === "structures" && (
        <SalaryStructuresView
          currentUserRole={currentUserRole}
          onNavigateToPayruns={() => setActiveTab("payruns")}
        />
      )}
    </div>
  );
};
