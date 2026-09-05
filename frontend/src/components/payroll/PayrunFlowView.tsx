"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  Plus,
  Search,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  Mail,
  Download,
  ArrowLeft,
  X,
  Check,
  Printer,
  Sparkles,
  Lock,
  Edit2,
  ShieldCheck,
  Send,
  ExternalLink,
  Users,
  ChevronRight
} from "lucide-react";
import { UserRole } from "@/components/auth/AuthView";

export interface SalaryComputationLine {
  rule: string;
  category: "Basic" | "Allowance" | "Gross" | "Deduction" | "Net";
  amount: number;
  code: string;
}

export interface MockPayslipItem {
  id: number;
  payrunId: number;
  payrunName: string;
  periodLabel: string;
  employeeName: string;
  avatarUrl?: string;
  salaryStructure: string;
  warning?: string | null;
  workedDays: number;
  basicWage: number;
  grossWage: number;
  netWage: number;
  status: "Draft" | "Done" | "Paid";
  bankAccountMissing?: boolean;
  computationLines: SalaryComputationLine[];
}

export interface MockPayrunCycle {
  id: number;
  name: string;
  periodStart: string;
  periodEnd: string;
  periodShort: string;
  salaryStructure: string;
  employeeCount: number;
  status: "Draft" | "Validated" | "Paid" | "Computed";
  warningsCount: number;
  payslips: MockPayslipItem[];
}

const defaultComputationAarav: SalaryComputationLine[] = [
  { rule: "Basic Salary", category: "Basic", amount: 50000, code: "BASIC" },
  { rule: "House Rent Allowance", category: "Allowance", amount: 20000, code: "HRA" },
  { rule: "Standard Allowance", category: "Allowance", amount: 10000, code: "STI" },
  { rule: "Gross Salary", category: "Gross", amount: 80000, code: "GROSS" },
  { rule: "Provident Fund", category: "Deduction", amount: -4000, code: "PF" },
  { rule: "Professional Tax", category: "Deduction", amount: -1000, code: "PT" },
  { rule: "Net Salary", category: "Net", amount: 75000, code: "NET" }
];

const defaultComputationSara: SalaryComputationLine[] = [
  { rule: "Basic Salary", category: "Basic", amount: 60000, code: "BASIC" },
  { rule: "House Rent Allowance", category: "Allowance", amount: 24000, code: "HRA" },
  { rule: "Special Allowance", category: "Allowance", amount: 12000, code: "SPA" },
  { rule: "Gross Salary", category: "Gross", amount: 96000, code: "GROSS" },
  { rule: "Provident Fund", category: "Deduction", amount: -6000, code: "PF" },
  { rule: "Professional Tax", category: "Deduction", amount: -2000, code: "PT" },
  { rule: "Net Salary", category: "Net", amount: 88000, code: "NET" }
];

const defaultComputationJohn: SalaryComputationLine[] = [
  { rule: "Basic Salary", category: "Basic", amount: 45000, code: "BASIC" },
  { rule: "House Rent Allowance", category: "Allowance", amount: 18000, code: "HRA" },
  { rule: "Travel Allowance", category: "Allowance", amount: 9000, code: "TA" },
  { rule: "Gross Salary", category: "Gross", amount: 72000, code: "GROSS" },
  { rule: "Provident Fund", category: "Deduction", amount: -5000, code: "PF" },
  { rule: "Professional Tax", category: "Deduction", amount: -1000, code: "PT" },
  { rule: "Net Salary", category: "Net", amount: 66000, code: "NET" }
];

const defaultComputationNeha: SalaryComputationLine[] = [
  { rule: "Basic Salary", category: "Basic", amount: 48000, code: "BASIC" },
  { rule: "House Rent Allowance", category: "Allowance", amount: 19200, code: "HRA" },
  { rule: "Standard Allowance", category: "Allowance", amount: 9600, code: "STI" },
  { rule: "Gross Salary", category: "Gross", amount: 76800, code: "GROSS" },
  { rule: "Provident Fund", category: "Deduction", amount: -4800, code: "PF" },
  { rule: "Professional Tax", category: "Deduction", amount: -1000, code: "PT" },
  { rule: "Net Salary", category: "Net", amount: 71000, code: "NET" }
];

