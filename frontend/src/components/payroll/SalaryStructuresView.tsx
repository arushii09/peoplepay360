"use client";

import React, { useState, useMemo } from "react";
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Code2,
  Info,
  ChevronRight,
  ShieldCheck,
  FileSpreadsheet,
  X,
  Sliders,
  DollarSign,
  Percent,
  Clock,
  Calendar,
  Lock,
  Copy,
  Check,
  Edit2
} from "lucide-react";
import {
  SalaryStructure,
  SalaryRule,
  ComputationType,
  RuleCategory
} from "@/types/hr";
import { initialSalaryStructures } from "@/lib/mock-data";
import { UserRole } from "@/components/auth/AuthView";

export interface StructureFormRule {
  id: number;
  name: string;
  code: string;
  category: "Basic" | "Allowance" | "Gross" | "Deduction" | "Net";
  sequence: number;
}

const defaultRegularSalaryRules: StructureFormRule[] = [
  { id: 1, name: "Basic Salary", code: "BASIC", category: "Basic", sequence: 1 },
  { id: 2, name: "House Rent Allowance", code: "HRA", category: "Allowance", sequence: 10 },
  { id: 3, name: "Standard Allowance", code: "STI", category: "Allowance", sequence: 20 },
  { id: 4, name: "Performance Bonus", code: "BONU", category: "Allowance", sequence: 30 },
  { id: 5, name: "Leave Travel Allowance", code: "LTA", category: "Allowance", sequence: 40 },
  { id: 6, name: "Fixed Allowance", code: "FIX", category: "Allowance", sequence: 50 },
  { id: 7, name: "Gross Salary", code: "GROS", category: "Gross", sequence: 60 },
  { id: 8, name: "LWF Fund", code: "LWF", category: "Deduction", sequence: 70 },
  { id: 9, name: "Provident Fund", code: "PF", category: "Deduction", sequence: 80 },
  { id: 10, name: "ESIC", code: "ESIC", category: "Deduction", sequence: 90 },
  { id: 11, name: "Professional Tax", code: "PT", category: "Deduction", sequence: 100 },
  { id: 12, name: "Net Salary", code: "NET", category: "Net", sequence: 200 }
];

interface SalaryStructuresViewProps {
  currentUserRole?: UserRole;
  onNavigateToPayruns?: () => void;
  onNavigateToDashboard?: () => void;
}

export const SalaryStructuresView: React.FC<SalaryStructuresViewProps> = ({
  currentUserRole = "hr_payroll_manager",
  onNavigateToPayruns,
  onNavigateToDashboard
}) => {
  // Navigation & View Mode
  const [selectedStructureName, setSelectedStructureName] = useState<string | null>("Regular Salary");
  const [structureActive, setStructureActive] = useState<boolean>(true);
  const [structureRules, setStructureRules] = useState<StructureFormRule[]>(defaultRegularSalaryRules);

  // Selector / Modal states
  const [isNewStructureModalOpen, setIsNewStructureModalOpen] = useState<boolean>(false);
  const [newStructureNameInput, setNewStructureNameInput] = useState<string>("Executive Leadership");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Basic":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Allowance":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Gross":
        return "bg-indigo-50 text-indigo-800 border-indigo-200 font-semibold";
      case "Deduction":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "Net":
        return "bg-[#E8F3E6] text-[#0F2F1E] border-emerald-300 font-bold";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ════════════════════════════════════════════════════════════════════════
          SCREEN: SALARY STRUCTURE FORM VIEW (White Theme)
          Path: Salary Structure / Regular Salary
         ════════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0F2F1E]">
              Salary Structure / {selectedStructureName || "Regular Salary"}
            </h1>
            <p className="text-xs text-slate-500">
              Form view with its salary rules
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStructureName || "Regular Salary"}
              onChange={(e) => setSelectedStructureName(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="Regular Salary">Regular Salary</option>
              <option value="Standard Corporate Executive">Standard Corporate Executive</option>
              <option value="Tech Specialist Structure">Tech Specialist Structure</option>
            </select>
          </div>
        </div>

        {/* 2 Metadata Inputs: Structure Name, Active */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-500 block font-medium">Structure Name</label>
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold">
              {selectedStructureName || "Regular Salary"}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-500 block font-medium">Active</label>
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-semibold flex items-center justify-between">
              <span>{structureActive ? "True" : "False"}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>

        {/* ── Salary Rules Table ────────────────────────────────────────────── */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-[#0F2F1E] font-serif">
            Salary Rules
          </h3>

          <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Rule Name</th>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">Sequence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {structureRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-50/80 transition">
                      {/* Rule Name */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {rule.name}
                      </td>

                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {rule.code}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${getCategoryBadge(rule.category)}`}>
                          {rule.category}
                        </span>
                      </td>

                      {/* Sequence */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                        {rule.sequence}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Useful Note Footer */}
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Useful note:</span>
            <span>rule order matters. Keep sequence visible so participants understand the calculation order. Rules created here is just for reference.</span>
          </div>
        </div>
      </div>

      {/* ── Transition Arrow: Continue into dashboard view ─────────────────── */}
      {onNavigateToDashboard && (
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-[#0F2F1E]/5 via-[#0F2F1E]/10 to-[#0F2F1E]/5 rounded-3xl border border-[#0F2F1E]/20 text-center space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0F2F1E] font-serif">
            <span>↓</span>
            <span>Continue into dashboard view</span>
            <span>↓</span>
          </div>
          <p className="text-xs text-slate-600 max-w-lg">
            See aggregated payments, staffing impact, leave patterns, and attendance quality in the 6) Payroll Dashboard.
          </p>
          <button
            type="button"
            suppressHydrationWarning
            onClick={onNavigateToDashboard}
            className="px-6 py-2.5 rounded-xl bg-[#0F2F1E] text-[#9FD067] hover:bg-[#1A452C] font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Open Payroll Dashboard (Wireframe 6)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

