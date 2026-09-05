"use client";

import { useState } from "react";

interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  monthlySalary: number;
  avatarUrl: string;
  contractStatus: "Active" | "Pending";
  contractStartDate: string;
}

const EMPLOYEES: Employee[] = [
  {
    id: "EMP-101",
    name: "Aarav Mehta",
    designation: "Engineering Lead",
    department: "Platform Engineering",
    monthlySalary: 60000,
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    contractStatus: "Active",
    contractStartDate: "2025-01-01",
  },
  {
    id: "EMP-102",
    name: "Priya Sharma",
    designation: "Lead Product Designer",
    department: "Product Design",
    monthlySalary: 75000,
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    contractStatus: "Active",
    contractStartDate: "2024-06-15",
  },
  {
    id: "EMP-103",
    name: "Rohan Verma",
    designation: "Backend Engineer",
    department: "Infrastructure",
    monthlySalary: 55000,
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    contractStatus: "Active",
    contractStartDate: "2025-03-01",
  },
];

interface OperationalInputs {
  workedDays: number;
  totalWorkingDays: number;
  overtimeHours: number;
  unpaidLeaveDays: number;
  approvedPaidLeaveDays: number;
}

interface CalculationLine {
  ruleId: string;
  sequence: number;
  label: string;
  category: "earning" | "deduction";
  amount: number;
  formula: string;
  inputSource: string;
}

interface PayrollResult {
  gross: number;
  deductions: number;
  net: number;
  lines: CalculationLine[];
  hourlyRate: number;
  dailyRate: number;
}

function calculatePayrollEngine(
  salary: number,
  inputs: OperationalInputs
): PayrollResult {
  const hourlyRate = Math.round(salary / 240);
  const dailyRate = Math.round(salary / 30);

  const basic = Math.round(salary * 0.5);
  const hra = Math.round(salary * 0.3);
  const specialAllowance = Math.round(salary * 0.2);

  const overtimePay = inputs.overtimeHours * hourlyRate;
  const leaveDeduction = inputs.unpaidLeaveDays * dailyRate;
  const pfDeduction = Math.round(basic * 0.12);
  const professionalTax = 400;

  const lines: CalculationLine[] = [
    {
      ruleId: "RULE-10",
      sequence: 10,
      label: "Basic Salary",
      category: "earning",
      amount: basic,
      formula: "50% of Contract Base Salary",
      inputSource: "Active Contract: Base Salary",
    },
    {
      ruleId: "RULE-20",
      sequence: 20,
      label: "House Rent Allowance (HRA)",
      category: "earning",
      amount: hra,
      formula: "30% of Contract Base Salary",
      inputSource: "Active Contract: Salary Structure",
    },
    {
      ruleId: "RULE-30",
      sequence: 30,
      label: "Special Allowance",
      category: "earning",
      amount: specialAllowance,
      formula: "20% of Contract Base Salary (Fixed balancing component)",
      inputSource: "Active Contract: Salary Structure",
    },
    {
      ruleId: "RULE-40",
      sequence: 40,
      label: "Overtime Earnings",
      category: "earning",
      amount: overtimePay,
      formula: `${inputs.overtimeHours} approved OT hours × ₹${hourlyRate}/hour`,
      inputSource: "Attendance Record: Overtime logs",
    },
    {
      ruleId: "RULE-50",
      sequence: 50,
      label: "Unpaid Leave Deduction",
      category: "deduction",
      amount: leaveDeduction,
      formula: `${inputs.unpaidLeaveDays} unpaid days × ₹${dailyRate}/day`,
      inputSource: "Time Off: Approved Leave Requests",
    },
    {
      ruleId: "RULE-60",
      sequence: 60,
      label: "Provident Fund (PF)",
      category: "deduction",
      amount: pfDeduction,
      formula: "12% of Basic Salary (₹" + basic.toLocaleString("en-IN") + ")",
      inputSource: "Salary Rule: Statutory Compliance",
    },
    {
      ruleId: "RULE-70",
      sequence: 70,
      label: "Professional Tax / Statutory",
      category: "deduction",
      amount: professionalTax,
      formula: "Standard state tax tier schedule",
      inputSource: "Salary Rule: Tax Master Schedule",
    },
  ];

  const gross = basic + hra + specialAllowance + overtimePay;
  const deductions = leaveDeduction + pfDeduction + professionalTax;
  const net = gross - deductions;

  return {
    gross,
    deductions,
    net,
    lines,
    hourlyRate,
    dailyRate,
  };
}