const defaultPayruns: MockPayrunCycle[] = [
  {
    id: 1,
    name: "January 2026",
    periodStart: "01-Jan-2026",
    periodEnd: "31-Jan-2026",
    periodShort: "01-Jan — 31-Jan",
    salaryStructure: "Standard Corporate Executive",
    employeeCount: 42,
    status: "Paid",
    warningsCount: 1,
    payslips: [
      {
        id: 101,
        payrunId: 1,
        payrunName: "January 2026",
        periodLabel: "01-Jan — 31-Jan",
        employeeName: "Aarav Mehta",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        salaryStructure: "Regular Salary",
        warning: null,
        workedDays: 22,
        basicWage: 50000,
        grossWage: 80000,
        netWage: 75000,
        status: "Done",
        computationLines: defaultComputationAarav
      },
      {
        id: 102,
        payrunId: 1,
        payrunName: "January 2026",
        periodLabel: "01-Jan — 31-Jan",
        employeeName: "Sara Khan",
        avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80",
        salaryStructure: "Regular Salary",
        warning: "A/C missing",
        workedDays: 22,
        basicWage: 60000,
        grossWage: 96000,
        netWage: 88000,
        status: "Done",
        bankAccountMissing: true,
        computationLines: defaultComputationSara
      },
      {
        id: 103,
        payrunId: 1,
        payrunName: "January 2026",
        periodLabel: "01-Jan — 31-Jan",
        employeeName: "John Dsouza",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
        salaryStructure: "Regular Salary",
        warning: null,
        workedDays: 20,
        basicWage: 45000,
        grossWage: 72000,
        netWage: 66000,
        status: "Done",
        computationLines: defaultComputationJohn
      },
      {
        id: 104,
        payrunId: 1,
        payrunName: "January 2026",
        periodLabel: "01-Jan — 31-Jan",
        employeeName: "Neha Patel",
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
        salaryStructure: "Regular Salary",
        warning: null,
        workedDays: 21,
        basicWage: 48000,
        grossWage: 76800,
        netWage: 71000,
        status: "Done",
        computationLines: defaultComputationNeha
      }
    ]
  },
  {
    id: 2,
    name: "February 2026",
    periodStart: "01-Feb-2026",
    periodEnd: "28-Feb-2026",
    periodShort: "01-Feb — 28-Feb",
    salaryStructure: "Regular Salary",
    employeeCount: 42,
    status: "Validated",
    warningsCount: 2,
    payslips: [
      {
        id: 201,
        payrunId: 2,
        payrunName: "February 2026",
        periodLabel: "01-Feb — 28-Feb",
        employeeName: "Aarav Mehta",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        salaryStructure: "Regular Salary",
        warning: null,
        workedDays: 22,
        basicWage: 50000,
        grossWage: 80000,
        netWage: 75000,
        status: "Done",
        computationLines: defaultComputationAarav
      },
      {
        id: 202,
        payrunId: 2,
        payrunName: "February 2026",
        periodLabel: "01-Feb — 28-Feb",
        employeeName: "Sara Khan",
        avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80",
        salaryStructure: "Regular Salary",
        warning: "A/C missing",
        workedDays: 22,
        basicWage: 60000,
        grossWage: 96000,
        netWage: 88000,
        status: "Done",
        bankAccountMissing: true,
        computationLines: defaultComputationSara
      },
      {
        id: 203,
        payrunId: 2,
        payrunName: "February 2026",
        periodLabel: "01-Feb — 28-Feb",
        employeeName: "John Dsouza",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
        salaryStructure: "Regular Salary",
        warning: "Duplicate",
        workedDays: 20,
        basicWage: 45000,
        grossWage: 72000,
        netWage: 66000,
        status: "Draft",
        computationLines: defaultComputationJohn
      },
      {
        id: 204,
        payrunId: 2,
        payrunName: "February 2026",
        periodLabel: "01-Feb — 28-Feb",
        employeeName: "Neha Patel",
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
        salaryStructure: "Regular Salary",
        warning: null,
        workedDays: 21,
        basicWage: 48000,
        grossWage: 76800,
        netWage: 71000,
        status: "Done",
        computationLines: defaultComputationNeha
      }
    ]
  },
  {
    id: 3,
    name: "March 2026",
    periodStart: "01-Mar-2026",
    periodEnd: "31-Mar-2026",
    periodShort: "01-Mar — 31-Mar",
    salaryStructure: "Regular Salary",
    employeeCount: 42,
    status: "Draft",
    warningsCount: 0,
    payslips: [
      {
        id: 301,
        payrunId: 3,
        payrunName: "March 2026",
        periodLabel: "01-Mar — 31-Mar",
        employeeName: "Aarav Mehta",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        salaryStructure: "Regular Salary",
        warning: null,
        workedDays: 22,
        basicWage: 50000,
        grossWage: 80000,
        netWage: 75000,
        status: "Draft",
        computationLines: defaultComputationAarav
      },
      {
        id: 302,
        payrunId: 3,
        payrunName: "March 2026",
        periodLabel: "01-Mar — 31-Mar",
        employeeName: "Sara Khan",
        avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80",
        salaryStructure: "Regular Salary",
        warning: null,
        workedDays: 22,
        basicWage: 60000,
        grossWage: 96000,
        netWage: 88000,
        status: "Draft",
        computationLines: defaultComputationSara
      },
      {
        id: 303,
        payrunId: 3,
        payrunName: "March 2026",
        periodLabel: "01-Mar — 31-Mar",
        employeeName: "John Dsouza",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
        salaryStructure: "Regular Salary",
        warning: null,
        workedDays: 22,
        basicWage: 45000,
        grossWage: 72000,
        netWage: 66000,
        status: "Draft",
        computationLines: defaultComputationJohn
      }
    ]
  }
];

