"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  Calendar,
  Layers,
  Users,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Clock,
  DollarSign,
  FileSpreadsheet,
  Check,
  X,
  Play,
  Info
} from "lucide-react";
import {
  Employee,
  SalaryStructure,
  Payrun,
  PayrunStatus,
  Payslip
} from "@/types/hr";
import {
  initialEmployees,
  initialSalaryStructures
} from "@/lib/mock-data";
import { UserRole } from "@/components/auth/AuthView";

interface CreatePayrunWizardProps {
  currentUserRole?: UserRole;
  onPayrunCreated: (newPayrun: Payrun) => void;
  onCancel: () => void;
}

export const CreatePayrunWizard: React.FC<CreatePayrunWizardProps> = ({
  currentUserRole = "hr_payroll_manager",
  onPayrunCreated,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [structures] = useState<SalaryStructure[]>(initialSalaryStructures);
  const [employees] = useState<Employee[]>(initialEmployees);

  // ── Step 1 Form: Period & Structure ─────────────────────────────────────────
  const [payrunName, setPayrunName] = useState<string>("November 2026 Regular Payrun");
  const [periodStart, setPeriodStart] = useState<string>("2026-11-01");
  const [periodEnd, setPeriodEnd] = useState<string>("2026-11-30");
  const [selectedStructureId, setSelectedStructureId] = useState<number>(1);

  // ── Step 2 Form: Employee Selection & Filters ──────────────────────────────
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>(
    employees.map((e) => e.id)
  );
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");

  // ── Step 3: Calculation & Evaluation State ──────────────────────────────────
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  const selectedStructure =
    structures.find((s) => s.id === selectedStructureId) || structures[0];

  // Filtered Employees in Step 2
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      if (departmentFilter !== "ALL" && e.department !== departmentFilter) {
        return false;
      }
      return true;
    });
  }, [employees, departmentFilter]);

  const departments = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.department))).filter(Boolean);
  }, [employees]);

  // Toggle Single Employee
  const handleToggleEmployee = (id: number) => {
    if (selectedEmployeeIds.includes(id)) {
      setSelectedEmployeeIds(selectedEmployeeIds.filter((empId) => empId !== id));
    } else {
      setSelectedEmployeeIds([...selectedEmployeeIds, id]);
    }
  };

  // Toggle All Employees
  const handleToggleAllEmployees = () => {
    if (selectedEmployeeIds.length === filteredEmployees.length) {
      setSelectedEmployeeIds([]);
    } else {
      setSelectedEmployeeIds(filteredEmployees.map((e) => e.id));
    }
  };

  // ─── Step 3 Deterministic Calculation Engine ────────────────────────────────
  const previewCalculationResults = useMemo(() => {
    const includedEmployees = employees.filter((e) =>
      selectedEmployeeIds.includes(e.id)
    );

    let totalGross = 0;
    let totalDeductions = 0;
    let totalNet = 0;
    let blockingCount = 0;
    let warningCount = 0;

    const calculatedPayslips: Payslip[] = includedEmployees.map((emp) => {
      const activeContract = emp.contracts?.find((c) => c.status === "ACTIVE") || emp.contracts?.[0];
      const wage = activeContract ? activeContract.wage : 60000;

      // Extract attendances for this period
      const attendances = emp.attendances || [];
      const workedHoursTotal = attendances.reduce((acc, a) => acc + (a.worked_hours || 0), 0) || 160;
      const overtimeHoursTotal = attendances.reduce((acc, a) => acc + (a.overtime_hours || 0), 0);

      // Extract leave requests
      const leaveRequests = emp.leave_requests || [];
      const unpaidDays = leaveRequests
        .filter((l) => l.status === "APPROVED" && l.time_off_code === "UNPAID")
        .reduce((acc, l) => acc + l.days, 0);

      // Deterministic Formula Calculations
      const basic = wage * 0.50;
      const hra = wage * 0.20;
      const da = wage * 0.10;
      const hourlyRate = wage / 160.0;
      const otPay = overtimeHoursTotal * hourlyRate * 1.5;
      const gross = basic + hra + da + otPay;

      const pf = basic * 0.12;
      const dailyRate = wage / 26.0;
      const leaveDeduction = unpaidDays * dailyRate;
      const deductions = pf + leaveDeduction;
      const net = gross - deductions;

      // Warnings & Blocking Preflight Checks
      const warnings: string[] = [];
      const blockingErrors: string[] = [];

      if (!emp.bank_account_no) {
        blockingErrors.push("Missing bank account details — cannot disburse");
      }
      if (!emp.tax_id) {
        blockingErrors.push("Missing PAN / Tax ID — statutory violation");
      }
      if (unpaidDays > 0) {
        warnings.push(`${unpaidDays} day unpaid leave deduction applied (-₹${Math.round(leaveDeduction).toLocaleString()})`);
      }
      if (overtimeHoursTotal > 0) {
        warnings.push(`${overtimeHoursTotal} hrs overtime credited (+₹${Math.round(otPay).toLocaleString()})`);
      }

      if (blockingErrors.length > 0) blockingCount += blockingErrors.length;
      if (warnings.length > 0) warningCount += warnings.length;

      totalGross += gross;
      totalDeductions += deductions;
      totalNet += net;

      return {
        id: Date.now() + emp.id,
        payrun_id: 0,
        payrun_name: payrunName,
        employee_id: emp.id,
        employee_name: `${emp.first_name} ${emp.last_name}`,
        employee_avatar: emp.avatar_url || undefined,
        employee_department: emp.department,
        employee_job: emp.job_position,
        contract_wage: wage,
        period_start: periodStart,
        period_end: periodEnd,
        worked_days: 22 - unpaidDays,
        total_hours: workedHoursTotal,
        overtime_hours: overtimeHoursTotal,
        unpaid_leave_days: unpaidDays,
        basic_wage: basic,
        gross_wage: gross,
        total_deductions: deductions,
        net_wage: net,
        status: "COMPUTED",
        warnings,
        blocking_errors: blockingErrors
      };
    });

    return {
      payslips: calculatedPayslips,
      totalGross: Math.round(totalGross),
      totalDeductions: Math.round(totalDeductions),
      totalNet: Math.round(totalNet),
      blockingCount,
      warningCount
    };
  }, [employees, selectedEmployeeIds, payrunName, periodStart, periodEnd]);

  // Execute Step 3 Run
  const handleRunCalculation = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setHasCalculated(true);
    }, 600);
  };

  // Final Submission
  const handleFinishPayrun = (status: PayrunStatus) => {
    const newPayrun: Payrun = {
      id: Date.now(),
      name: payrunName,
      period_start: periodStart,
      period_end: periodEnd,
      salary_structure_id: selectedStructureId,
      salary_structure_name: selectedStructure.name,
      status,
      total_gross: previewCalculationResults.totalGross,
      total_deductions: previewCalculationResults.totalDeductions,
      total_net: previewCalculationResults.totalNet,
      employee_count: selectedEmployeeIds.length,
      warnings_count: previewCalculationResults.warningCount,
      blocking_errors_count: previewCalculationResults.blockingCount,
      created_at: new Date().toISOString(),
      payslips: previewCalculationResults.payslips
    };

    onPayrunCreated(newPayrun);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Wizard Header & Stepper Progress ───────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Row 5 Engine Wizard
              </span>
              <h2 className="font-display font-bold text-xl text-[#0F2F1E] font-serif">
                Create New Payrun Cycle
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select pay period, review employee attendance feeds, and trigger preflight calculation audit.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition cursor-pointer self-start sm:self-auto"
          >
            Cancel & Return
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
          {[
            { step: 1, title: "1. Period & Structure", desc: "Dates & Ruleset" },
            { step: 2, title: "2. Employee Inclusion", desc: `${selectedEmployeeIds.length} Selected` },
            { step: 3, title: "3. Calculate Preview", desc: hasCalculated ? "Audit Complete" : "Preflight Check" }
          ].map((item) => {
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;
            return (
              <div
                key={item.step}
                className={`p-3 rounded-2xl border transition-all ${
                  isActive
                    ? "bg-[#0F2F1E] text-white border-emerald-800 shadow-xs"
                    : isCompleted
                    ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                    : "bg-slate-50 text-slate-400 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs font-serif">{item.title}</span>
                  {isCompleted && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <div
                  className={`text-[10px] mt-0.5 font-mono ${
                    isActive ? "text-emerald-300" : isCompleted ? "text-emerald-700" : "text-slate-400"
                  }`}
                >
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Step 1: Period & Salary Structure ───────────────────────────────── */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-[#0F2F1E] font-serif">
              Step 1: Define Pay Period & Salary Structure
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify the monthly accounting period and the execution ruleset.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 md:col-span-2">
              <label className="font-semibold text-slate-700 block">
                Payrun Name / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={payrunName}
                onChange={(e) => setPayrunName(e.target.value)}
                placeholder="e.g. November 2026 Regular Payrun"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">
                Period Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">
                Period End Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-semibold text-slate-700 block">
                Applicable Salary Structure <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {structures.map((s) => {
                  const isSelected = s.id === selectedStructureId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedStructureId(s.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400 shadow-xs"
                          : "bg-slate-50/60 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 line-clamp-1">{s.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                        {s.code} ({s.rules?.length || 0} Rules)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#184a2f] transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Continue to Employee Inclusion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Employee Inclusion Checklist ────────────────────────────── */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-[#0F2F1E] font-serif">
                Step 2: Select Employees & Review Inputs
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify active contracts, overtime punch tallies, and approved unpaid leave days.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleToggleAllEmployees}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
              >
                {selectedEmployeeIds.length === filteredEmployees.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredEmployees.map((emp) => {
              const isSelected = selectedEmployeeIds.includes(emp.id);
              const activeContract = emp.contracts?.find((c) => c.status === "ACTIVE") || emp.contracts?.[0];
              const wage = activeContract ? activeContract.wage : 60000;
              const hasBank = Boolean(emp.bank_account_no);
              const hasTaxId = Boolean(emp.tax_id);

              return (
                <div
                  key={emp.id}
                  onClick={() => handleToggleEmployee(emp.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-400/40"
                      : "bg-slate-50/60 border-slate-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                        isSelected
                          ? "bg-[#0F2F1E] border-[#0F2F1E] text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>

                    <img
                      src={
                        emp.avatar_url ||
                        "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80"
                      }
                      alt={emp.first_name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />

                    <div>
                      <div className="font-semibold text-xs text-slate-900">
                        {emp.first_name} {emp.last_name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{emp.department}</span>
                        <span>&bull;</span>
                        <span className="font-mono">Wage: ₹{wage.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    {!hasBank && (
                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 text-[10px] font-semibold">
                        No Bank Acc
                      </span>
                    )}
                    {!hasTaxId && (
                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 text-[10px] font-semibold">
                        No Tax ID
                      </span>
                    )}
                    {hasBank && hasTaxId && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Ready
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={selectedEmployeeIds.length === 0}
              onClick={() => {
                setCurrentStep(3);
                handleRunCalculation();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#184a2f] transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <span>Calculate Preview & Preflight Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Calculate Preview Engine (Deterministic Preflight) ────── */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#0F2F1E] font-serif">
                  Step 3: Deterministic Preflight Audit & Preview
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                  {selectedEmployeeIds.length} Contracts Evaluated
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Review gross liabilities, statutory EPFO deductions, and preflight blocking validations before final commit.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRunCalculation}
              disabled={isCalculating}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200 transition flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isCalculating ? "Evaluating..." : "Recalculate All"}</span>
            </button>
          </div>

          {/* Aggregate Financial Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500">Gross Liability</span>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                ₹{previewCalculationResults.totalGross.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">All earning lines</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500">Statutory Deductions</span>
              <div className="text-xl font-bold font-mono text-rose-700 mt-1">
                -₹{previewCalculationResults.totalDeductions.toLocaleString()}
              </div>
              <span className="text-[10px] text-rose-600">EPFO & Unpaid leaves</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
              <span className="text-emerald-800 font-medium">Net Disbursable</span>
              <div className="text-xl font-bold font-mono text-emerald-900 mt-1">
                ₹{previewCalculationResults.totalNet.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-800 font-medium">Ready for Bank Export</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F2F1E] text-white border border-emerald-900 text-xs">
              <span className="text-emerald-300">Audit Status</span>
              <div className="text-base font-bold font-mono mt-1 flex items-center gap-1.5">
                {previewCalculationResults.blockingCount > 0 ? (
                  <span className="text-rose-300 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-rose-400" /> Blocked
                  </span>
                ) : (
                  <span className="text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Passed
                  </span>
                )}
              </div>
              <span className="text-[10px] text-emerald-400">
                {previewCalculationResults.warningCount} Notes &bull; {previewCalculationResults.blockingCount} Blockers
              </span>
            </div>
          </div>

          {/* Line-by-Line Calculation Breakdown Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-[11px] font-mono text-slate-500 font-semibold uppercase">
              Evaluated Payslips Breakdown ({previewCalculationResults.payslips.length})
            </div>
            <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
              {previewCalculationResults.payslips.map((p) => {
                const hasBlockers = (p.blocking_errors?.length || 0) > 0;
                const hasWarns = (p.warnings?.length || 0) > 0;

                return (
                  <div key={p.employee_id} className="p-3.5 hover:bg-slate-50/80 transition space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.employee_avatar}
                          alt={p.employee_name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-semibold text-slate-900">{p.employee_name}</span>
                          <span className="text-[10px] text-slate-400 ml-2 font-mono">
                            {p.employee_department}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right font-mono">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Gross</span>
                          <span className="font-semibold text-slate-800">
                            ₹{Math.round(p.gross_wage).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Deductions</span>
                          <span className="font-semibold text-rose-600">
                            -₹{Math.round(p.total_deductions).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-800 block">Net Disbursable</span>
                          <span className="font-bold text-emerald-700 text-sm">
                            ₹{Math.round(p.net_wage).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Preflight Errors/Warnings callouts */}
                    {(hasBlockers || hasWarns) && (
                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        {p.blocking_errors?.map((err, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 text-[10px] font-semibold flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3 text-red-600" /> {err}
                          </span>
                        ))}
                        {p.warnings?.map((warn, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] flex items-center gap-1"
                          >
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> {warn}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Selection</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleFinishPayrun("DRAFT")}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200 transition cursor-pointer"
              >
                Save as Draft Cycle
              </button>

              <button
                type="button"
                onClick={() => handleFinishPayrun("VALIDATED")}
                className="px-5 py-2.5 rounded-xl bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#184a2f] transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Confirm & Validate Payrun</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