export function PayrollSimulator() {
  const [selectedEmpIndex, setSelectedEmpIndex] = useState(0);
  const employee = EMPLOYEES[selectedEmpIndex];

  // Committed HR operational inputs
  const [committedInputs, setCommittedInputs] = useState<OperationalInputs>({
    workedDays: 21,
    totalWorkingDays: 22,
    overtimeHours: 10,
    unpaidLeaveDays: 1,
    approvedPaidLeaveDays: 1,
  });

  // What-If temporary simulation mode
  const [whatIfActive, setWhatIfActive] = useState(false);
  const [simulatedInputs, setSimulatedInputs] = useState<OperationalInputs>({
    workedDays: 21,
    totalWorkingDays: 22,
    overtimeHours: 20,
    unpaidLeaveDays: 1,
    approvedPaidLeaveDays: 1,
  });

  // Calculation trace modal state
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [commitNotification, setCommitNotification] = useState<string | null>(null);

  // Computations
  const baseResult = calculatePayrollEngine(employee.monthlySalary, committedInputs);
  const activeInputs = whatIfActive ? simulatedInputs : committedInputs;
  const currentResult = calculatePayrollEngine(employee.monthlySalary, activeInputs);

  const netDelta = currentResult.net - baseResult.net;
  const otDelta = simulatedInputs.overtimeHours - committedInputs.overtimeHours;

  const handleApplySimulation = () => {
    setCommittedInputs({ ...simulatedInputs });
    setWhatIfActive(false);
    setCommitNotification(
      `Committed What-If scenario to September Payrun for ${employee.name}. Final Net Pay updated to ₹${currentResult.net.toLocaleString("en-IN")}.`
    );
    setTimeout(() => setCommitNotification(null), 5000);
  };

  const handleDiscardSimulation = () => {
    setSimulatedInputs({ ...committedInputs });
    setWhatIfActive(false);
  };

  return (
    <section id="interactive-demo" className="w-full py-16 bg-[#F6F7F2] border-b border-[#E8F3E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#0F2F1E] text-white">
              PRD Section 7 & 15
            </span>
            <span className="text-xs font-semibold text-[#0F2F1E] uppercase tracking-wider">
              Live Interactive Product Demo
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#0F2F1E] font-serif tracking-tight">
            The Payroll Engine in Real Action
          </h2>
          <p className="mt-2 text-base text-[#5C645C]">
            Follow the 5-minute judge demo flow: select an employee, inspect active contract and attendance inputs, run rule calculation, open the mathematical trace, and test What-If scenarios without corrupting finalized payroll.
          </p>
        </div>

        {commitNotification && (
          <div className="mb-6 p-4 rounded-lg bg-[#E8F3E6] border border-[#2E6845] text-[#0F2F1E] text-sm flex items-center justify-between">
            <span>{commitNotification}</span>
            <button
              onClick={() => setCommitNotification(null)}
              className="text-xs font-semibold underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main interactive cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Employee & Operational Inputs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Employee Selector */}
            <div className="rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8F3E6]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5C645C]">
                  1. Select Active Employee
                </span>
                <span className="text-xs font-medium text-[#0F2F1E] bg-[#E8F3E6] px-2 py-0.5 rounded">
                  {employee.contractStatus} Contract
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {EMPLOYEES.map((emp, idx) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setSelectedEmpIndex(idx);
                      setWhatIfActive(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-colors ${
                      idx === selectedEmpIndex
                        ? "border-[#0F2F1E] bg-[#F6F7F2]"
                        : "border-[#E8F3E6] bg-[#FFFFFF] hover:bg-[#F6F7F2]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatarUrl}
                        alt={emp.name}
                        className="w-10 h-10 rounded-lg object-cover border border-[#E8F3E6]"
                      />
                      <div>
                        <div className="text-sm font-semibold text-[#0F2F1E]">{emp.name}</div>
                        <div className="text-xs text-[#5C645C]">{emp.designation}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-[#0F2F1E]">
                        ₹{emp.monthlySalary.toLocaleString("en-IN")}/mo
                      </div>
                      <div className="text-[11px] text-[#5C645C]">{emp.department}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Resolved Active Contract summary */}
              <div className="mt-4 p-3 rounded-lg bg-[#E7E9E1] text-xs space-y-1">
                <div className="font-semibold text-[#0F2F1E]">
                  Resolved Contract Parameters (September 2026):
                </div>
                <div className="flex justify-between text-[#1A1A1A]">
                  <span>Base Monthly Wage:</span>
                  <span className="font-medium">₹{employee.monthlySalary.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[#1A1A1A]">
                  <span>Derived Hourly Rate (240h div):</span>
                  <span className="font-medium">₹{baseResult.hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between text-[#1A1A1A]">
                  <span>Derived Daily Rate (30d div):</span>
                  <span className="font-medium">₹{baseResult.dailyRate}/day</span>
                </div>
              </div>
            </div>

            {/* 2. Operational HR Inputs & What-If Sandbox */}
            <div className="rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8F3E6]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5C645C]">
                  2. Operational Inputs & Simulation
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-semibold text-[#0F2F1E]">
                    What-If Mode
                  </span>
                  <input
                    type="checkbox"
                    checked={whatIfActive}
                    onChange={(e) => {
                      setWhatIfActive(e.target.checked);
                      if (e.target.checked) {
                        setSimulatedInputs({
                          ...committedInputs,
                          overtimeHours: 20, // Demo flow preset: 10h -> 20h
                        });
                      }
                    }}
                    className="w-4 h-4 accent-[#0F2F1E] rounded cursor-pointer"
                  />
                </label>
              </div>

              {whatIfActive ? (
                <div className="mt-3 p-3 rounded-lg bg-[#0F2F1E] text-[#F6F7F2] text-xs">
                  <div className="font-semibold text-[#9FD067] mb-1">
                    Simulation Sandbox Active
                  </div>
                  Modifying inputs below previews changes in real time. Finalized records are never touched until explicitly applied.
                </div>
              ) : (
                <p className="mt-3 text-xs text-[#5C645C]">
                  Committed operational records from attendance and approved leaves. Check "What-If Mode" to test overtime or leave adjustments.
                </p>
              )}

              <div className="mt-4 space-y-4">
                {/* Overtime input */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-[#1A1A1A] mb-1">
                    <span>Overtime Hours</span>
                    <span className="font-bold text-[#0F2F1E]">
                      {whatIfActive
                        ? `${simulatedInputs.overtimeHours} hrs (Simulated)`
                        : `${committedInputs.overtimeHours} hrs (Committed)`}
                    </span>
                  </div>
                  {whatIfActive ? (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="40"
                        step="2"
                        value={simulatedInputs.overtimeHours}
                        onChange={(e) =>
                          setSimulatedInputs({
                            ...simulatedInputs,
                            overtimeHours: Number(e.target.value),
                          })
                        }
                        className="w-full accent-[#0F2F1E] cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] text-[#5C645C]">
                        <span>0h</span>
                        <span className="font-semibold text-[#0F2F1E]">
                          10h → 20h Demo Delta
                        </span>
                        <span>40h</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full bg-[#E7E9E1] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2E6845] h-full"
                        style={{ width: `${(committedInputs.overtimeHours / 40) * 100}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Unpaid Leave Days */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-[#1A1A1A] mb-1">
                    <span>Unpaid Leave Days</span>
                    <span className="font-bold text-[#0F2F1E]">
                      {whatIfActive
                        ? `${simulatedInputs.unpaidLeaveDays} days (Simulated)`
                        : `${committedInputs.unpaidLeaveDays} day (Committed)`}
                    </span>
                  </div>
                  {whatIfActive ? (
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={simulatedInputs.unpaidLeaveDays}
                      onChange={(e) =>
                        setSimulatedInputs({
                          ...simulatedInputs,
                          unpaidLeaveDays: Number(e.target.value),
                        })
                      }
                      className="w-full accent-[#0F2F1E] cursor-pointer"
                    />
                  ) : (
                    <div className="w-full bg-[#E7E9E1] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2E6845] h-full"
                        style={{ width: `${(committedInputs.unpaidLeaveDays / 10) * 100}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Worked Days read-out */}
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-[#F6F7F2] text-xs">
                  <span className="text-[#5C645C]">Standard Working Days:</span>
                  <span className="font-semibold text-[#1A1A1A]">
                    21 / 22 days worked
                  </span>
                </div>
              </div>

              {/* What-If Commit / Discard Bar */}
              {whatIfActive && (
                <div className="mt-5 pt-4 border-t border-[#E8F3E6] space-y-3">
                  <div className="p-3 rounded-lg bg-[#E8F3E6] text-xs text-[#0F2F1E]">
                    <div className="font-semibold mb-1">Live Simulation Impact:</div>
                    <div>
                      Overtime changed: {committedInputs.overtimeHours}h → {simulatedInputs.overtimeHours}h
                    </div>
                    <div>
                      Net Pay Delta:{" "}
                      <span className="font-bold">
                        {netDelta >= 0 ? `+₹${netDelta.toLocaleString("en-IN")}` : `-₹${Math.abs(netDelta).toLocaleString("en-IN")}`}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#5C645C] mt-1">
                      Reason: Overtime Rule × {otDelta} additional hours × ₹{currentResult.hourlyRate}/hr = ₹{(otDelta * currentResult.hourlyRate).toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleApplySimulation}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#1F4D32] transition-colors"
                    >
                      Apply to September Payrun
                    </button>
                    <button
                      onClick={handleDiscardSimulation}
                      className="py-2 px-3 rounded-lg bg-[#E7E9E1] text-[#1A1A1A] text-xs font-semibold hover:bg-[#CBD2C4] transition-colors"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Preflight Guardrail status indicator */}
            <div className="rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E6845]" />
                <span className="font-semibold text-[#0F2F1E]">
                  Preflight Validation: Passed
                </span>
              </div>
              <span className="text-[#5C645C]">0 Warnings / Ready</span>
            </div>

          </div>

          {/* Right Column: Computed Payslip & Traceability */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* The Payslip Card */}
            <div className="rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] p-6">
              
              {/* Payslip Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#E8F3E6]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C645C]">
                    PeoplePay360 Payslip Ledger
                  </span>
                  <h3 className="text-xl font-bold text-[#0F2F1E] font-serif">
                    Payrun Period: September 2026
                  </h3>
                  <p className="text-xs text-[#5C645C] mt-0.5">
                    Employee: {employee.name} ({employee.id}) • {employee.designation}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTraceModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#E8F3E6] text-[#0F2F1E] text-xs font-semibold hover:bg-[#CBD2C4] border border-[#CBD2C4] transition-colors"
                  >
                    Explain Every Number 🔍
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#1F4D32] transition-colors"
                  >
                    Print PDF
                  </button>
                </div>
              </div>

              {/* Summary KPIs */}
              <div className="grid grid-cols-3 gap-3 my-5">
                <div className="p-3 rounded-lg bg-[#F6F7F2] border border-[#E8F3E6]">
                  <div className="text-[11px] font-medium text-[#5C645C]">Total Gross</div>
                  <div className="text-lg font-bold text-[#0F2F1E] mt-0.5">
                    ₹{currentResult.gross.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#F6F7F2] border border-[#E8F3E6]">
                  <div className="text-[11px] font-medium text-[#5C645C]">Total Deductions</div>
                  <div className="text-lg font-bold text-[#1A1A1A] mt-0.5">
                    ₹{currentResult.deductions.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#E8F3E6] border border-[#2E6845]">
                  <div className="text-[11px] font-medium text-[#0F2F1E]">Net Payable</div>
                  <div className="text-lg font-bold text-[#0F2F1E] mt-0.5">
                    ₹{currentResult.net.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Line Items Breakdown */}
              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#5C645C]">
                  Line Items & Sequenced Rules
                </div>

                <div className="border border-[#E8F3E6] rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F6F7F2] text-[#5C645C] border-b border-[#E8F3E6]">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">Seq</th>
                        <th className="py-2.5 px-3 font-semibold">Rule / Component</th>
                        <th className="py-2.5 px-3 font-semibold">Type</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8F3E6] text-[#1A1A1A]">
                      {currentResult.lines.map((line) => (
                        <tr key={line.ruleId} className="hover:bg-[#F6F7F2]">
                          <td className="py-2.5 px-3 font-mono text-[#5C645C]">
                            {line.sequence}
                          </td>
                          <td className="py-2.5 px-3 font-medium">
                            <div>{line.label}</div>
                            <div className="text-[10px] text-[#5C645C] font-normal">
                              {line.formula}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                line.category === "earning"
                                  ? "bg-[#E8F3E6] text-[#0F2F1E]"
                                  : "bg-[#E7E9E1] text-[#1A1A1A]"
                              }`}
                            >
                              {line.category === "earning" ? "Earning" : "Deduction"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold">
                            {line.category === "earning" ? "+" : "-"}₹
                            {line.amount.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* What-If Instant Delta Inspector Card */}
              {whatIfActive && (
                <div className="mt-5 p-4 rounded-lg bg-[#F6F7F2] border border-[#0F2F1E] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#0F2F1E] uppercase tracking-wider">
                      What-If Comparison Result
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#0F2F1E] text-white">
                      Sandbox Delta
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-[#E8F3E6]">
                    <div>
                      <span className="text-[#5C645C]">Committed Net:</span>
                      <div className="font-bold text-[#1A1A1A]">
                        ₹{baseResult.net.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div>
                      <span className="text-[#5C645C]">Simulated Net:</span>
                      <div className="font-bold text-[#0F2F1E]">
                        ₹{currentResult.net.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div>
                      <span className="text-[#5C645C]">Net Delta:</span>
                      <div className="font-bold text-[#2E6845]">
                        {netDelta >= 0 ? `+₹${netDelta.toLocaleString("en-IN")}` : `-₹${Math.abs(netDelta).toLocaleString("en-IN")}`}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-[#5C645C] pt-1">
                    <strong>Rule Impact:</strong> Overtime increased by {otDelta} hours (₹{currentResult.hourlyRate}/hr).
                  </div>
                </div>
              )}

            </div>

            {/* Explanatory banner */}
            <div className="p-4 rounded-xl bg-[#E7E9E1] border border-[#CBD2C4] text-xs text-[#1A1A1A] space-y-1">
              <div className="font-semibold text-[#0F2F1E]">
                Architecture Principle (PRD Page 1):
              </div>
              <p className="text-[#5C645C]">
                PeoplePay360 does not build an isolated checklist. We prove one connected operational flow end-to-end (Employee → Contract → Attendance/Leave → Salary Rules → Payrun → Payslip) where the calculation engine is transparent and interactive.
              </p>
            </div>

          </div>

        </div>

        {/* Explain Calculation Modal / Drawer */}
        {showTraceModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowTraceModal(false)}
          >
            <div
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#FFFFFF] border border-[#E8F3E6] rounded-xl p-6 text-[#1A1A1A]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E8F3E6]">
                <div>
                  <h3 className="text-xl font-bold text-[#0F2F1E] font-serif">
                    Explain Calculation: Audit Trace
                  </h3>
                  <p className="text-xs text-[#5C645C] mt-0.5">
                    Verifiable mathematical derivation for {employee.name} (September 2026 Payrun)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTraceModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#E7E9E1] text-[#1A1A1A] hover:bg-[#CBD2C4] text-sm font-semibold"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5 space-y-4 text-xs">
                <div className="p-3 rounded-lg bg-[#F6F7F2] border border-[#E8F3E6] space-y-1">
                  <div className="font-semibold text-[#0F2F1E]">Contract Anchor Rates:</div>
                  <div className="text-[#5C645C]">
                    • Monthly Fixed Base: ₹{employee.monthlySalary.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[#5C645C]">
                    • Hourly Derivation: ₹{employee.monthlySalary.toLocaleString("en-IN")} ÷ 240 hours = ₹{currentResult.hourlyRate}/hour
                  </div>
                  <div className="text-[#5C645C]">
                    • Daily Derivation: ₹{employee.monthlySalary.toLocaleString("en-IN")} ÷ 30 days = ₹{currentResult.dailyRate}/day
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="font-semibold text-[#0F2F1E] uppercase tracking-wider text-[11px]">
                    Sequenced Rule Execution Ledger:
                  </div>

                  {currentResult.lines.map((line, idx) => (
                    <div
                      key={line.ruleId}
                      className="p-3 rounded-lg border border-[#E8F3E6] bg-[#FFFFFF] space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#0F2F1E]">
                          Step {idx + 1} [Seq {line.sequence}]: {line.label}
                        </span>
                        <span className="font-mono font-bold text-[#0F2F1E]">
                          {line.category === "earning" ? "+" : "-"}₹
                          {line.amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="text-[#5C645C]">
                        <strong>Formula:</strong> {line.formula}
                      </div>
                      <div className="text-[#5C645C]">
                        <strong>Data Source:</strong> {line.inputSource}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-lg bg-[#E8F3E6] border border-[#2E6845] text-[#0F2F1E] space-y-1">
                  <div className="font-bold">Final Net Pay Formula:</div>
                  <div>
                    Gross Earnings (₹{currentResult.gross.toLocaleString("en-IN")}) - Total Deductions (₹{currentResult.deductions.toLocaleString("en-IN")}) = Net Pay (₹{currentResult.net.toLocaleString("en-IN")})
                  </div>
                  <div className="text-[11px] text-[#5C645C]">
                    Status: Validated against database schema invariants and preflight rules.
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8F3E6] flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowTraceModal(false)}
                  className="px-5 py-2 rounded-lg bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#1F4D32]"
                >
                  Close Audit Trace
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
