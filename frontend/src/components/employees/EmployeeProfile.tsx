"use client";

import React, { useState } from "react";
import { Employee } from "@/types/hr";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Clock,
  Edit2,
  Check,
  X
} from "lucide-react";

interface EmployeeProfileProps {
  employee: Employee;
  onBack: () => void;
  onUpdateEmployee: (updated: Employee) => void;
}

export const EmployeeProfile: React.FC<EmployeeProfileProps> = ({
  employee,
  onBack,
  onUpdateEmployee,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "contracts" | "attendance" | "leaves" | "payslips">("overview");
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankForm, setBankForm] = useState({
    bank_account_no: employee.bank_account_no || "",
    bank_name: employee.bank_name || "",
    ifsc_code: employee.ifsc_code || "",
    tax_id: employee.tax_id || "",
  });

  const activeContract = employee.contracts?.find((c) => c.status === "ACTIVE");
  const totalWorked = (employee.attendances || []).reduce((acc, curr) => acc + (curr.worked_hours || 0), 0);
  const totalOvertime = (employee.attendances || []).reduce((acc, curr) => acc + (curr.overtime_hours || 0), 0);

  const handleSaveBank = () => {
    onUpdateEmployee({
      ...employee,
      bank_account_no: bankForm.bank_account_no.trim() || null,
      bank_name: bankForm.bank_name.trim() || null,
      ifsc_code: bankForm.ifsc_code.trim() || null,
      tax_id: bankForm.tax_id.trim() || null,
    });
    setIsEditingBank(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Employee Directory
        </button>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${
            employee.status === "ACTIVE"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : employee.status === "ON_LEAVE"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-slate-100 text-slate-700 border-slate-200"
          }`}
        >
          {employee.status}
        </span>
      </div>

      {/* Hero Profile Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={employee.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"}
              alt={employee.first_name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-100 shadow-xs"
            />
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#0F2F1E]">
                {employee.first_name} {employee.last_name}
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-0.5">
                {employee.job_position} &bull; {employee.department}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {employee.email}
                </span>
                {employee.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {employee.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Joined {employee.joining_date}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <div className="bg-emerald-50/60 rounded-2xl p-3 border border-emerald-100/80 min-w-[120px]">
              <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Base Salary</p>
              <p className="text-lg font-bold text-[#0F2F1E] mt-0.5">
                {activeContract ? `₹${activeContract.wage.toLocaleString()}` : "Not Assigned"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60 min-w-[120px]">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Schedule</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">
                {employee.schedule_name || "Standard 40h"}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-8">
          {[
            { key: "overview", label: "Overview & Compliance" },
            { key: "contracts", label: `Contracts (${employee.contracts?.length || 0})` },
            { key: "attendance", label: `Attendance (${employee.attendances?.length || 0})` },
            { key: "leaves", label: `Leave Records (${employee.leave_allocations?.length || 0})` },
            { key: "payslips", label: `Payslips (${employee.payslips?.length || 0})` },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 px-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
                activeTab === tab.key
                  ? "border-[#0F2F1E] text-[#0F2F1E]"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Statutory & Banking Information */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-[#0F2F1E]">Bank & Tax Compliance</h2>
              </div>
              {!isEditingBank ? (
                <button
                  type="button"
                  onClick={() => setIsEditingBank(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Details
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveBank}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingBank(false)}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {isEditingBank ? (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankForm.bank_name}
                    onChange={(e) => setBankForm({ ...bankForm, bank_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    placeholder="e.g. HDFC Bank"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Account Number</label>
                  <input
                    type="text"
                    value={bankForm.bank_account_no}
                    onChange={(e) => setBankForm({ ...bankForm, bank_account_no: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    placeholder="e.g. 5010041234567"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={bankForm.ifsc_code}
                    onChange={(e) => setBankForm({ ...bankForm, ifsc_code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    placeholder="e.g. HDFC0001234"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Tax ID / PAN</label>
                  <input
                    type="text"
                    value={bankForm.tax_id}
                    onChange={(e) => setBankForm({ ...bankForm, tax_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    placeholder="e.g. ABCPS1234D"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-medium">Bank Name</p>
                  <p className="font-semibold text-slate-800 mt-1">{employee.bank_name || "— Not Set —"}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-medium">Account Number</p>
                  <p className="font-semibold text-slate-800 mt-1 font-mono">{employee.bank_account_no || "— Not Set —"}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-medium">IFSC Code</p>
                  <p className="font-semibold text-slate-800 mt-1 font-mono">{employee.ifsc_code || "— Not Set —"}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-medium">Tax Identifier (PAN)</p>
                  <p className="font-semibold text-slate-800 mt-1 font-mono">{employee.tax_id || "— Not Set —"}</p>
                </div>
              </div>
            )}
          </div>

          {/* Work Summary & Attendance Highlights */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-[#0F2F1E]">Attendance & Leave Summary</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <p className="text-emerald-800 font-medium">Total Worked Hours</p>
                <p className="text-2xl font-bold text-[#0F2F1E] mt-1">{totalWorked.toFixed(1)} hrs</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                <p className="text-amber-800 font-medium">Total Overtime</p>
                <p className="text-2xl font-bold text-amber-900 mt-1">{totalOvertime.toFixed(1)} hrs</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Leave Balance</h3>
              <div className="space-y-2">
                {(employee.leave_allocations || []).map((alloc) => (
                  <div key={alloc.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-medium text-slate-700">{alloc.time_off_type_name || "Annual"}</span>
                    <span className="font-bold text-emerald-700">
                      {alloc.allocated_days - alloc.taken_days} days left / {alloc.allocated_days} total
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contracts Tab */}
      {activeTab === "contracts" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F2F1E]">Employment Contracts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Contract Name</th>
                  <th className="py-3 px-4">Salary Structure</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">Wage</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(employee.contracts || []).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4">{c.salary_structure_name || "India Standard Payroll"}</td>
                    <td className="py-3 px-4">{c.start_date}</td>
                    <td className="py-3 px-4 font-bold text-[#0F2F1E]">₹{c.wage.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                        c.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === "attendance" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#0F2F1E]">Attendance Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check In</th>
                  <th className="py-3 px-4">Check Out</th>
                  <th className="py-3 px-4">Worked</th>
                  <th className="py-3 px-4">Overtime</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(employee.attendances || []).map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-medium">{att.date}</td>
                    <td className="py-3 px-4">{att.check_in}</td>
                    <td className="py-3 px-4">{att.check_out || "—"}</td>
                    <td className="py-3 px-4">{att.worked_hours} hrs</td>
                    <td className="py-3 px-4">{att.overtime_hours > 0 ? `+${att.overtime_hours} hrs` : "—"}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700">
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leaves Tab */}
      {activeTab === "leaves" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#0F2F1E]">Leave Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(employee.leave_requests || []).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold">{req.time_off_type_name}</td>
                    <td className="py-3 px-4">{req.start_date} to {req.end_date}</td>
                    <td className="py-3 px-4 font-bold">{req.days}</td>
                    <td className="py-3 px-4">{req.reason || "—"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                        req.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" :
                        req.status === "REFUSED" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payslips Tab */}
      {activeTab === "payslips" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#0F2F1E]">Payslips Ledger</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Payrun</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Gross Wage</th>
                  <th className="py-3 px-4">Deductions</th>
                  <th className="py-3 px-4">Net Wage</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(employee.payslips || []).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-900">{p.payrun_name}</td>
                    <td className="py-3 px-4">{p.period_start} to {p.period_end}</td>
                    <td className="py-3 px-4 font-semibold">₹{p.gross_wage.toLocaleString()}</td>
                    <td className="py-3 px-4 text-red-600 font-semibold">-₹{p.total_deductions.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">₹{p.net_wage.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;
