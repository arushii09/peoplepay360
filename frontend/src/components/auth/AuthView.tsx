"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export type UserRole =
  | "employee"
  | "hr_manager"
  | "hr_payroll_user"
  | "hr_payroll_manager"
  | "admin";

export interface UserSession {
  role: UserRole;
  name: string;
  email: string;
  employeeId?: number;
  initialNav: string;
}

interface AuthViewProps {
  initialMode?: "signin" | "signup";
  onBackToLanding: () => void;
  onAuthenticate: (session: UserSession) => void;
}

export const DEMO_PERSONAS: {
  role: UserRole;
  name: string;
  email: string;
  title: string;
  badge: string;
  employeeId?: number;
  initialNav: string;
  scope: string;
  avatarColor: string;
  avatarText: string;
}[] = [
  {
    role: "employee",
    name: "Aarav Mehta",
    email: "aarav.mehta@peoplepay.com",
    title: "Platform Engineer (EMP-101)",
    badge: "Employee",
    employeeId: 3,
    initialNav: "my-profile",
    scope: "Own details, punches & leave requests (No HR/payroll access)",
    avatarColor: "bg-amber-100 text-amber-800 border-amber-300",
    avatarText: "EM"
  },
  {
    role: "hr_manager",
    name: "Elena Rostova",
    email: "hr.manager@peoplepay.com",
    title: "HR Manager",
    badge: "HR Manager",
    initialNav: "dashboard",
    scope: "Full CRUD Employees, Attendance, Contracts, Schedules & Time Off (No payroll)",
    avatarColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    avatarText: "HR"
  },
  {
    role: "hr_payroll_user",
    name: "Maya Lin",
    email: "payroll.user@peoplepay.com",
    title: "HR Payroll Specialist",
    badge: "HR Payroll User",
    initialNav: "payroll",
    scope: "HR Manager permissions + Payruns/Payslips CRUD, Salary Rules (Read-Only)",
    avatarColor: "bg-cyan-100 text-cyan-800 border-cyan-300",
    avatarText: "PU"
  },
  {
    role: "hr_payroll_manager",
    name: "Marcus Vance",
    email: "payroll.manager@peoplepay.com",
    title: "HR & Payroll Director",
    badge: "HR Payroll Manager",
    initialNav: "payroll",
    scope: "Full control over HR & Payroll, Full CRUD on Payruns, Payslips & Salary Rules",
    avatarColor: "bg-teal-100 text-teal-800 border-teal-300",
    avatarText: "PM"
  },
  {
    role: "admin",
    name: "Sarah Jenkins",
    email: "admin@peoplepay.com",
    title: "Global System Administrator",
    badge: "Admin",
    initialNav: "dashboard",
    scope: "Full access across platform: User management, role assignment & system administration",
    avatarColor: "bg-purple-100 text-purple-900 border-purple-300",
    avatarText: "AD"
  }
];

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = "signin",
  onBackToLanding,
  onAuthenticate
}) => {
  const [authMode, setAuthMode] = useState<"signin" | "signup">(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>("hr_manager");
  const [email, setEmail] = useState("hr.manager@peoplepay.com");
  const [password, setPassword] = useState("••••••••••••");
  const [name, setName] = useState("Elena Rostova");
  const [validationError, setValidationError] = useState("");

  const handleSelectPersona = (persona: (typeof DEMO_PERSONAS)[0]) => {
    setSelectedRole(persona.role);
    setEmail(persona.email);
    setName(persona.name);
    setPassword("••••••••••••");
    setValidationError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setValidationError("Please provide both email and password.");
      return;
    }

    const matchedPersona = DEMO_PERSONAS.find((p) => p.role === selectedRole);
    if (matchedPersona) {
      onAuthenticate({
        role: matchedPersona.role,
        name: name || matchedPersona.name,
        email: email || matchedPersona.email,
        employeeId: matchedPersona.employeeId,
        initialNav: matchedPersona.initialNav
      });
    } else {
      onAuthenticate({
        role: "hr_manager",
        name: name || "HR Manager",
        email: email,
        initialNav: "dashboard"
      });
    }
  };

  const handleQuickLaunch = (persona: (typeof DEMO_PERSONAS)[0]) => {
    onAuthenticate({
      role: persona.role,
      name: persona.name,
      email: persona.email,
      employeeId: persona.employeeId,
      initialNav: persona.initialNav
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F7F2] text-[#1A1A1A] flex flex-col justify-between antialiased">
      {/* Top Navigation Bar */}
      <header className="h-16 px-6 md:px-12 border-b border-[#E8F3E6] bg-white/70 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
        <button
          type="button"
          suppressHydrationWarning
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-semibold text-[#0F2F1E] hover:text-[#1F4D32] transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Landing Page</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#0F2F1E] flex items-center justify-center text-[#9FD067] font-bold text-xs">
            ✦
          </div>
          <span className="font-display font-semibold text-[#0F2F1E] tracking-tight font-serif text-sm md:text-base">
            PeoplePay360
          </span>
        </div>

        <div className="text-[11px] font-mono text-[#5C645C] hidden sm:block">
          Enterprise Role Assignment Engine
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 5 User Roles Persona Switcher */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3E6] text-[#0F2F1E] text-xs font-semibold mb-3 border border-[#CBD2C4]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E6845]" />
                <span>Section 3: Defined User Roles</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#0F2F1E] font-serif tracking-tight">
                Select Your Role to Access Designated Dashboards
              </h1>
              <p className="mt-1.5 text-xs text-[#5C645C] leading-relaxed">
                Permissions and accessible views are enforced strictly based on the role specification. Click any role below for instant evaluation.
              </p>
            </div>

            {/* Persona Quick Select Cards */}
            <div className="space-y-2.5">
              {DEMO_PERSONAS.map((persona) => {
                const isSelected = selectedRole === persona.role;
                return (
                  <div
                    key={persona.role}
                    onClick={() => handleSelectPersona(persona)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white border-[#0F2F1E] shadow-sm ring-1 ring-[#0F2F1E]"
                        : "bg-white/60 border-[#E8F3E6] hover:bg-white hover:border-[#CBD2C4]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${persona.avatarColor}`}
                        >
                          {persona.avatarText}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs sm:text-sm text-[#0F2F1E]">{persona.name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E8F3E6] text-[#0F2F1E]">
                              {persona.badge}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#5C645C]">{persona.title}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickLaunch(persona);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#1F4D32] transition flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <span>Launch</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-[#5C645C] truncate max-w-[280px]">
                        {persona.scope}
                      </span>
                      <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                        Redirects: {persona.initialNav}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Credentials Form */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-7 border border-[#E8F3E6] shadow-xs">
              
              {/* Form Toggle: Sign In vs Get Started */}
              <div className="flex items-center justify-between pb-5 border-b border-[#E8F3E6] mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#0F2F1E] font-serif">
                    {authMode === "signin" ? "Sign In with Role Credentials" : "Register Organization Account"}
                  </h2>
                  <p className="text-xs text-[#5C645C] mt-0.5">
                    {authMode === "signin"
                      ? "Authenticate into designated role view"
                      : "Create a verified organizational account"}
                  </p>
                </div>

                <div className="p-1 rounded-xl bg-[#F6F7F2] border border-[#E8F3E6] flex items-center text-xs">
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setAuthMode("signin")}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                      authMode === "signin"
                        ? "bg-[#0F2F1E] text-white shadow-xs"
                        : "text-[#5C645C] hover:text-[#0F2F1E]"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setAuthMode("signup")}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                      authMode === "signup"
                        ? "bg-[#0F2F1E] text-white shadow-xs"
                        : "text-[#5C645C] hover:text-[#0F2F1E]"
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === "signup" && (
                  <div>
                    <label className="block text-xs font-semibold text-[#0F2F1E] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      suppressHydrationWarning
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2F1E] bg-[#F6F7F2]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#0F2F1E] mb-1">
                    Role Category
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => {
                      const newRole = e.target.value as UserRole;
                      setSelectedRole(newRole);
                      const matched = DEMO_PERSONAS.find((p) => p.role === newRole);
                      if (matched) {
                        setEmail(matched.email);
                        setName(matched.name);
                      }
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2F1E] bg-[#F6F7F2]"
                  >
                    <option value="employee">Employee (Self-Service)</option>
                    <option value="hr_manager">HR Manager (Full HR CRUD, No Payroll)</option>
                    <option value="hr_payroll_user">HR Payroll User (HR + Payruns CRUD, Rules Read-Only)</option>
                    <option value="hr_payroll_manager">HR Payroll Manager (Full HR & Payroll CRUD)</option>
                    <option value="admin">Admin (Full Access & User Management)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F2F1E] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      suppressHydrationWarning
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@peoplepay.com"
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2F1E] bg-[#F6F7F2]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#0F2F1E]">
                      Password
                    </label>
                    <span className="text-[11px] text-[#5C645C]">Enterprise credentials</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      suppressHydrationWarning
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2F1E] bg-[#F6F7F2]"
                      required
                    />
                  </div>
                </div>

                {/* Role Access Scope Badge */}
                <div className="p-3 rounded-xl bg-[#E8F3E6] border border-[#CBD2C4] flex items-center justify-between text-xs">
                  <span className="text-[#0F2F1E] font-medium">Designation Level:</span>
                  <span className="font-mono font-bold text-[#0F2F1E] uppercase text-[11px]">
                    {selectedRole.replace(/_/g, " ")}
                  </span>
                </div>

                {validationError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {validationError}
                  </div>
                )}

                <button
                  type="submit"
                  suppressHydrationWarning
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0F2F1E] text-white font-semibold text-xs sm:text-sm hover:bg-[#1F4D32] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Authenticate & Enter Designated Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#9FD067]" />
                </button>
              </form>

              {/* Compliance & Security Notice */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#5C645C]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Role-Based Access Enforced</span>
                </div>
                <span>SOC 2 Type II Compliant</span>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Bottom Minimal Footer */}
      <footer className="h-14 px-6 md:px-12 border-t border-[#E8F3E6] bg-white/50 flex items-center justify-between text-xs text-[#5C645C]">
        <span>© 2026 PeoplePay360 Inc. Strictly per Enterprise Payroll specifications.</span>
        <button
          type="button"
          suppressHydrationWarning
          onClick={onBackToLanding}
          className="hover:text-[#0F2F1E] underline cursor-pointer"
        >
          Return to Landing Page
        </button>
      </footer>
    </div>
  );
};
