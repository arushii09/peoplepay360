"use client";

import React, { useState } from "react";
import { X, User, Building2, CreditCard, DollarSign } from "lucide-react";
import { Employee, WorkingSchedule } from "@/types/hr";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: Employee) => void;
  schedules: WorkingSchedule[];
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
  schedules
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [jobPosition, setJobPosition] = useState("");
  const [scheduleId, setScheduleId] = useState<number>(schedules[0]?.id || 1);
  const [bankName, setBankName] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [taxId, setTaxId] = useState("");
  const [initialWage, setInitialWage] = useState<string>("6000");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !jobPosition.trim()) {
      setError("Please fill in all required basic fields (Name, Email, Job Title).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }

    const selectedSchedule = schedules.find(s => s.id === scheduleId) || schedules[0];
    const newEmpId = Date.now();
    const wageNum = parseFloat(initialWage) || 5000;

    const newEmployee: Employee = {
      id: newEmpId,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || null,
      department,
      job_position: jobPosition.trim(),
      manager_id: null,
      manager_name: "System Admin",
      schedule_id: scheduleId,
      schedule_name: selectedSchedule?.name || "Standard 40h Schedule",
      status: "ACTIVE",
      bank_account_no: bankAccountNo.trim() || null,
      bank_name: bankName.trim() || null,
      ifsc_code: ifscCode.trim() || null,
      tax_id: taxId.trim() || null,
      joining_date: new Date().toISOString().split("T")[0],
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      contracts: [
        {
          id: newEmpId + 100,
          name: `${firstName} ${lastName} - Active Contract`,
          employee_id: newEmpId,
          start_date: new Date().toISOString().split("T")[0],
          end_date: null,
          wage: wageNum,
          salary_structure_id: 1,
          salary_structure_name: "Standard Corporate Executive 2026",
          status: "ACTIVE"
        }
      ],
      attendances: [],
      leave_allocations: [
        { id: newEmpId + 200, employee_id: newEmpId, time_off_type_id: 1, time_off_type_name: "Paid Annual Leave", time_off_code: "VACATION", allocated_days: 20.0, taken_days: 0.0, year: 2026 },
        { id: newEmpId + 201, employee_id: newEmpId, time_off_type_id: 2, time_off_type_name: "Sick Leave", time_off_code: "SICK", allocated_days: 10.0, taken_days: 0.0, year: 2026 }
      ],
      leave_requests: [],
      payslips: []
    };

    onAddEmployee(newEmployee);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <h3 className="font-display font-bold text-xl text-[#0F2F1E]">Add New Employee</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Create an employee profile, assign a working schedule, and generate an initial contract.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              Basic Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Aarav"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Mehta"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav.mehta@peoplepay.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              Job Position & Schedule
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                >
                  <option>Engineering</option>
                  <option>Sales</option>
                  <option>Human Resources</option>
                  <option>Finance</option>
                  <option>Operations</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Job Position *</label>
                <input
                  type="text"
                  required
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  placeholder="Lead Architect"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Working Schedule</label>
                <select
                  value={scheduleId}
                  onChange={(e) => setScheduleId(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                >
                  {schedules.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.weekly_hours}h/wk)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
              Initial Active Contract
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Monthly Wage *</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  required
                  value={initialWage}
                  onChange={(e) => setInitialWage(e.target.value)}
                  placeholder="6000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-xs font-semibold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Salary Structure</label>
                <input
                  type="text"
                  disabled
                  value="Standard Corporate Executive 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 text-xs cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                Bank & Statutory Tax Details
              </h4>
              <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Required for Payroll Validation
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Chase Bank"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Bank Account Number</label>
                <input
                  type="text"
                  value={bankAccountNo}
                  onChange={(e) => setBankAccountNo(e.target.value)}
                  placeholder="1234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">IFSC / Routing Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  placeholder="CHAS0001234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Tax ID / PAN / SSN</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="TX-AARAV-9921"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0F2F1E] text-white hover:bg-[#1F4D32] font-semibold transition shadow-sm"
            >
              Save Employee & Contract
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
