"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EmployeeList } from "@/components/employees/EmployeeList";
import { EmployeeProfile } from "@/components/employees/EmployeeProfile";
import { SignIn2 } from "@/components/ui/clean-minimal-sign-in";
import { SignUp } from "@/components/ui/clean-minimal-sign-up";
import { initialEmployees, initialSchedules } from "@/lib/mock-data";
import { Employee } from "@/types/hr";
import {
  FileText,
  Clock,
  Calendar,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  UserCheck
} from "lucide-react";

export default function PeoplePay360App() {
  const [activeNav, setActiveNav] = useState("employees");
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId) || null;

  // Add Employee Handler
  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees([newEmp, ...employees]);
    setSelectedEmployeeId(newEmp.id);
  };

  // Update Employee Handler (e.g. attendance punches, leave requests)
  const handleUpdateEmployee = (updated: Employee) => {
    setEmployees(employees.map(e => (e.id === updated.id ? updated : e)));
  };

  // Breadcrumbs generator
  const getBreadcrumbs = () => {
    if (activeNav === "employees" && selectedEmployee) {
      return [
        { label: "Employees", onClick: () => setSelectedEmployeeId(null) },
        { label: `${selectedEmployee.first_name} ${selectedEmployee.last_name}` }
      ];
    }
    if (activeNav === "employees") return [{ label: "Employees" }];
    if (activeNav === "contracts") return [{ label: "Contracts" }];
    if (activeNav === "attendance") return [{ label: "Attendance" }];
    if (activeNav === "time-off") return [{ label: "Time Off" }];
    if (activeNav === "payroll") return [{ label: "Payroll Engine" }];
    if (activeNav === "auth") return [{ label: "Authentication" }];
    return [{ label: "HR Operations" }];
  };

  return (
    <AppShell
      activeNav={activeNav}
      onNavigate={(navId) => {
        setActiveNav(navId);
        if (navId === "employees") {
          // keep or clear
        } else {
          setSelectedEmployeeId(null);
        }
      }}
      title={
        selectedEmployee
          ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
          : activeNav === "employees"
          ? "Employee Directory"
          : activeNav
      }
      breadcrumbs={getBreadcrumbs()}
    >
      {/* 1. EMPLOYEES NAVIGATION ROUTE (Order 2 & Order 3) */}
      {activeNav === "employees" && (
        <>
          {selectedEmployee ? (
            <EmployeeProfile
              employee={selectedEmployee}
              onBack={() => setSelectedEmployeeId(null)}
              onUpdateEmployee={handleUpdateEmployee}
            />
          ) : (
            <EmployeeList
              employees={employees}
              schedules={initialSchedules}
              onSelectEmployee={(emp) => setSelectedEmployeeId(emp.id)}
              onAddEmployee={handleAddEmployee}
            />
          )}
        </>
      )}

      {/* 2. CONTRACTS HUB SHORTCUT */}
      {activeNav === "contracts" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-2xl text-[#0F2F1E]">All Period Contracts</h1>
              <p className="text-xs text-slate-500 mt-1">
                Active employment contracts determining period wage and salary structures.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Contract Name</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Structure</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">Wage / Mo</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.flatMap(emp =>
                  (emp.contracts || []).map(contract => (
                    <tr
                      key={contract.id}
                      onClick={() => {
                        setSelectedEmployeeId(emp.id);
                        setActiveNav("employees");
                      }}
                      className="hover:bg-slate-50/80 cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{contract.name}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {emp.first_name} {emp.last_name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{contract.salary_structure_name}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{contract.start_date}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                        ${contract.wage.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {contract.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ATTENDANCE AGGREGATE VIEW */}
      {activeNav === "attendance" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-2xl text-[#0F2F1E]">Attendance & Overtime Ledger</h1>
              <p className="text-xs text-slate-500 mt-1">
                Aggregated daily time punches feeding overtime calculations into the payroll run.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check In / Out</th>
                  <th className="py-3 px-4">Worked Hrs</th>
                  <th className="py-3 px-4">Overtime (OT)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.flatMap(emp =>
                  (emp.attendances || []).map(att => (
                    <tr
                      key={att.id}
                      onClick={() => {
                        setSelectedEmployeeId(emp.id);
                        setActiveNav("employees");
                      }}
                      className="hover:bg-slate-50/80 cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {emp.first_name} {emp.last_name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{att.date}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {att.check_in} — {att.check_out || "Active"}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{att.worked_hours}h</td>
                      <td className="py-3.5 px-4">
                        {att.overtime_hours > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                            +{att.overtime_hours}h OT
                          </span>
                        ) : (
                          <span className="text-slate-400">0h</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700">
                          {att.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{att.notes || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TIME OFF & APPROVALS WORKSPACE */}
      {activeNav === "time-off" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-2xl text-[#0F2F1E]">Time Off Requests & Leave Log</h1>
              <p className="text-xs text-slate-500 mt-1">
                Manage leave requests and reflect approved paid/unpaid days into payroll deductions.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Date Range</th>
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.flatMap(emp =>
                  (emp.leave_requests || []).map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/80">
                      <td
                        onClick={() => {
                          setSelectedEmployeeId(emp.id);
                          setActiveNav("employees");
                        }}
                        className="py-3.5 px-4 font-semibold text-slate-900 cursor-pointer"
                      >
                        {emp.first_name} {emp.last_name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{req.time_off_type_name}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {req.start_date} → {req.end_date}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{req.days} days</td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{req.reason || "—"}</td>
                      <td className="py-3.5 px-4">
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
                      <td className="py-3.5 px-4 text-right">
                        {req.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                const updated = (emp.leave_requests || []).map(r =>
                                  r.id === req.id ? { ...r, status: "APPROVED" as const } : r
                                );
                                handleUpdateEmployee({ ...emp, leave_requests: updated });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const updated = (emp.leave_requests || []).map(r =>
                                  r.id === req.id ? { ...r, status: "REFUSED" as const } : r
                                );
                                handleUpdateEmployee({ ...emp, leave_requests: updated });
                              }}
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
      )}

      {/* 5. PAYROLL ENGINE OVERVIEW */}
      {activeNav === "payroll" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-2xl text-[#0F2F1E]">Payroll Calculation Engine</h1>
              <p className="text-xs text-slate-500 mt-1">
                Deterministic calculation trace connecting Contracts, Attendance, and Time Off.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-display font-semibold text-base text-[#0F2F1E]">
              Salary Structure & Execution Sequence
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400">Seq 10 (Basic)</span>
                <div className="font-semibold text-slate-900 mt-1">BASIC</div>
                <div className="text-[10px] text-slate-500">contract.wage * 0.50</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400">Seq 20 (HRA)</span>
                <div className="font-semibold text-slate-900 mt-1">HRA</div>
                <div className="text-[10px] text-slate-500">contract.wage * 0.20</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400">Seq 30 (DA)</span>
                <div className="font-semibold text-slate-900 mt-1">DA</div>
                <div className="text-[10px] text-slate-500">contract.wage * 0.10</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400">Seq 40 (Gross)</span>
                <div className="font-semibold text-slate-900 mt-1">GROSS</div>
                <div className="text-[10px] text-slate-500">BASIC + HRA + DA</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400">Seq 50 (PF)</span>
                <div className="font-semibold text-red-700 mt-1">PF</div>
                <div className="text-[10px] text-slate-500">BASIC * 0.12</div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-mono text-emerald-700">Seq 100 (Net)</span>
                <div className="font-semibold text-emerald-900 mt-1">NET</div>
                <div className="text-[10px] text-emerald-700">GROSS - PF</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. AUTHENTICATION TAB */}
      {activeNav === "auth" && (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="mb-4 bg-white border border-slate-200 p-1 rounded-2xl flex items-center shadow-xs">
            <button
              onClick={() => setAuthMode("signin")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                authMode === "signin"
                  ? "bg-[#0F2F1E] text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In Form
            </button>
            <button
              onClick={() => setAuthMode("signup")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                authMode === "signup"
                  ? "bg-[#0F2F1E] text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign Up Form
            </button>
          </div>

          <div className="w-full flex justify-center">
            {authMode === "signin" ? (
              <SignIn2 onSwitchToSignUp={() => setAuthMode("signup")} />
            ) : (
              <SignUp onSwitchToSignIn={() => setAuthMode("signin")} />
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
