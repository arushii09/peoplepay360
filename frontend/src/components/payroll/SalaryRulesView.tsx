"use client";

import React, { useState, useMemo } from "react";
import {
  Code2,
  Plus,
  Search,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  Percent,
  Lock,
  Edit3,
  X,
  Check,
  ChevronRight,
  Code
} from "lucide-react";
import {
  SalaryStructure,
  SalaryRule,
  ComputationType,
  RuleCategory
} from "@/types/hr";
import { initialSalaryStructures, initialSalaryRules } from "@/lib/mock-data";
import { UserRole } from "@/components/auth/AuthView";

export interface ExtendedSalaryRuleItem {
  id: number;
  name: string;
  code: string;
  category: "Basic" | "Allowance" | "Gross" | "Deduction" | "Net";
  structure: string;
  sequence: number;
  computation: "Percentage of Wage" | "Fixed Amount" | "Python Code";
  percentage?: string;
  fixedAmount?: number;
  quantity: number;
  expression: string;
}

const defaultExtendedRules: ExtendedSalaryRuleItem[] = [
  {
    id: 1,
    name: "Basic Salary",
    code: "BASIC",
    category: "Basic",
    structure: "Regular Salary",
    sequence: 1,
    computation: "Percentage of Wage",
    percentage: "50%",
    quantity: 1,
    expression: "result = contract.wage * 0.50"
  },
  {
    id: 2,
    name: "House Rent Allowance",
    code: "HRA",
    category: "Allowance",
    structure: "Regular Salary",
    sequence: 10,
    computation: "Percentage of Wage",
    percentage: "20%",
    quantity: 1,
    expression: "result = contract.wage * 0.20"
  },
  {
    id: 3,
    name: "Standard Allowance",
    code: "STI",
    category: "Allowance",
    structure: "Regular Salary",
    sequence: 20,
    computation: "Fixed Amount",
    fixedAmount: 10000,
    quantity: 1,
    expression: "result = 10000"
  },
  {
    id: 4,
    name: "Performance Bonus",
    code: "BONU",
    category: "Allowance",
    structure: "Regular Salary",
    sequence: 30,
    computation: "Percentage of Wage",
    percentage: "5%",
    quantity: 1,
    expression: "result = contract.wage * 0.05"
  },
  {
    id: 5,
    name: "Leave Travel Allowance",
    code: "LTA",
    category: "Allowance",
    structure: "Regular Salary",
    sequence: 40,
    computation: "Percentage of Wage",
    percentage: "5%",
    quantity: 1,
    expression: "result = contract.wage * 0.05"
  },
  {
    id: 6,
    name: "Fixed Allowance",
    code: "FIX",
    category: "Allowance",
    structure: "Regular Salary",
    sequence: 50,
    computation: "Fixed Amount",
    fixedAmount: 5000,
    quantity: 1,
    expression: "result = 5000"
  },
  {
    id: 7,
    name: "Gross Salary",
    code: "GROS",
    category: "Gross",
    structure: "Regular Salary",
    sequence: 60,
    computation: "Python Code",
    quantity: 1,
    expression: "result = categories['BASIC'] + categories['ALLOWANCE']"
  },
  {
    id: 8,
    name: "LWF Fund",
    code: "LWF",
    category: "Deduction",
    structure: "Regular Salary",
    sequence: 70,
    computation: "Fixed Amount",
    fixedAmount: 200,
    quantity: 1,
    expression: "result = 200"
  },
  {
    id: 9,
    name: "Provident Fund",
    code: "PF",
    category: "Deduction",
    structure: "Regular Salary",
    sequence: 80,
    computation: "Percentage of Wage",
    percentage: "12%",
    quantity: 1,
    expression: "result = categories['BASIC'] * 0.12"
  },
  {
    id: 10,
    name: "ESIC",
    code: "ESIC",
    category: "Deduction",
    structure: "Regular Salary",
    sequence: 90,
    computation: "Percentage of Wage",
    percentage: "0.75%",
    quantity: 1,
    expression: "result = categories['GROSS'] * 0.0075"
  },
  {
    id: 11,
    name: "Professional Tax",
    code: "PT",
    category: "Deduction",
    structure: "Regular Salary",
    sequence: 100,
    computation: "Fixed Amount",
    fixedAmount: 1000,
    quantity: 1,
    expression: "result = 1000"
  },
  {
    id: 12,
    name: "Net Salary",
    code: "NET",
    category: "Net",
    structure: "Regular Salary",
    sequence: 200,
    computation: "Python Code",
    quantity: 1,
    expression: "result = categories['GROSS'] - categories['DEDUCTION']"
  }
];