interface PayrunFlowViewProps {
  currentUserRole?: UserRole;
  initialPayrunId?: number | null;
}

export const PayrunFlowView: React.FC<PayrunFlowViewProps> = ({
  currentUserRole = "hr_payroll_manager",
  initialPayrunId = null
}) => {
  // Navigation & Drill-Down State
  const [activeTab, setActiveTab] = useState<"payruns" | "payslips">("payruns");
  const [payruns, setPayruns] = useState<MockPayrunCycle[]>(defaultPayruns);
  const [selectedPayrunId, setSelectedPayrunId] = useState<number | null>(initialPayrunId);
  const [selectedPayslipId, setSelectedPayslipId] = useState<number | null>(null);

  // Search & Period Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>("2026");
  const [payslipsPeriodFilter, setPayslipsPeriodFilter] = useState<string>("Feb 2026");

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [activePdfPayslip, setActivePdfPayslip] = useState<MockPayslipItem | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState<string | null>(null);

  // New Payrun Form State
  const [newName, setNewName] = useState<string>("April 2026");
  const [newStart, setNewStart] = useState<string>("01-Apr-2026");
  const [newEnd, setNewEnd] = useState<string>("30-Apr-2026");
  const [newStructure, setNewStructure] = useState<string>("Regular Salary");

  // Selected Active Payrun
  const activePayrun = useMemo(() => {
    return payruns.find((p) => p.id === selectedPayrunId) || null;
  }, [payruns, selectedPayrunId]);

  // All Flat Payslips across all payrun cycles
  const allPayslips = useMemo(() => {
    return payruns.flatMap((p) => p.payslips);
  }, [payruns]);

  // Selected Active Single Payslip (for Drill-Down Detail Screen)
  const activeSinglePayslip = useMemo(() => {
    if (!selectedPayslipId) return null;
    return allPayslips.find((ps) => ps.id === selectedPayslipId) || null;
  }, [allPayslips, selectedPayslipId]);

  // Filtered Payruns List
  const filteredPayruns = useMemo(() => {
    return payruns.filter((p) => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (yearFilter && !p.periodStart.includes(yearFilter)) {
        return false;
      }
      return true;
    });
  }, [payruns, searchQuery, yearFilter]);

  // Filtered Flat Payslips List (for Global Payslips View)
  const filteredPayslips = useMemo(() => {
    return allPayslips.filter((ps) => {
      if (
        searchQuery &&
        !ps.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ps.payrunName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (payslipsPeriodFilter !== "ALL") {
        if (payslipsPeriodFilter === "Feb 2026" && !ps.payrunName.includes("February")) return false;
        if (payslipsPeriodFilter === "Jan 2026" && !ps.payrunName.includes("January")) return false;
        if (payslipsPeriodFilter === "Mar 2026" && !ps.payrunName.includes("March")) return false;
      }
      return true;
    });
  }, [allPayslips, searchQuery, payslipsPeriodFilter]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleComputePayrun = () => {
    if (!activePayrun) return;
    const updated = payruns.map((p) => {
      if (p.id === activePayrun.id) {
        return {
          ...p,
          status: "Computed" as const,
          payslips: p.payslips.map((ps) => ({ ...ps, status: "Done" as const }))
        };
      }
      return p;
    });
    setPayruns(updated);
  };

  const handleValidatePayrun = () => {
    if (!activePayrun) return;
    const updated = payruns.map((p) => {
      if (p.id === activePayrun.id) {
        return {
          ...p,
          status: "Validated" as const,
          payslips: p.payslips.map((ps) => ({ ...ps, status: "Done" as const }))
        };
      }
      return p;
    });
    setPayruns(updated);
  };

  const handleMarkPayrunPaid = () => {
    if (!activePayrun) return;
    const updated = payruns.map((p) => {
      if (p.id === activePayrun.id) {
        return {
          ...p,
          status: "Paid" as const,
          payslips: p.payslips.map((ps) => ({ ...ps, status: "Paid" as const }))
        };
      }
      return p;
    });
    setPayruns(updated);
  };

  const handleComputeSinglePayslip = () => {
    if (!activeSinglePayslip) return;
    const updated = payruns.map((p) => ({
      ...p,
      payslips: p.payslips.map((ps) => {
        if (ps.id === activeSinglePayslip.id) {
          return { ...ps, status: "Done" as const };
        }
        return ps;
      })
    }));
    setPayruns(updated);
  };

  const handleMarkSinglePayslipPaid = () => {
    if (!activeSinglePayslip) return;
    const updated = payruns.map((p) => ({
      ...p,
      payslips: p.payslips.map((ps) => {
        if (ps.id === activeSinglePayslip.id) {
          return { ...ps, status: "Paid" as const };
        }
        return ps;
      })
    }));
    setPayruns(updated);
  };

  const handleExecuteSendEmails = () => {
    setEmailStatusMessage("Dispatching 42 digital payslip PDF emails via SMTP...");
    setTimeout(() => {
      setEmailStatusMessage("All 42 payslips dispatched successfully!");
      setTimeout(() => {
        setIsEmailModalOpen(false);
        setEmailStatusMessage(null);
      }, 1500);
    }, 1200);
  };

  const handleCreateNewPayrun = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Date.now();
    const newPayrun: MockPayrunCycle = {
      id: newId,
      name: newName,
      periodStart: newStart,
      periodEnd: newEnd,
      periodShort: `${newStart.slice(0, 6)} — ${newEnd.slice(0, 6)}`,
      salaryStructure: newStructure,
      employeeCount: 42,
      status: "Draft",
      warningsCount: 0,
      payslips: [
        {
          id: newId + 1,
          payrunId: newId,
          payrunName: newName,
          periodLabel: `${newStart.slice(0, 6)} — ${newEnd.slice(0, 6)}`,
          employeeName: "Aarav Mehta",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
          salaryStructure: newStructure,
          workedDays: 22,
          basicWage: 50000,
          grossWage: 80000,
          netWage: 75000,
          status: "Draft",
          computationLines: defaultComputationAarav
        },
        {
          id: newId + 2,
          payrunId: newId,
          payrunName: newName,
          periodLabel: `${newStart.slice(0, 6)} — ${newEnd.slice(0, 6)}`,
          employeeName: "Sara Khan",
          avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80",
          salaryStructure: newStructure,
          workedDays: 22,
          basicWage: 60000,
          grossWage: 96000,
          netWage: 88000,
          status: "Draft",
          computationLines: defaultComputationSara
        }
      ]
    };

    setPayruns([...payruns, newPayrun]);
    setSelectedPayrunId(newPayrun.id);
    setIsNewModalOpen(false);
  };

  const formatK = (val: number) => {
    return `₹${Math.round(val / 1000)}k`;
  };

  const getCategoryBadgeClass = (category: string) => {
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
      {/* ── TOP TOGGLE TABS (When not in deep drill-down) ────────────────── */}
      {!activeSinglePayslip && !activePayrun && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab("payruns");
              setSearchQuery("");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "payruns"
                ? "bg-[#0F2F1E] text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Payrun Cycles (Periods)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("payslips");
              setSearchQuery("");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "payslips"
                ? "bg-[#0F2F1E] text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>All Payslips (Global View)</span>
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          SCREEN 3: SINGLE PAYSLIP DETAILED COMPUTATION VIEW (Light Theme)
          Path: Payslip / Aarav Mehta / February 2026
         ════════════════════════════════════════════════════════════════════════ */}
      {activeSinglePayslip ? (
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          {/* Top Header & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayslipId(null)}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition mr-1 cursor-pointer"
                  title="Back to previous view"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0F2F1E]">
                  Payslip / {activeSinglePayslip.employeeName} / {activeSinglePayslip.payrunName}
                </h1>
              </div>
              <p className="text-xs text-slate-500 ml-8">
                Detailed salary computation for one employee
              </p>
            </div>

            {/* Action Pills: COMPUTE, MARK PAID, PRINT PAYSLIP */}
            <div className="flex items-center gap-2 flex-wrap ml-8 sm:ml-0">
              <button
                type="button"
                onClick={handleComputeSinglePayslip}
                className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                COMPUTE
              </button>

              <button
                type="button"
                onClick={handleMarkSinglePayslipPaid}
                className="px-5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition shadow-xs cursor-pointer"
              >
                MARK PAID
              </button>

              <button
                type="button"
                onClick={() => setActivePdfPayslip(activeSinglePayslip)}
                className="px-5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PRINT PAYSLIP</span>
              </button>
            </div>
          </div>

          {/* 6 Metadata Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 block font-medium">Employee</label>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold flex items-center gap-2">
                <img
                  src={
                    activeSinglePayslip.avatarUrl ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  }
                  alt={activeSinglePayslip.employeeName}
                  className="w-5 h-5 rounded-full object-cover border border-slate-200"
                />
                <span>{activeSinglePayslip.employeeName}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 block font-medium">Period</label>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono">
                {activeSinglePayslip.periodLabel}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 block font-medium">Salary Structure</label>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium">
                {activeSinglePayslip.salaryStructure}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 block font-medium">Status</label>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold flex items-center justify-between">
                <span>{activeSinglePayslip.status}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeSinglePayslip.status === "Paid"
                      ? "bg-emerald-500"
                      : activeSinglePayslip.status === "Done"
                      ? "bg-blue-500"
                      : "bg-slate-400"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 block font-medium">Pay Run</label>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium">
                {activeSinglePayslip.payrunName}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 block font-medium">Worked Days</label>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold">
                {activeSinglePayslip.workedDays}
              </div>
            </div>
          </div>

          {/* ── Salary Computation Table ────────────────────────────────────── */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-[#0F2F1E] font-serif">
              Salary Computation
            </h3>

            <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Rule</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-center">Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {activeSinglePayslip.computationLines.map((line, idx) => {
                      const isNet = line.category === "Net";
                      const isGross = line.category === "Gross";
                      const isDeduction = line.category === "Deduction";

                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-slate-50/80 transition ${
                            isNet ? "bg-emerald-50/40 font-bold text-slate-900" : ""
                          }`}
                        >
                          {/* Rule Name */}
                          <td className="py-3.5 px-4 font-medium text-slate-900">
                            {line.rule}
                          </td>

                          {/* Category Badge */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[10px] font-medium border ${getCategoryBadgeClass(
                                line.category
                              )}`}
                            >
                              {line.category}
                            </span>
                          </td>

                          {/* Amount */}
                          <td
                            className={`py-3.5 px-4 text-right font-mono font-semibold ${
                              isDeduction
                                ? "text-rose-600"
                                : isNet
                                ? "text-emerald-900 text-sm font-bold"
                                : isGross
                                ? "text-indigo-900 font-bold"
                                : "text-slate-800"
                            }`}
                          >
                            {line.amount < 0
                              ? `-₹${Math.abs(line.amount).toLocaleString()}`
                              : `₹${line.amount.toLocaleString()}`}
                          </td>

                          {/* Code */}
                          <td className="py-3.5 px-4 text-center font-mono text-slate-500 font-semibold text-[11px]">
                            {line.code}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Useful Note Footer */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
            <span className="font-semibold text-slate-700">Useful note:</span>
            <span>the Print action generates the employee payslip as PDF; that PDF can be sent from the parent Payrun.</span>
          </div>
        </div>
      ) : activePayrun ? (
        /* ════════════════════════════════════════════════════════════════════════
            SCREEN 2A: PAYRUN DETAIL & PAYSLIPS IN THIS PAYRUN (Light Theme)
            Path: Payrun / February 2026
           ════════════════════════════════════════════════════════════════════════ */
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          {/* Header & Back Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayrunId(null)}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition mr-1 cursor-pointer"
                  title="Back to all Payruns"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0F2F1E]">
                  Payrun / {activePayrun.name}
                </h1>
              </div>
              <p className="text-xs text-slate-500 ml-8">
                Open one Payrun to compute and manage its payslips
              </p>
            </div>

            {/* Top Action Pills (Compute, Validate, Mark Paid, Send Payslips) */}
            <div className="flex items-center gap-2 flex-wrap ml-8 sm:ml-0">
              <button
                type="button"
                onClick={handleComputePayrun}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                COMPUTE
              </button>

              <button
                type="button"
                onClick={handleValidatePayrun}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition shadow-xs cursor-pointer"
              >
                VALIDATE
              </button>

              <button
                type="button"
                onClick={handleMarkPayrunPaid}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition shadow-xs cursor-pointer"
              >
                MARK PAID
              </button>

              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className="px-5 py-2 rounded-xl bg-[#9333EA] hover:bg-[#7E22CE] text-white text-xs font-bold transition shadow-xs cursor-pointer ml-auto sm:ml-2"
              >
                SEND PAYSLIPS
              </button>
            </div>
          </div>

          {/* Form / Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 block font-medium">Name</label>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold">
                {activePayrun.name}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 block font-medium">Salary Structure</label>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium">
                {activePayrun.salaryStructure}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 block font-medium">Period</label>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono">
                {activePayrun.periodShort}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 block font-medium">Status</label>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold flex items-center justify-between">
                <span>{activePayrun.status}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>

          {/* ── Payslips in this Payrun Table ───────────────────────────────── */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F2F1E] font-serif">
                Payslips in this Payrun
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Click any row to open detailed calculation
              </span>
            </div>

            <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Warning</th>
                      <th className="py-3 px-4 text-center">Worked</th>
                      <th className="py-3 px-4 text-right">Basic</th>
                      <th className="py-3 px-4 text-right">Gross</th>
                      <th className="py-3 px-4 text-right">Net</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">PDF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {activePayrun.payslips.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedPayslipId(item.id)}
                        className="hover:bg-slate-50/80 transition cursor-pointer group"
                      >
                        {/* Employee Name */}
                        <td className="py-3.5 px-4 font-medium text-slate-900 flex items-center gap-2.5">
                          <img
                            src={
                              item.avatarUrl ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                            }
                            alt={item.employeeName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <span className="group-hover:text-blue-600 transition font-medium">
                            {item.employeeName}
                          </span>
                        </td>

                        {/* Warning */}
                        <td className="py-3.5 px-4">
                          {item.warning ? (
                            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-semibold text-[11px] inline-block">
                              {item.warning}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono">&mdash;</span>
                          )}
                        </td>

                        {/* Worked Days */}
                        <td className="py-3.5 px-4 text-center font-mono text-slate-600 font-medium">
                          {item.workedDays}
                        </td>

                        {/* Basic */}
                        <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-800">
                          {formatK(item.basicWage)}
                        </td>

                        {/* Gross */}
                        <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-800">
                          {formatK(item.grossWage)}
                        </td>

                        {/* Net */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                          {formatK(item.netWage)}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                              item.status === "Done" || item.status === "Paid"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* PDF Action */}
                        <td
                          className="py-3.5 px-4 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePdfPayslip(item);
                          }}
                        >
                          <button
                            type="button"
                            className="px-2.5 py-1 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition text-[11px] font-mono font-bold cursor-pointer"
                          >
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Useful Note Footer */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
            <span className="font-semibold text-slate-700">Useful note:</span>
            <span>warnings such as missing account data or duplicate payslips should be visible before payroll is finalized.</span>
          </div>
        </div>
      ) : activeTab === "payslips" ? (
        /* ════════════════════════════════════════════════════════════════════════
            SCREEN 2B: GLOBAL PAYSLIPS LIST VIEW (Light Theme)
            Path: Payslips
           ════════════════════════════════════════════════════════════════════════ */
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-serif tracking-tight text-[#0F2F1E]">
              Payslips
            </h1>
            <p className="text-sm text-slate-500">
              List view of employee payslips
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
                placeholder="Search payslips..."
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>

            <div className="relative">
              <select
                value={payslipsPeriodFilter}
                onChange={(e) => setPayslipsPeriodFilter(e.target.value)}
                className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="Feb 2026">Period: Feb 2026</option>
                <option value="Jan 2026">Period: Jan 2026</option>
                <option value="Mar 2026">Period: Mar 2026</option>
                <option value="ALL">All Periods</option>
              </select>
            </div>
          </div>

          {/* Global Payslips Table */}
          <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Warning</th>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4 text-right">Basic</th>
                    <th className="py-3 px-4 text-right">Gross</th>
                    <th className="py-3 px-4 text-right">Net</th>
                    <th className="py-3 px-4">Structure</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredPayslips.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedPayslipId(item.id)}
                      className="hover:bg-slate-50/80 transition cursor-pointer group"
                    >
                      {/* Employee Name */}
                      <td className="py-3.5 px-4 font-medium text-slate-900 flex items-center gap-2.5">
                        <img
                          src={
                            item.avatarUrl ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                          }
                          alt={item.employeeName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <span className="group-hover:text-blue-600 transition font-medium">
                          {item.employeeName}
                        </span>
                      </td>

                      {/* Warning */}
                      <td className="py-3.5 px-4">
                        {item.warning ? (
                          <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-semibold text-[11px] inline-block">
                            {item.warning}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">&mdash;</span>
                        )}
                      </td>

                      {/* Period */}
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {item.periodLabel}
                      </td>

                      {/* Basic */}
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-800">
                        {formatK(item.basicWage)}
                      </td>

                      {/* Gross */}
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-800">
                        {formatK(item.grossWage)}
                      </td>

                      {/* Net */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        {formatK(item.netWage)}
                      </td>

                      {/* Structure */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {item.salaryStructure}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                            item.status === "Done" || item.status === "Paid"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {item.status}
                        </span>
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
              <span>selecting any payslip opens the detailed salary computation and PDF action for that employee.</span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">Open selected payslip</span>
          </div>
        </div>
      ) : (
        /* ════════════════════════════════════════════════════════════════════════
            SCREEN 1: PAYRUNS LIST VIEW (Light Theme)
            Path: Payruns
           ════════════════════════════════════════════════════════════════════════ */
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-serif tracking-tight text-[#0F2F1E]">
              Payruns
            </h1>
            <p className="text-sm text-slate-500">
              Payrun view for payroll periods
            </p>
          </div>

          {/* Action & Filter Bar */}
          <div className="flex items-center gap-3 pt-2">
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
                placeholder="Search payruns..."
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>

            <div className="relative">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>

          {/* List of Payrun Cards */}
          <div className="space-y-3 pt-2">
            {filteredPayruns.map((payrun) => {
              const isPaid = payrun.status === "Paid";
              const isValidated = payrun.status === "Validated";
              const isDraft = payrun.status === "Draft";

              return (
                <div
                  key={payrun.id}
                  onClick={() => setSelectedPayrunId(payrun.id)}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-2xs"
                >
                  {/* Left: Title & Dates */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition font-serif">
                      {payrun.name}
                    </h3>
                    <div className="text-xs text-slate-500 font-mono">
                      {payrun.periodStart} &mdash; {payrun.periodEnd}
                    </div>
                  </div>

                  {/* Center: Employees Count */}
                  <div className="text-xs text-slate-600 font-medium text-center hidden sm:block">
                    {payrun.employeeCount} employees
                  </div>

                  {/* Right: Status, Warnings & Edit Button */}
                  <div className="flex items-center gap-6">
                    <div className="text-right space-y-0.5">
                      <div
                        className={`text-xs font-semibold ${
                          isPaid
                            ? "text-emerald-700"
                            : isValidated
                            ? "text-blue-600"
                            : "text-slate-600"
                        }`}
                      >
                        {payrun.status}
                      </div>
                      <div
                        className={`text-xs ${
                          payrun.warningsCount > 0
                            ? "text-amber-600 font-medium"
                            : "text-slate-400"
                        }`}
                      >
                        {payrun.warningsCount > 0
                          ? `${payrun.warningsCount} ${
                              payrun.warningsCount === 1 ? "warning" : "warnings"
                            }`
                          : "No warnings"}
                      </div>
                    </div>

                    {/* Blue check/edit square */}
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition">
                      <Edit2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Useful Note Footer */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
            <span className="font-semibold text-slate-700">Useful note:</span>
            <span>each Payrun represents one payroll period and groups the payslips generated for that period.</span>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE NEW PAYRUN (Light Theme) ──────────────────────────── */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-3xl p-6 border border-slate-200 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-[#0F2F1E] font-serif">Create New Payrun</h3>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewPayrun} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Payrun Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Start Date</label>
                  <input
                    type="text"
                    required
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">End Date</label>
                  <input
                    type="text"
                    required
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Salary Structure</label>
                <select
                  value={newStructure}
                  onChange={(e) => setNewStructure(e.target.value)}
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
                  Save Payrun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EXECUTIVE PAYSLIP PDF PREVIEW (Light Theme) ──────────────── */}
      {activePdfPayslip && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-3xl p-8 border border-slate-200 shadow-2xl max-w-xl w-full space-y-6 print:m-0 print:p-0">
            {/* Payslip Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold">
                  PeoplePay 360 Official Payslip
                </span>
                <h2 className="text-xl font-bold font-serif text-[#0F2F1E] mt-1">
                  Salary Disbursement Statement
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  Period: {activePdfPayslip.periodLabel} ({activePdfPayslip.payrunName})
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActivePdfPayslip(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition print:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Employee Info Card */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Employee Name</span>
                <span className="font-bold text-slate-900 text-sm">
                  {activePdfPayslip.employeeName}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Days Worked in Cycle</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {activePdfPayslip.workedDays} Days
                </span>
              </div>
            </div>

            {/* Line Items Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-900 border-b border-slate-200 pb-1">
                Earnings & Allowances
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Basic Salary</span>
                <span className="font-mono font-medium">₹{activePdfPayslip.basicWage.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>House Rent & Living Allowances</span>
                <span className="font-mono font-medium">
                  ₹{(activePdfPayslip.grossWage - activePdfPayslip.basicWage).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 font-bold text-slate-900 border-t border-slate-100">
                <span>Gross Wage</span>
                <span className="font-mono">₹{activePdfPayslip.grossWage.toLocaleString()}</span>
              </div>

              <div className="font-semibold text-slate-900 border-b border-slate-200 pb-1 pt-3">
                Statutory Deductions
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Provident Fund (EPFO) & Tax</span>
                <span className="font-mono text-rose-600">
                  -₹{(activePdfPayslip.grossWage - activePdfPayslip.netWage).toLocaleString()}
                </span>
              </div>

              {/* Net Payable Highlight */}
              <div className="p-4 rounded-2xl bg-[#0F2F1E] text-white flex items-center justify-between mt-4">
                <div>
                  <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-mono">
                    Net Take-Home Pay
                  </span>
                  <span className="text-xl font-bold font-mono text-emerald-200">
                    ₹{activePdfPayslip.netWage.toLocaleString()}
                  </span>
                </div>
                <div className="text-right text-[10px] text-emerald-300/80">
                  <span>Direct Bank Wire</span>
                  <div className="font-mono font-semibold">Status: Verified</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePdfPayslip(null)}
                className="px-5 py-2 rounded-xl bg-[#0F2F1E] text-white font-semibold text-xs hover:bg-[#184a2f] transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: SEND PAYSLIPS BULK EMAIL (Light Theme) ───────────────────── */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-3xl p-6 border border-slate-200 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0F2F1E] font-serif">Send Digital Payslips</h3>
                  <span className="text-[11px] text-slate-500">
                    Bulk email dispatch for {activePayrun?.name}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will automatically generate encrypted PDF payslips and email them directly to all{" "}
              <span className="font-bold text-slate-900">
                {activePayrun?.employeeCount || 42} employees
              </span>{" "}
              in this payrun cycle.
            </p>

            {emailStatusMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono">
                {emailStatusMessage}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteSendEmails}
                className="px-5 py-2 rounded-xl bg-[#9333EA] hover:bg-[#7E22CE] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Emails Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
