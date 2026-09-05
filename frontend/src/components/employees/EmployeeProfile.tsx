"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  User,
  FileText,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Plus,
  X,
  DollarSign,
  Briefcase
} from "lucide-react";
import { Employee, Contract, AttendanceRecord, TimeOffRequest } from "@/types/hr";

interface EmployeeProfileProps {
  employee: Employee;
  onBack: () => void;
  onUpdateEmployee: (updated: Employee) => void;
}

export const EmployeeProfile: React.FC<EmployeeProfileProps> = ({
  employee,
  onBack,
  onUpdateEmployee
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "contracts" | "attendance" | "time-off" | "payroll">("overview");
  
  const [isPunchModalOpen, setIsPunchModalOpen] = useState(false);
  const [punchDate, setPunchDate] = useState(new Date().toISOString().split("T")[0]);
  const [punchWorkedHours, setPunchWorkedHours] = useState("8.0");
  const [punchOvertimeHours, setPunchOvertimeHours] = useState("2.0");
  const [punchNotes, setPunchNotes] = useState("Sprint release deadline");

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<"VACATION" | "SICK" | "UNPAID">("VACATION");
  const [leaveStart, setLeaveStart] = useState("2026-09-01");
  const [leaveEnd, setLeaveEnd] = useState("2026-09-02");
  const [leaveDays, setLeaveDays] = useState("2.0");
  const [leaveReason, setLeaveReason] = useState("Family vacation");

  const activeContract = employee.contracts?.find(c => c.status === "ACTIVE");
  const isCompliant = Boolean(employee.bank_account_no && employee.tax_id);

  const totalOvertime = (employee.attendances || []).reduce((acc, curr) => acc + (curr.overtime_hours || 0), 0);
  const vacationAlloc = employee.leave_allocations?.find(a => a.time_off_code === "VACATION");
  const remainingVacation = vacationAlloc ? vacationAlloc.allocated_days - vacationAlloc.taken_days : 0;

  const handleAddPunch = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: AttendanceRecord = {
      id: Date.now(),
      employee_id: employee.id,
      date: punchDate,
      check_in: "09:00 AM",
      check_out: "07:00 PM",
      worked_hours: parseFloat(punchWorkedHours) || 8.0,
      overtime_hours: parseFloat(punchOvertimeHours) || 0.0,
      status: parseFloat(punchOvertimeHours) > 0 ? "OVERTIME" : "NORMAL",
      notes: punchNotes || null
    };

    onUpdateEmployee({
      ...employee,
      attendances: [newRecord, ...(employee.attendances || [])]
    });
    setIsPunchModalOpen(false);
  };

  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const typeNames: Record<string, string> = {
      VACATION: "Paid Annual Leave",
      SICK: "Sick Leave",
      UNPAID: "Unpaid Leave"
    };

    const newRequest: TimeOffRequest = {
      id: Date.now(),
      employee_id: employee.id,
      time_off_type_id: leaveType === "VACATION" ? 1 : leaveType === "SICK" ? 2 : 3,
      time_off_type_name: typeNames[leaveType] || "Leave",
      time_off_code: leaveType,
      start_date: leaveStart,
      end_date: leaveEnd,
      days: parseFloat(leaveDays) || 1.0,
      reason: leaveReason,
      status: "APPROVED"
    };

    onUpdateEmployee({
      ...employee,
      leave_requests: [newRequest, ...(employee.leave_requests || [])]
    });
    setIsLeaveModalOpen(false);
  };

  const handleToggleLeaveStatus = (reqId: number, status: "APPROVED" | "REFUSED") => {
    const updated = (employee.leave_requests || []).map(r => {
      if (r.id === reqId) return { ...r, status };
      return r;
    });
    onUpdateEmployee({
      ...employee,
      leave_requests: updated
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPunchModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Log Attendance</span>
          </button>
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#0F2F1E] text-white hover:bg-[#1F4D32] text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#9FD067]" />
            <span>Request Time Off</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={employee.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt={employee.first_name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-100 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight">
                  {employee.first_name} {employee.last_name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    employee.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {employee.status === "ACTIVE" ? "Active Full-Time" : "On Leave"}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-600 mt-1">
                {employee.job_position} • <span className="text-slate-400">{employee.department}</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
                <span>{employee.email}</span>
                {employee.phone && <span>• {employee.phone}</span>}
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between md:flex-col md:items-end gap-2 text-right">
            <div className="text-left md:text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                Payroll Compliance Status
              </span>
              {isCompliant ? (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Preflight Ready
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Action Required (Bank/Tax)
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Employee ID: #{employee.id}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-mono uppercase text-slate-400">Active Wage Base</span>
            <div className="text-lg font-bold font-mono text-[#0F2F1E] mt-0.5">
              {activeContract ? `$${activeContract.wage.toLocaleString()}/mo` : "None"}
            </div>
            <span className="text-[10px] text-slate-400">Period Contract</span>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-mono uppercase text-slate-400">Overtime Logged</span>
            <div className="text-lg font-bold font-mono text-emerald-800 mt-0.5">
              {totalOvertime.toFixed(1)} hrs
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">Payroll Rule Feed</span>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-mono uppercase text-slate-400">Paid Leave Balance</span>
            <div className="text-lg font-bold font-mono text-slate-800 mt-0.5">
              {remainingVacation.toFixed(0)} days left
            </div>
            <span className="text-[10px] text-slate-400">of {vacationAlloc?.allocated_days || 0} allocated</span>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-mono uppercase text-slate-400">Schedule</span>
            <div className="text-sm font-semibold text-slate-800 mt-0.5 truncate">
              {employee.schedule_name || "Standard 40h"}
            </div>
            <span className="text-[10px] text-slate-400">Full-time pattern</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-3 border-b-2 font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "overview"
              ? "border-[#0F2F1E] text-[#0F2F1E]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Overview & Bank Details</span>
        </button>

        <button
          onClick={() => setActiveTab("contracts")}
          className={`px-4 py-3 border-b-2 font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "contracts"
              ? "border-[#0F2F1E] text-[#0F2F1E]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Contracts ({employee.contracts?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-4 py-3 border-b-2 font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "attendance"
              ? "border-[#0F2F1E] text-[#0F2F1E]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Attendance & OT ({totalOvertime.toFixed(1)}h)</span>
        </button>

        <button
          onClick={() => setActiveTab("time-off")}
          className={`px-4 py-3 border-b-2 font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "time-off"
              ? "border-[#0F2F1E] text-[#0F2F1E]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Time Off & Approvals</span>
        </button>

        <button
          onClick={() => setActiveTab("payroll")}
          className={`px-4 py-3 border-b-2 font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "payroll"
              ? "border-[#0F2F1E] text-[#0F2F1E]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Payroll Links & Payslips</span>
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-display font-semibold text-base text-[#0F2F1E] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-700" />
              Job & Organization Details
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400 font-mono">Job Position</span>
                <span className="font-semibold text-slate-900">{employee.job_position}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400 font-mono">Department</span>
                <span className="font-semibold text-slate-900">{employee.department}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400 font-mono">Reports To</span>
                <span className="font-semibold text-slate-900">{employee.manager_name || "System Admin"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400 font-mono">Working Schedule</span>
                <span className="font-semibold text-slate-900">{employee.schedule_name}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400 font-mono">Date of Joining</span>
                <span className="font-semibold text-slate-900">{employee.joining_date || "2024-01-15"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-base text-[#0F2F1E] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                Bank & Tax Compliance
              </h3>
              {isCompliant ? (
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  VERIFIED
                </span>
              ) : (
                <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                  MISSING DETAILS
                </span>
              )}
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400 font-mono">Bank Name</span>
                <span className="font-semibold text-slate-900">{employee.bank_name || "—"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400 font-mono">Account Number</span>
                <span className="font-mono font-semibold text-slate-900">{employee.bank_account_no || "— (Required)"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400 font-mono">IFSC / Routing</span>
                <span className="font-mono font-semibold text-slate-900">{employee.ifsc_code || "—"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400 font-mono">Tax ID / PAN</span>
                <span className="font-mono font-semibold text-slate-900">{employee.tax_id || "— (Required)"}</span>
              </div>
            </div>

            {!isCompliant && (
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  <strong>Payroll Preflight Alert:</strong> Missing bank account number and tax ID will prevent payrun validation for this employee.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "contracts" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="font-display font-semibold text-base text-[#0F2F1E]">Period Contracts</h3>
            <p className="text-xs text-slate-500">
              Payroll calculation resolves the active contract applicable to the selected period.
            </p>
          </div>

          <div className="space-y-3">
            {(employee.contracts || []).map(contract => (
              <div
                key={contract.id}
                className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{contract.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {contract.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Structure: <span className="font-medium text-slate-800">{contract.salary_structure_name}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Valid from: {contract.start_date} {contract.end_date ? `to ${contract.end_date}` : "(Open-ended)"}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Monthly Wage</span>
                  <div className="text-xl font-bold font-mono text-[#0F2F1E]">
                    ${contract.wage.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-medium">Active for September Payrun</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "attendance" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-base text-[#0F2F1E]">
                Attendance & Overtime Log (Payroll Inputs)
              </h3>
              <p className="text-xs text-slate-500">
                Logged worked hours and overtime flow directly into payroll salary rules.
              </p>
            </div>
            <button
              onClick={() => setIsPunchModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#1F4D32] transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#9FD067]" />
              <span>Log Punch</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                OT
              </div>
              <div>
                <div className="font-semibold text-xs">Overtime Hours Available for Payroll</div>
                <div className="text-[11px] text-emerald-700">
                  Total of <strong>{totalOvertime.toFixed(1)} hours</strong> will multiply by hourly rate in payrun.
                </div>
              </div>
            </div>
            <span className="font-mono text-xs font-bold px-3 py-1 bg-white rounded-xl border border-emerald-200 text-emerald-800">
              +{totalOvertime.toFixed(1)} hrs OT
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-mono uppercase text-[11px]">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Check In</th>
                  <th className="py-3 px-3">Check Out</th>
                  <th className="py-3 px-3">Regular Hrs</th>
                  <th className="py-3 px-3">Overtime</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(employee.attendances || []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No attendance punches logged yet for this period.
                    </td>
                  </tr>
                ) : (
                  (employee.attendances || []).map(att => (
                    <tr key={att.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-semibold text-slate-900 font-mono">{att.date}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{att.check_in}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{att.check_out || "—"}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{att.worked_hours}h</td>
                      <td className="py-3 px-3">
                        {att.overtime_hours > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                            +{att.overtime_hours}h OT
                          </span>
                        ) : (
                          <span className="text-slate-400">0h</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {att.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{att.notes || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "time-off" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-base text-[#0F2F1E]">
                Time Off Requests & Leave Balances
              </h3>
              <p className="text-xs text-slate-500">
                Approved leave requests feed paid vs unpaid days into the payroll engine.
              </p>
            </div>
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#1F4D32] transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#9FD067]" />
              <span>New Leave Request</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(employee.leave_allocations || []).map(alloc => (
              <div key={alloc.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-900">{alloc.time_off_type_name}</span>
                  <span className="font-mono text-slate-500 text-[11px]">{alloc.year}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-display text-[#0F2F1E]">
                    {alloc.allocated_days - alloc.taken_days}
                  </span>
                  <span className="text-xs text-slate-400">/ {alloc.allocated_days} days left</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2E6845] h-full transition-all"
                    style={{
                      width: `${Math.min(100, ((alloc.allocated_days - alloc.taken_days) / (alloc.allocated_days || 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase font-mono tracking-wider">
              Submitted Requests
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-mono uppercase text-[11px]">
                    <th className="py-3 px-3">Leave Type</th>
                    <th className="py-3 px-3">Dates</th>
                    <th className="py-3 px-3">Days</th>
                    <th className="py-3 px-3">Reason</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(employee.leave_requests || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No time off requests filed.
                      </td>
                    </tr>
                  ) : (
                    (employee.leave_requests || []).map(req => (
                      <tr key={req.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-semibold text-slate-900">{req.time_off_type_name}</td>
                        <td className="py-3 px-3 font-mono text-slate-600">
                          {req.start_date} → {req.end_date}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-800">{req.days} days</td>
                        <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{req.reason || "—"}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              req.status === "APPROVED"
                                ? "bg-emerald-100 text-emerald-800"
                                : req.status === "REFUSED"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {req.status === "PENDING" ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleToggleLeaveStatus(req.id, "APPROVED")}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700 transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleToggleLeaveStatus(req.id, "REFUSED")}
                                className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-semibold text-[11px] hover:bg-red-200 transition"
                              >
                                Refuse
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">Decided</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "payroll" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="font-display font-semibold text-base text-[#0F2F1E]">
              Connected Payroll & Generated Payslips
            </h3>
            <p className="text-xs text-slate-500">
              Generated outputs driven by active contract, attendance overtime, and approved time off.
            </p>
          </div>

          <div className="space-y-4">
            {(employee.payslips || []).length === 0 ? (
              <div className="p-8 text-center text-slate-400 rounded-2xl border border-dashed border-slate-200">
                No payslips calculated yet for this employee. Generate a payrun in the Payroll Workspace.
              </div>
            ) : (
              (employee.payslips || []).map(payslip => (
                <div
                  key={payslip.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{payslip.payrun_name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {payslip.status}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      Period: {payslip.period_start} → {payslip.period_end}
                    </div>
                    {payslip.warnings && payslip.warnings.length > 0 && (
                      <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1 pt-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        {payslip.warnings.join(", ")}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400">Gross</span>
                      <div className="font-mono font-semibold text-slate-800 text-xs">
                        ${payslip.gross_wage.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400">Deductions</span>
                      <div className="font-mono font-semibold text-red-600 text-xs">
                        -${payslip.total_deductions.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400">Net Take-Home</span>
                      <div className="font-mono font-bold text-[#0F2F1E] text-base">
                        ${payslip.net_wage.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {isPunchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 text-sm">Log Attendance Punch</h3>
              <button onClick={() => setIsPunchModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddPunch} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={punchDate}
                  onChange={(e) => setPunchDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">Regular Worked Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={punchWorkedHours}
                    onChange={(e) => setPunchWorkedHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">Overtime Hours (OT)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={punchOvertimeHours}
                    onChange={(e) => setPunchOvertimeHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-semibold text-emerald-800"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Shift / Overtime Notes</label>
                <input
                  type="text"
                  value={punchNotes}
                  onChange={(e) => setPunchNotes(e.target.value)}
                  placeholder="Sprint release deadline"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPunchModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#0F2F1E] text-white font-semibold"
                >
                  Record Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 text-sm">Submit Time Off Request</h3>
              <button onClick={() => setIsLeaveModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddLeave} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                >
                  <option value="VACATION">Paid Annual Leave (Vacation)</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="UNPAID">Unpaid Leave (Triggers Payroll Deduction)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveStart}
                    onChange={(e) => setLeaveStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveEnd}
                    onChange={(e) => setLeaveEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Total Days</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={leaveDays}
                  onChange={(e) => setLeaveDays(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Reason</label>
                <input
                  type="text"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Annual summer holiday"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#0F2F1E] text-white font-semibold"
                >
                  Submit & Approve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
