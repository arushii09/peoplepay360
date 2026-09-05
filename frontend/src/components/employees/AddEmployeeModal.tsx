"use client";

import React, { useState } from "react";
import { X, User, Mail, Phone, Building2, Briefcase, Calendar } from "lucide-react";
import { Employee, WorkingSchedule } from "@/types/hr";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (newEmployee: Employee) => void;
  schedules: WorkingSchedule[];
}

// Form field shape — separate from Employee so we can use string inputs
interface EmployeeFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  job_position: string;
  schedule_id: string;
  joining_date: string;
  wage: string;
}

const DEPARTMENTS = [
  "Engineering",
  "Platform Engineering",
  "Product Design",
  "HR Operations",
  "Infrastructure",
  "Finance",
  "Operations",
];

const INITIAL_FORM: EmployeeFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  department: "Engineering",
  job_position: "",
  schedule_id: "1",
  joining_date: new Date().toISOString().split("T")[0],
  wage: "",
};

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
  schedules,
}) => {
  const [form, setForm] = useState<EmployeeFormValues>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<EmployeeFormValues>>({});

  if (!isOpen) return null;

  // Update a single form field
  const set = (field: keyof EmployeeFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Client-side validation — only required fields
  const validate = (): boolean => {
    const newErrors: Partial<EmployeeFormValues> = {};
    if (!form.first_name.trim()) newErrors.first_name = "Required";
    if (!form.last_name.trim()) newErrors.last_name = "Required";
    if (!form.email.trim() || !form.email.includes("@")) newErrors.email = "Valid email required";
    if (!form.job_position.trim()) newErrors.job_position = "Required";
    if (!form.wage.trim() || isNaN(Number(form.wage))) newErrors.wage = "Valid number required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedSchedule = schedules.find((s) => s.id === Number(form.schedule_id));
    const wage = Number(form.wage);

    // Build new Employee object. IDs are temporary frontend-generated values.
    const newEmployee: Employee = {
      id: Date.now(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      department: form.department,
      job_position: form.job_position.trim(),
      schedule_id: Number(form.schedule_id),
      schedule_name: selectedSchedule?.name || "Standard 40h",
      status: "ACTIVE",
      joining_date: form.joining_date,
      bank_account_no: null,
      bank_name: null,
      ifsc_code: null,
      tax_id: null,
      contracts: [
        {
          id: Date.now() + 1,
          name: `${form.first_name.trim()} ${form.last_name.trim()} / ${form.department} ${new Date().getFullYear()}`,
          employee_id: Date.now(),
          start_date: form.joining_date,
          end_date: null,
          wage,
          salary_structure_id: 1,
          salary_structure_name: "India Standard Payroll",
          status: "ACTIVE",
        },
      ],
      attendances: [],
      leave_allocations: [
        {
          id: Date.now() + 2,
          employee_id: Date.now(),
          time_off_type_id: 1,
          time_off_type_name: "Annual Leave",
          time_off_code: "VACATION",
          allocated_days: 21,
          taken_days: 0,
          year: new Date().getFullYear(),
        },
      ],
      leave_requests: [],
      payslips: [],
    };

    onAddEmployee(newEmployee);
    setForm(INITIAL_FORM);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    onClose();
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h2 className="font-bold text-[#0F2F1E] text-base font-serif">New Employee</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add a new employee record. Bank and tax details can be filled later.
            </p>
          </div>
          <button
            type="button"
            suppressHydrationWarning
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="First Name"
                icon={<User className="w-3.5 h-3.5" />}
                error={errors.first_name}
              >
                <input
                  type="text"
                  suppressHydrationWarning
                  value={form.first_name}
                  onChange={(e) => set("first_name", e.target.value)}
                  placeholder="Priya"
                  className={inputClass(!!errors.first_name)}
                />
              </Field>
              <Field label="Last Name" error={errors.last_name}>
                <input
                  type="text"
                  suppressHydrationWarning
                  value={form.last_name}
                  onChange={(e) => set("last_name", e.target.value)}
                  placeholder="Sharma"
                  className={inputClass(!!errors.last_name)}
                />
              </Field>
            </div>

            {/* Email */}
            <Field label="Work Email" icon={<Mail className="w-3.5 h-3.5" />} error={errors.email}>
              <input
                type="email"
                suppressHydrationWarning
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="priya.sharma@company.com"
                className={inputClass(!!errors.email)}
              />
            </Field>

            {/* Phone */}
            <Field label="Phone (optional)" icon={<Phone className="w-3.5 h-3.5" />}>
              <input
                type="tel"
                suppressHydrationWarning
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className={inputClass(false)}
              />
            </Field>

            {/* Department & Position */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Department" icon={<Building2 className="w-3.5 h-3.5" />}>
                <select
                  suppressHydrationWarning
                  value={form.department}
                  onChange={(e) => set("department", e.target.value)}
                  className={inputClass(false)}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Job Position" icon={<Briefcase className="w-3.5 h-3.5" />} error={errors.job_position}>
                <input
                  type="text"
                  suppressHydrationWarning
                  value={form.job_position}
                  onChange={(e) => set("job_position", e.target.value)}
                  placeholder="Backend Engineer"
                  className={inputClass(!!errors.job_position)}
                />
              </Field>
            </div>

            {/* Joining Date & Schedule */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Joining Date" icon={<Calendar className="w-3.5 h-3.5" />}>
                <input
                  type="date"
                  suppressHydrationWarning
                  value={form.joining_date}
                  onChange={(e) => set("joining_date", e.target.value)}
                  className={inputClass(false)}
                />
              </Field>
              <Field label="Working Schedule">
                <select
                  suppressHydrationWarning
                  value={form.schedule_id}
                  onChange={(e) => set("schedule_id", e.target.value)}
                  className={inputClass(false)}
                >
                  {schedules.map((s) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Contract Wage */}
            <Field label="Contract Wage (monthly)" error={errors.wage}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">
                  ₹
                </span>
                <input
                  type="number"
                  suppressHydrationWarning
                  value={form.wage}
                  onChange={(e) => set("wage", e.target.value)}
                  placeholder="60000"
                  min={0}
                  className={`${inputClass(!!errors.wage)} pl-6`}
                />
              </div>
            </Field>

            {/* Info note about bank/tax */}
            <p className="text-[11px] text-slate-400 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
              Bank account and Tax ID can be added after the employee is created. Without them, the
              employee will be flagged as "Payroll Incomplete" in the preflight check.
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-3">
            <button
              type="button"
              suppressHydrationWarning
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              suppressHydrationWarning
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0F2F1E] hover:bg-[#1F4D32] transition"
            >
              Create Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Utility sub-components ───────────────────────────────────────────────────

function inputClass(hasError: boolean) {
  return [
    "w-full px-3 py-2 rounded-xl text-xs text-slate-800 border bg-white",
    "focus:outline-none focus:ring-2 focus:ring-emerald-600/25 transition",
    hasError ? "border-red-400 focus:ring-red-400/20" : "border-slate-200",
  ].join(" ");
}

interface FieldProps {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, icon, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
        {icon && <span className="text-slate-400">{icon}</span>}
        {label}
        {error && <span className="ml-auto text-red-500 font-normal normal-case tracking-normal">{error}</span>}
      </label>
      {children}
    </div>
  );
}

export default AddEmployeeModal;
