"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { PipelineFlow } from "@/components/landing/pipeline-flow";
import { HrOperations } from "@/components/landing/hr-operations";
import { ExplainablePayroll } from "@/components/landing/explainable-payroll";
import { WhatIfSimulator } from "@/components/landing/what-if-simulator";
import { DataArchitecture } from "@/components/landing/data-architecture";
import { SafetySection } from "@/components/landing/safety-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { LegalModal } from "@/components/landing/legal-modal";

import { AuthView, UserSession, UserRole } from "@/components/auth/AuthView";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { EmployeeList } from "@/components/employees/EmployeeList";
import { EmployeeProfile } from "@/components/employees/EmployeeProfile";
import { EmployeePortal } from "@/components/employee-portal/EmployeePortal";
import { AdminRolesPanel } from "@/components/admin/AdminRolesPanel";
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
  UserCheck,
  Building2,
  DollarSign,
  Lock,
  Plus
} from "lucide-react";

export default function PeoplePay360App() {
  // Top-level Application View Flow: Landing -> Auth -> App (Role-based)
  const [viewMode, setViewMode] = useState<"landing" | "auth" | "app">("landing");
  const [authMode, setAuthMode] = useState<"signin" | "signup">( "signin");

  // Authenticated User Session per Section 3 specifications
  const [session, setSession] = useState<UserSession>({
    role: "hr_manager",
    name: "Elena Rostova",
    email: "hr.manager@peoplepay.com",
    initialNav: "dashboard"
  });

  // Active App Navigation State
  const [activeNav, setActiveNav] = useState("dashboard");
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  // Legal Modal State (Landing Page)
  const [legalModalType, setLegalModalType] = useState<"terms" | "privacy" | null>(null);

  // Current selected employee (for HR drill-down)
  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId) || null;

  // Logged-in employee object (for Employee Portal self-service)
  const currentLoggedInEmployee =
    employees.find((e) => e.id === (session.employeeId || 3)) || employees[2] || employees[0];

  // Transition Handlers
  const handleGoToAuth = (mode: "signin" | "signup" = "signin") => {
    setAuthMode(mode);
    setViewMode("auth");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToLanding = () => {
    setViewMode("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuthenticate = (userSession: UserSession) => {
    setSession(userSession);
    setActiveNav(userSession.initialNav);
    setViewMode("app");

    if (userSession.role === "employee") {
      setSelectedEmployeeId(userSession.employeeId || 3);
    } else {
      setSelectedEmployeeId(null);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignOut = () => {
    setViewMode("landing");
    setSelectedEmployeeId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Data update handlers
  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees([newEmp, ...employees]);
    setSelectedEmployeeId(newEmp.id);
  };

  const handleUpdateEmployee = (updated: Employee) => {
    setEmployees(employees.map((e) => (e.id === updated.id ? updated : e)));
  };

  // Safe Navigation Handler enforcing Section 3 Permission Boundaries
  const handleNavigate = (navId: string) => {
    // Permission Guard: HR Manager has strictly NO access to payroll features
    if (session.role === "hr_manager" && navId === "payroll") {
      alert("Access Denied: HR Manager role has no access to payroll modules per security specification.");
      return;
    }

    // Permission Guard: Employee has strictly no access to administrative modules
    if (
      session.role === "employee" &&
      ["dashboard", "employees", "contracts", "attendance", "time-off", "payroll", "admin-roles"].includes(navId)
    ) {
      alert("Access Denied: Employee role has self-service permissions only.");
      return;
    }

    setActiveNav(navId);
    if (navId !== "employees") {
      setSelectedEmployeeId(null);
    }
  };

  // Dynamic Breadcrumb Generator
  const getBreadcrumbs = () => {
    if (session.role === "employee") {
      if (activeNav === "my-profile") return [{ label: "Self-Service" }, { label: "My Profile & Contract" }];
      if (activeNav === "my-attendance") return [{ label: "Self-Service" }, { label: "My Attendance Logs" }];
      if (activeNav === "my-leaves") return [{ label: "Self-Service" }, { label: "My Leave Balances" }];
      if (activeNav === "my-payslip") return [{ label: "Self-Service" }, { label: "My Payslip Statement" }];
      return [{ label: "Employee Portal" }];
    }

    if (activeNav === "dashboard") return [{ label: "Overview" }, { label: "Dashboard" }];
    if (activeNav === "employees" && selectedEmployee) {
      return [
        { label: "Employees", onClick: () => setSelectedEmployeeId(null) },
        { label: `${selectedEmployee.first_name} ${selectedEmployee.last_name}` }
      ];
    }
    if (activeNav === "employees") return [{ label: "HR Operations" }, { label: "Employee Directory" }];
    if (activeNav === "contracts") return [{ label: "HR Operations" }, { label: "Contracts Hub" }];
    if (activeNav === "attendance") return [{ label: "HR Operations" }, { label: "Attendance & OT" }];
    if (activeNav === "time-off") return [{ label: "HR Operations" }, { label: "Time Off Approvals" }];
    if (activeNav === "payroll") return [{ label: "Payroll Processing" }, { label: "Payruns & Calculation Trace" }];
    if (activeNav === "admin-roles") return [{ label: "Administration" }, { label: "User Roles & Permissions" }];
    return [{ label: "Operations Hub" }];
  };

  // Page Title Generator
  const getPageTitle = () => {
    if (session.role === "employee") {
      if (activeNav === "my-profile") return "My Profile & Contract";
      if (activeNav === "my-attendance") return "My Attendance Tracker";
      if (activeNav === "my-leaves") return "My Leave Requests";
      if (activeNav === "my-payslip") return "My Payslip Statement";
      return "Employee Self-Service";
    }

    if (selectedEmployee) {
      return `${selectedEmployee.first_name} ${selectedEmployee.last_name}`;
    }
    if (activeNav === "dashboard") return "Operations Dashboard";
    if (activeNav === "employees") return "Employee Directory";
    if (activeNav === "contracts") return "Contracts Hub";
    if (activeNav === "attendance") return "Attendance & Overtime";
    if (activeNav === "time-off") return "Time Off Approvals";
    if (activeNav === "payroll") return "Payroll Engine & Trace";
    if (activeNav === "admin-roles") return "User Roles & Permissions";
    return activeNav;
  };

  /* =========================================================================================
     VIEW 1: LANDING PAGE (First view of the website)
     ========================================================================================= */
  if (viewMode === "landing") {
    return (
      <div className="min-h-screen bg-[#F6F7F2] text-[#1A1A1A] font-sans antialiased selection:bg-[#E8F3E6] selection:text-[#0F2F1E]">
        {/* Navigation Bar with Login CTA */}
        <Navbar onOpenLogin={() => handleGoToAuth("signin")} />

        {/* Hero Section with Get Started CTA */}
        <Hero onOpenGetStarted={() => handleGoToAuth("signup")} />

        {/* 5-Stage Pipeline Flow */}
        <PipelineFlow />

        {/* Core HR Operations */}
        <HrOperations />

        {/* Explainable Calculation Trace Demo */}
        <ExplainablePayroll />

        {/* Interactive What-If Simulation Sandbox */}
        <WhatIfSimulator />

        {/* Data Architecture Schema */}
        <DataArchitecture />

        {/* Preflight Guardrails & Safety */}
        <SafetySection />

        {/* Frequently Asked Questions */}
        <FAQSection />

        {/* Bottom CTA Banner */}
        <FinalCta onOpenGetStarted={() => handleGoToAuth("signup")} />

        {/* Legal & Enterprise Footer */}
        <Footer onOpenLegal={(type) => setLegalModalType(type)} />

        {/* Terms of Service & Privacy Policy Modal */}
        <LegalModal
          isOpen={!!legalModalType}
          onClose={() => setLegalModalType(null)}
          type={legalModalType}
        />
      </div>
    );
  }

  /* =========================================================================================
     VIEW 2: AUTHENTICATION PAGE (Login & Get Started lead here)
     ========================================================================================= */
  if (viewMode === "auth") {
    return (
      <AuthView
        initialMode={authMode}
        onBackToLanding={handleBackToLanding}
        onAuthenticate={handleAuthenticate}
      />
    );
  }

  /* =========================================================================================
     VIEW 3: ROLE-BASED DESIGNATED PAGES (Authenticated App)
     ========================================================================================= */
  return (
    <AppShell
      activeNav={activeNav}
      onNavigate={handleNavigate}
      title={getPageTitle()}
      breadcrumbs={getBreadcrumbs()}
      currentUserRole={session.role}
      currentUserName={session.name}
      currentUserEmail={session.email}
      onSignOut={handleSignOut}
    >
      {/* -------------------------------------------------------------
          ROLE 1: EMPLOYEE (Self-Service Designated Pages)
          - View own employee details, attendance records, leave balances
          - Create attendance entries and Time Off Requests (No HR/payroll access)
          ------------------------------------------------------------- */}
      {session.role === "employee" && (
        <EmployeePortal
          employee={currentLoggedInEmployee}
          activeNav={activeNav}
          onUpdateEmployee={handleUpdateEmployee}
        />
      )}

      {/* -------------------------------------------------------------
          ROLES 2, 3, 4, 5: ADMINISTRATIVE & OPERATIONAL DASHBOARDS
          ------------------------------------------------------------- */}
      {session.role !== "employee" && (
        <>
          {/* DASHBOARD ROUTE */}
          {activeNav === "dashboard" && (
            <DashboardOverview
              onNavigate={handleNavigate}
              onSelectEmployee={(empId) => {
                setSelectedEmployeeId(empId);
                setActiveNav("employees");
              }}
            />
          )}

          {/* EMPLOYEES DIRECTORY ROUTE (Full CRUD for HR Manager, HR Payroll User/Manager, Admin) */}
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

          {/* CONTRACTS HUB (Full CRUD) */}
          {activeNav === "contracts" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display font-bold text-2xl text-[#0F2F1E] font-serif">
                    All Period Contracts
                  </h1>
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
                    {employees.flatMap((emp) =>
                      (emp.contracts || []).map((contract) => (
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

          {/* ATTENDANCE & OVERTIME LEDGER (Full CRUD) */}
          {activeNav === "attendance" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display font-bold text-2xl text-[#0F2F1E] font-serif">
                    Attendance & Overtime Ledger
                  </h1>
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
                    {employees.flatMap((emp) =>
                      (emp.attendances || []).map((att) => (
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

          {/* TIME OFF & APPROVALS WORKSPACE (Approve or Refuse Requests) */}
          {activeNav === "time-off" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display font-bold text-2xl text-[#0F2F1E] font-serif">
                    Time Off Requests & Leave Log
                  </h1>
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
                    {employees.flatMap((emp) =>
                      (emp.leave_requests || []).map((req) => (
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
                                  type="button"
                                  suppressHydrationWarning
                                  onClick={() => {
                                    const updated = (emp.leave_requests || []).map((r) =>
                                      r.id === req.id ? { ...r, status: "APPROVED" as const } : r
                                    );
                                    handleUpdateEmployee({ ...emp, leave_requests: updated });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700 transition cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  suppressHydrationWarning
                                  onClick={() => {
                                    const updated = (emp.leave_requests || []).map((r) =>
                                      r.id === req.id ? { ...r, status: "REFUSED" as const } : r
                                    );
                                    handleUpdateEmployee({ ...emp, leave_requests: updated });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-semibold text-[11px] hover:bg-red-200 transition cursor-pointer"
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

          {/* PAYROLL ENGINE ROUTE (HR Payroll User, HR Payroll Manager, Admin only) */}
          {activeNav === "payroll" && session.role !== "hr_manager" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display font-bold text-2xl text-[#0F2F1E] font-serif">
                    Payroll Calculation Engine
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Deterministic calculation trace connecting Contracts, Attendance, and Time Off into verified pay disbursements.
                  </p>
                </div>

                {/* Role Access Scope Badge */}
                <div className="flex items-center gap-2">
                  {session.role === "hr_payroll_user" ? (
                    <span className="px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Payruns: CRU | Rules: Read-Only</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Full CRUD Control (Payruns & Salary Rules)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Salary Structure & Sequence */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-base text-[#0F2F1E] font-serif">
                      Salary Structure: Standard Corporate Executive (Sequence Execution)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {session.role === "hr_payroll_user"
                        ? "Read-only access to rule formulas and sequences (HR Payroll Manager permission required to edit)."
                        : "Full configuration control: Edit rule formulas, alter execution sequences, and commit statutory parameters."}
                    </p>
                  </div>
                  {session.role !== "hr_payroll_user" && (
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => alert("New Salary Rule Modal (Full CRUD enabled for " + session.role.toUpperCase() + ")")}
                      className="px-3 py-1.5 rounded-xl bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#1F4D32] transition flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Rule</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400">Seq 10 (Basic)</span>
                    <div className="font-semibold text-slate-900 mt-1">BASIC</div>
                    <div className="text-[10px] text-slate-500 font-mono">contract.wage * 0.50</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400">Seq 20 (HRA)</span>
                    <div className="font-semibold text-slate-900 mt-1">HRA</div>
                    <div className="text-[10px] text-slate-500 font-mono">contract.wage * 0.20</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400">Seq 30 (DA)</span>
                    <div className="font-semibold text-slate-900 mt-1">DA</div>
                    <div className="text-[10px] text-slate-500 font-mono">contract.wage * 0.10</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400">Seq 40 (Gross)</span>
                    <div className="font-semibold text-slate-900 mt-1">GROSS</div>
                    <div className="text-[10px] text-slate-500 font-mono">BASIC + HRA + DA</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-red-50/60 border border-red-200">
                    <span className="text-[10px] font-mono text-red-600">Seq 50 (PF)</span>
                    <div className="font-semibold text-red-700 mt-1">PF</div>
                    <div className="text-[10px] text-red-600 font-mono">BASIC * 0.12</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-mono text-emerald-700">Seq 100 (Net)</span>
                    <div className="font-semibold text-emerald-900 mt-1">NET</div>
                    <div className="text-[10px] text-emerald-700 font-mono">GROSS - PF</div>
                  </div>
                </div>
              </div>

              {/* Payrun Cycle Execution Summary */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-base text-[#0F2F1E] font-serif">
                      Upcoming Cycle: October 2026 Regular Payrun
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Deterministic engine evaluating 84 active contracts and 1,340 attendance punches.
                    </p>
                  </div>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => alert("Deterministic payroll recalculation executed! 0 preflight warnings.")}
                    className="px-4 py-2 rounded-xl bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#1F4D32] transition shadow-xs cursor-pointer"
                  >
                    Run Preflight Audit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-slate-500">Gross Period Liability</span>
                    <div className="text-xl font-bold font-mono text-slate-900 mt-1">₹4,850,000</div>
                    <span className="text-[10px] text-emerald-700">84 Active Contracts</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-slate-500">Attendance Feeds</span>
                    <div className="text-xl font-bold font-mono text-slate-900 mt-1">99.2% Sync</div>
                    <span className="text-[10px] text-emerald-700">42 Overtime exceptions</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-slate-500">Statutory Deductions (PF)</span>
                    <div className="text-xl font-bold font-mono text-red-700 mt-1">₹291,000</div>
                    <span className="text-[10px] text-slate-500">Direct EPFO compliant</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                    <span className="text-emerald-800 font-medium">Net Disbursable</span>
                    <div className="text-xl font-bold font-mono text-emerald-900 mt-1">₹4,559,000</div>
                    <span className="text-[10px] text-emerald-800">Ready for Bank Export</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SYSTEM ADMINISTRATION ROUTE (Admin only) */}
          {activeNav === "admin-roles" && session.role === "admin" && (
            <AdminRolesPanel />
          )}
        </>
      )}
    </AppShell>
  );
}
