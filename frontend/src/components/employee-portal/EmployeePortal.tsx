"use client";

import React, { useState } from "react";
import { Employee, AttendanceRecord, TimeOffRequest } from "@/types/hr";
import {
  User,
  Clock,
  Calendar,
  Calculator,
  Building2,
  Mail,
  Phone,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Printer,
  TrendingUp,
  FileText
} from "lucide-react";

interface EmployeePortalProps {
  employee: Employee;
  activeNav: string;
  onUpdateEmployee: (updated: Employee) => void;
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({
  employee,
  activeNav,
  onUpdateEmployee
}) => {
  // Attendance clock state
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockSuccessMsg, setClockSuccessMsg] = useState("");

  // Leave request form state
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<"VACATION" | "SICK" | "UNPAID">("VACATION");
  const [leaveStart, setLeaveStart] = useState("2026-09-10");
  const [leaveEnd, setLeaveEnd] = useState("2026-09-12");
  const [leaveDays, setLeaveDays] = useState("3.0");
  const [leaveReason, setLeaveReason] = useState("Personal time off");

  const activeContract = employee.contracts?.find((c) => c.status === "ACTIVE");
  const totalWorked = (employee.attendances || []).reduce((acc, curr) => acc + (curr.worked_hours || 0), 0);
  const totalOT = (employee.attendances || []).reduce((acc, curr) => acc + (curr.overtime_hours || 0), 0);

  // Clock in/out handler
  const handleClockToggle = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const todayStr = now.toISOString().split("T")[0];