interface SalaryRulesViewProps {
  currentUserRole?: UserRole;
  onNavigateToStructures?: () => void;
}

export const SalaryRulesView: React.FC<SalaryRulesViewProps> = ({
  currentUserRole = "hr_payroll_manager",
  onNavigateToStructures
}) => {
  const [rules, setRules] = useState<ExtendedSalaryRuleItem[]>(defaultExtendedRules);
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(null);
  const [structureFilter, setStructureFilter] = useState<string>("Regular Salary");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Edit / Creation modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeCompTab, setActiveCompTab] = useState<"Fixed Amount" | "Percentage of Wage" | "Python Code">("Percentage of Wage");

  // Selected Rule for Form View
  const activeRule = useMemo(() => {
    if (!selectedRuleId) return null;
    return rules.find((r) => r.id === selectedRuleId) || null;
  }, [rules, selectedRuleId]);

  // Filtered Rules for List View
  const filteredRules = useMemo(() => {
    return rules
      .filter((r) => {
        if (structureFilter !== "ALL" && r.structure !== structureFilter) {
          return false;
        }
        if (
          searchQuery &&
          !r.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !r.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !r.category.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.sequence - b.sequence);
  }, [rules, structureFilter, searchQuery]);

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
          SCREEN 2: SALARY RULE FORM VIEW (White Theme)
          Path: Salary Rule / Basic Salary
         ════════════════════════════════════════════════════════════════════════ */}
      {activeRule ? (
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          {/* Header & Back Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRuleId(null);
                    setIsEditing(false);
                  }}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition mr-1 cursor-pointer"
                  title="Back to Salary Rules List"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0F2F1E]">
                  Salary Rule / {activeRule.name}
                </h1>
              </div>
              <p className="text-xs text-slate-500 ml-8">
                Form view
              </p>
            </div>

            {/* Action Pill: EDIT */}
            <div className="flex items-center gap-2 ml-8 sm:ml-0">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                  isEditing
                    ? "bg-[#2563EB] text-white"
                    : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                }`}
              >
                {isEditing ? "SAVE CHANGES" : "EDIT"}
              </button>
            </div>
          </div>

          {/* 2-Column Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-xs">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 block font-medium">Rule Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={activeRule.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRules(rules.map((r) => (r.id === activeRule.id ? { ...r, name: val } : r)));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50/70"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 block font-medium">Code</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={activeRule.code}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setRules(rules.map((r) => (r.id === activeRule.id ? { ...r, code: val } : r)));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50/70"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 block font-medium">Category</label>
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold flex items-center justify-between">
                  <span>{activeRule.category}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${getCategoryBadge(activeRule.category)}`}>
                    {activeRule.category}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 block font-medium">Sequence</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={activeRule.sequence}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setRules(rules.map((r) => (r.id === activeRule.id ? { ...r, sequence: val } : r)));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50/70"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 block font-medium">Salary Structure</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={activeRule.structure}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRules(rules.map((r) => (r.id === activeRule.id ? { ...r, structure: val } : r)));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50/70"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 block font-medium">Computation</label>
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium">
                  {activeRule.computation}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 block font-medium">Percentage</label>
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-semibold">
                  {activeRule.percentage || (activeRule.fixedAmount ? `Flat ₹${activeRule.fixedAmount}` : "Dynamic Formula")}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 block font-medium">Quantity</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={activeRule.quantity}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50/70"
                />
              </div>
            </div>
          </div>

          {/* ── Section: Computation options from the source ──────────────────── */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-[#0F2F1E] font-serif">
              Computation options from the source
            </h3>

            <div className="border border-slate-200/90 rounded-2xl p-5 bg-slate-50/60 space-y-4">
              {/* Option Tabs */}
              <div className="flex items-center gap-6 border-b border-slate-200/80 pb-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveCompTab("Fixed Amount")}
                  className={`transition cursor-pointer pb-1 ${
                    activeCompTab === "Fixed Amount"
                      ? "text-[#0F2F1E] font-bold border-b-2 border-[#0F2F1E]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Fixed Amount
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCompTab("Percentage of Wage")}
                  className={`transition cursor-pointer pb-1 ${
                    activeCompTab === "Percentage of Wage"
                      ? "text-[#0F2F1E] font-bold border-b-2 border-[#0F2F1E]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Percentage of Wage
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCompTab("Python Code")}
                  className={`transition cursor-pointer pb-1 ${
                    activeCompTab === "Python Code"
                      ? "text-[#0F2F1E] font-bold border-b-2 border-[#0F2F1E]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Python Code
                </button>
              </div>

              {/* Expression Preview */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-sans font-semibold">
                  Example expression
                </span>
                <div className="text-emerald-800 font-bold text-sm">
                  {activeCompTab === "Percentage of Wage"
                    ? activeRule.percentage
                      ? `result = contract.wage * ${Number(activeRule.percentage.replace("%", "")) / 100}`
                      : "result = contract.wage * 0.50"
                    : activeCompTab === "Fixed Amount"
                    ? activeRule.fixedAmount
                      ? `result = ${activeRule.fixedAmount}`
                      : "result = 5000"
                    : activeRule.expression || "result = categories['BASIC']"}
                </div>
              </div>
            </div>
          </div>

          {/* Useful Note Footer */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
            <span className="font-semibold text-slate-700">Useful note:</span>
            <span>a Salary Rule needs a clear computation method and category because these drive the lines displayed on the final payslip.</span>
          </div>
        </div>
      ) : (
        /* ════════════════════════════════════════════════════════════════════════
            SCREEN 1: SALARY RULES LIST VIEW (White Theme)
            Path: Salary Rules
           ════════════════════════════════════════════════════════════════════════ */
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-serif tracking-tight text-[#0F2F1E]">
              Salary Rules
            </h1>
            <p className="text-sm text-slate-500">
              List view
            </p>
          </div>

          {/* Action & Filter Bar */}
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              className="px-6 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              NEW
            </button>

            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search salary rules..."
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>

            <div className="relative">
              <select
                value={structureFilter}
                onChange={(e) => setStructureFilter(e.target.value)}
                className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="Regular Salary">Regular Salary</option>
                <option value="Standard Corporate Executive">Standard Corporate Executive</option>
                <option value="Tech Specialist Structure">Tech Specialist Structure</option>
                <option value="ALL">All Structures</option>
              </select>
            </div>
          </div>

          {/* Rules Table */}
          <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Rule Name</th>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Structure</th>
                    <th className="py-3 px-4 text-center">Sequence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRules.map((rule) => (
                    <tr
                      key={rule.id}
                      onClick={() => setSelectedRuleId(rule.id)}
                      className="hover:bg-slate-50/80 transition cursor-pointer group"
                    >
                      {/* Rule Name */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900 group-hover:text-blue-600 transition">
                        {rule.name}
                      </td>

                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono text-slate-700 font-bold">
                        {rule.code}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${getCategoryBadge(rule.category)}`}>
                          {rule.category}
                        </span>
                      </td>

                      {/* Structure */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {rule.structure}
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

          {/* Useful Note Footer */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Useful note:</span>
              <span>List view should expose name, code, category, structure and sequence &mdash; the fields needed to understand a payroll rule quickly.</span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">Open salary rule</span>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE NEW RULE (White Theme) ────────────────────────────── */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-3xl p-6 border border-slate-200 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-[#0F2F1E] font-serif">Create Salary Rule</h3>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNewModalOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  defaultValue="New Salary Rule"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Code</label>
                  <input
                    type="text"
                    required
                    defaultValue="RULE_CODE"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Sequence</label>
                  <input
                    type="number"
                    required
                    defaultValue={35}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Salary Structure</label>
                <select
                  defaultValue={structureFilter}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Regular Salary">Regular Salary</option>
                  <option value="Standard Corporate Executive">Standard Corporate Executive</option>
                  <option value="Tech Specialist Structure">Tech Specialist Structure</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2563EB] text-white hover:bg-[#1D4ED8] font-bold transition shadow-xs cursor-pointer"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