    if (!clockInTime) {
      setClockInTime(timeStr);
      setClockSuccessMsg(`Clocked in at ${timeStr} today (${todayStr})`);
      setTimeout(() => setClockSuccessMsg(""), 4000);
    } else {
      const newAttendance: AttendanceRecord = {
        id: Date.now(),
        employee_id: employee.id,
        date: todayStr,
        check_in: clockInTime,
        check_out: timeStr,
        worked_hours: 8.5,
        overtime_hours: 0.5,
        status: "OVERTIME",
        notes: "Self-service mobile punch"
      };

      onUpdateEmployee({
        ...employee,
        attendances: [newAttendance, ...(employee.attendances || [])]
      });

      setClockInTime(null);
      setClockSuccessMsg(`Clocked out at ${timeStr}. Punch logged to payroll.`);
      setTimeout(() => setClockSuccessMsg(""), 4000);
    }
  };

  // Leave submit handler
  const handleRequestLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const names: Record<string, string> = {
      VACATION: "Paid Annual Vacation",
      SICK: "Sick Leave",
      UNPAID: "Unpaid Leave"
    };

    const newReq: TimeOffRequest = {
      id: Date.now(),
      employee_id: employee.id,
      time_off_type_id: leaveType === "VACATION" ? 1 : leaveType === "SICK" ? 2 : 3,
      time_off_type_name: names[leaveType],
      time_off_code: leaveType,
      start_date: leaveStart,
      end_date: leaveEnd,
      days: parseFloat(leaveDays) || 1,
      reason: leaveReason,
      status: "PENDING"
    };

    onUpdateEmployee({
      ...employee,
      leave_requests: [newReq, ...(employee.leave_requests || [])]
    });

    setLeaveModalOpen(false);
  };

  // Salary calculations for payslip
  const wage = activeContract?.wage || 60000;
  const basic = wage * 0.5;
  const hra = wage * 0.2;
  const da = wage * 0.1;
  const gross = basic + hra + da;
  const pf = basic * 0.12;
  const net = gross - pf;

  return (
    <div className="space-y-6">
      {/* 1. MY PROFILE VIEW */}
      {activeNav === "my-profile" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8F3E6] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0F2F1E] text-[#9FD067] flex items-center justify-center font-bold text-2xl font-serif">
                {employee.first_name[0]}
                {employee.last_name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold text-[#0F2F1E] font-serif">
                    {employee.first_name} {employee.last_name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8F3E6] text-[#0F2F1E]">
                    {employee.status}
                  </span>
                </div>
                <div className="text-sm text-[#5C645C] mt-0.5 flex flex-wrap items-center gap-3">
                  <span>{employee.job_position}</span>
                  <span>•</span>
                  <span>{employee.department}</span>
                  <span>•</span>
                  <span className="font-mono">{employee.email}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F6F7F2] border border-[#E8F3E6] text-xs space-y-1">
              <div className="text-[#5C645C]">Active Contract Wage</div>
              <div className="font-mono text-xl font-bold text-[#0F2F1E]">
                ₹{wage.toLocaleString()}/mo
              </div>
              <div className="text-[10px] text-emerald-800 font-medium">
                {activeContract?.salary_structure_name || "Standard Executive Structure"}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Employment & Contract */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8F3E6] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Building2 className="w-4 h-4 text-[#2E6845]" />
                <span>Employment & Contract</span>
              </div>
              <div className="space-y-2 text-xs divide-y divide-slate-100 pt-1">
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5C645C]">Contract Name</span>
                  <span className="font-semibold text-slate-800">{activeContract?.name || "Executive Employment Agreement"}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5C645C]">Start Date</span>
                  <span className="font-mono text-slate-800">{activeContract?.start_date || "2026-01-01"}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5C645C]">Working Schedule</span>
                  <span className="text-slate-800 font-medium">Standard 40h / Week</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5C645C]">Contract Status</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {activeContract?.status || "ACTIVE"}
                  </span>
                </div>
              </div>
            </div>

            {/* Statutory & Compliance */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8F3E6] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <CreditCard className="w-4 h-4 text-[#2E6845]" />
                <span>Banking & Tax Details</span>
              </div>
              <div className="space-y-2 text-xs divide-y divide-slate-100 pt-1">
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5C645C]">Bank Account</span>
                  <span className="font-mono text-slate-800">{employee.bank_account_no || "HDFC-••••-8821"}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5C645C]">PAN / Tax ID</span>
                  <span className="font-mono text-slate-800">{employee.tax_id || "ABCDE1234F"}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5C645C]">PF Member ID</span>
                  <span className="font-mono text-slate-800">MH/BAN/1029384/01</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5C645C]">Preflight Verification</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Compliant (Verified)
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency & Personal */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8F3E6] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Phone className="w-4 h-4 text-[#2E6845]" />
                <span>Emergency Contact</span>
              </div>
              <div className="space-y-2 text-xs divide-y divide-slate-100 pt-1">
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5C645C]">Contact Person</span>
                  <span className="font-semibold text-slate-800">Kavita Mehta</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5C645C]">Emergency Phone</span>
                  <span className="font-mono text-slate-800">{employee.phone || "+91 98201 99342"}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5C645C]">Date of Joining</span>
                  <span className="font-mono text-slate-800">{employee.joining_date || "2024-01-15"}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5C645C]">Employee ID</span>
                  <span className="font-mono text-slate-800">EMP-{employee.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MY ATTENDANCE VIEW */}
      {activeNav === "my-attendance" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl text-[#0F2F1E] font-serif">
                My Attendance & Overtime Tracker
              </h1>
              <p className="text-xs text-[#5C645C] mt-1">
                Log daily punches and monitor worked hours feeding into your monthly pay calculation.
              </p>
            </div>

            {/* Interactive Clock In/Out Widget */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                suppressHydrationWarning
                onClick={handleClockToggle}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  clockInTime
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "bg-[#0F2F1E] text-white hover:bg-[#1F4D32]"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{clockInTime ? "Clock Out Now" : "Clock In Now"}</span>
              </button>
            </div>
          </div>

          {clockSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{clockSuccessMsg}</span>
            </div>
          )}

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#E8F3E6] shadow-xs">
              <span className="text-xs text-[#5C645C]">Current Period Hours</span>
              <div className="text-2xl font-bold font-mono text-[#0F2F1E] mt-1">{totalWorked}h</div>
              <span className="text-[10px] text-emerald-700">Scheduled: 160h</span>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-[#E8F3E6] shadow-xs">
              <span className="text-xs text-[#5C645C]">Logged Overtime (OT)</span>
              <div className="text-2xl font-bold font-mono text-[#2E6845] mt-1">+{totalOT}h</div>
              <span className="text-[10px] text-emerald-700">Payable at 1.5x hourly rate</span>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-[#E8F3E6] shadow-xs">
              <span className="text-xs text-[#5C645C]">Punch Compliance</span>
              <div className="text-2xl font-bold font-mono text-[#0F2F1E] mt-1">100%</div>
              <span className="text-[10px] text-emerald-700">Zero missing time records</span>
            </div>
          </div>

          {/* Attendance Log Table */}
          <div className="bg-white rounded-3xl border border-[#E8F3E6] shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8F3E6] bg-[#F6F7F2] text-[#5C645C] font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check In</th>
                  <th className="py-3 px-4">Check Out</th>
                  <th className="py-3 px-4">Worked Hrs</th>
                  <th className="py-3 px-4">Overtime (OT)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(employee.attendances || []).map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">{att.date}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{att.check_in}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{att.check_out || "Active"}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{att.worked_hours}h</td>
                    <td className="py-3.5 px-4">
                      {att.overtime_hours > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                          +{att.overtime_hours}h OT
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">0h</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {att.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{att.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MY LEAVES VIEW */}
      {activeNav === "my-leaves" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl text-[#0F2F1E] font-serif">
                My Leave Balances & Time-Off Requests
              </h1>
              <p className="text-xs text-[#5C645C] mt-1">
                View your allocated leave days and submit new requests for HR approval.
              </p>
            </div>

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setLeaveModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0F2F1E] text-white text-xs font-bold hover:bg-[#1F4D32] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Request Time Off</span>
            </button>
          </div>

          {/* Leave Balances Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(employee.leave_allocations || []).map((alloc) => {
              const remaining = alloc.allocated_days - alloc.taken_days;
              return (
                <div
                  key={alloc.id}
                  className="p-5 rounded-3xl bg-white border border-[#E8F3E6] shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-[#5C645C]">
                    <span className="font-semibold text-slate-800">{alloc.time_off_type_name}</span>
                    <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                      {alloc.year}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-[#0F2F1E]">{remaining}</span>
                    <span className="text-xs text-slate-400">/ {alloc.allocated_days} days left</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#2E6845] h-full rounded-full"
                      style={{ width: `${(alloc.taken_days / alloc.allocated_days) * 100}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>Taken: {alloc.taken_days}d</span>
                    <span>Remaining: {remaining}d</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Off Requests History */}
          <div className="bg-white rounded-3xl border border-[#E8F3E6] shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8F3E6] bg-[#F6F7F2] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                My Request History
              </span>
              <span className="text-xs text-slate-400">Directly syncs with HR approvals</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">End Date</th>
                  <th className="py-3 px-4">Total Days</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(employee.leave_requests || []).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{req.time_off_type_name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{req.start_date}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{req.end_date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{req.days} days</td>
                    <td className="py-3.5 px-4 text-slate-500">{req.reason || "—"}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Time Off Modal */}
          {leaveModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-semibold text-[#0F2F1E] font-serif text-lg">
                    New Leave Request
                  </h3>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setLeaveModalOpen(false)}
                    className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleRequestLeave} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Leave Category</label>
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-[#F6F7F2]"
                    >
                      <option value="VACATION">Paid Annual Vacation</option>
                      <option value="SICK">Sick Leave</option>
                      <option value="UNPAID">Unpaid Leave</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={leaveStart}
                        onChange={(e) => setLeaveStart(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-[#F6F7F2] font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={leaveEnd}
                        onChange={(e) => setLeaveEnd(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-[#F6F7F2] font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Days</label>
                    <input
                      type="number"
                      step="0.5"
                      value={leaveDays}
                      onChange={(e) => setLeaveDays(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-[#F6F7F2] font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Reason / Notes</label>
                    <textarea
                      rows={2}
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-[#F6F7F2]"
                      placeholder="Brief note for HR review"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => setLeaveModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      suppressHydrationWarning
                      className="px-4 py-2 rounded-xl bg-[#0F2F1E] text-white font-semibold hover:bg-[#1F4D32]"
                    >
                      Submit for Approval
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. MY PAYSLIP VIEW */}
      {activeNav === "my-payslip" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl text-[#0F2F1E] font-serif">
                My Official Payslip & Calculation Trace
              </h1>
              <p className="text-xs text-[#5C645C] mt-1">
                Deterministic calculation receipt generated from your active contract and verified punches.
              </p>
            </div>

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-white border border-[#CBD2C4] text-xs font-semibold text-[#0F2F1E] hover:bg-[#F6F7F2] transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Statement</span>
            </button>
          </div>

          {/* Payslip Document Card */}
          <div className="bg-white rounded-3xl p-8 border border-[#E8F3E6] shadow-xs max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start pb-6 border-b border-[#E8F3E6]">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0F2F1E] text-[#9FD067] flex items-center justify-center font-bold text-sm">
                    ✦
                  </div>
                  <span className="text-xl font-bold font-serif text-[#0F2F1E]">PeoplePay360</span>
                </div>
                <div className="text-xs text-[#5C645C] mt-1">Enterprise Salary Disbursement Advice</div>
              </div>

              <div className="text-right text-xs">
                <span className="font-bold text-[#0F2F1E]">Period: September 2026</span>
                <div className="font-mono text-slate-400 text-[10px]">PAYSLIP-2026-09-101</div>
                <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#E8F3E6] text-[#0F2F1E] px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3 text-[#2E6845]" />
                  <span>AUDIT TRACE PASSED</span>
                </div>
              </div>
            </div>

            {/* Employee Meta Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F6F7F2] text-xs">
              <div>
                <div className="text-[#5C645C] text-[10px] uppercase font-mono">Employee</div>
                <div className="font-semibold text-slate-900 mt-0.5">
                  {employee.first_name} {employee.last_name}
                </div>
              </div>
              <div>
                <div className="text-[#5C645C] text-[10px] uppercase font-mono">Department</div>
                <div className="font-semibold text-slate-900 mt-0.5">{employee.department}</div>
              </div>
              <div>
                <div className="text-[#5C645C] text-[10px] uppercase font-mono">Bank Account</div>
                <div className="font-mono text-slate-900 mt-0.5">{employee.bank_account_no || "HDFC-••••-8821"}</div>
              </div>
              <div>
                <div className="text-[#5C645C] text-[10px] uppercase font-mono">PAN / Tax ID</div>
                <div className="font-mono text-slate-900 mt-0.5">{employee.tax_id || "ABCDE1234F"}</div>
              </div>
            </div>

            {/* Salary Calculation Breakdown Table */}
            <div className="border border-[#E8F3E6] rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F6F7F2] text-[#5C645C] border-b border-[#E8F3E6] font-mono uppercase text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4">Rule Component</th>
                    <th className="py-2.5 px-4">Sequence & Mathematical Formula</th>
                    <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-800">BASIC Salary</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      Seq 10: 50% of Contract Wage (₹{wage.toLocaleString()})
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 text-right">
                      ₹{basic.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-800">House Rent Allowance (HRA)</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      Seq 20: 20% of Contract Wage
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 text-right">
                      ₹{hra.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-800">Dearness Allowance (DA)</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      Seq 30: 10% of Contract Wage
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 text-right">
                      ₹{da.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-semibold">
                    <td className="py-3 px-4 text-slate-900">Total Gross Earnings</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      Seq 40: BASIC + HRA + DA
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-right">
                      ₹{gross.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-red-700">Provident Fund (PF Deduction)</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      Seq 50: 12% of BASIC Salary
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-red-700 text-right">
                      -₹{pf.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-[#E8F3E6] border-t-2 border-[#0F2F1E]">
                    <td className="py-3.5 px-4 font-bold text-[#0F2F1E] text-sm">
                      Net Take-Home Payable
                    </td>
                    <td className="py-3.5 px-4 text-[#0F2F1E] font-mono text-xs">
                      Seq 100: GROSS - Deductions
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F2F1E] text-base text-right">
                      ₹{net.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Verification Sign-Off */}
            <div className="pt-4 border-t border-[#E8F3E6] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-[#5C645C] gap-2">
              <span>This computer generated payslip is mathematically audited and does not require a physical signature.</span>
              <span className="font-mono font-semibold text-emerald-800">Status: Disbursed via NEFT</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
