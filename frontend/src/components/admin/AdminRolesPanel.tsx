"use client";

import React, { useState } from "react";
import { UserRole } from "@/components/auth/AuthView";
import {
  Shield,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Plus,
  RefreshCw,
  Search,
  Check
} from "lucide-react";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  lastActive: string;
  status: "ACTIVE" | "SUSPENDED";
}

const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 1,
    name: "Aarav Mehta",
    email: "aarav.mehta@peoplepay.com",
    role: "employee",
    department: "Platform Engineering",
    lastActive: "Just now",
    status: "ACTIVE"
  },
  {
    id: 2,
    name: "Elena Rostova",
    email: "hr.manager@peoplepay.com",
    role: "hr_manager",
    department: "People & Operations",
    lastActive: "10m ago",
    status: "ACTIVE"
  },
  {
    id: 3,
    name: "Maya Lin",
    email: "payroll.user@peoplepay.com",
    role: "hr_payroll_user",
    department: "Finance & Payroll",
    lastActive: "25m ago",
    status: "ACTIVE"
  },
  {
    id: 4,
    name: "Marcus Vance",
    email: "payroll.manager@peoplepay.com",
    role: "hr_payroll_manager",
    department: "HR & Compensation",
    lastActive: "1h ago",
    status: "ACTIVE"
  },
  {
    id: 5,
    name: "Sarah Jenkins",
    email: "admin@peoplepay.com",
    role: "admin",
    department: "IT & Infrastructure",
    lastActive: "Online",
    status: "ACTIVE"
  }
];

export const AdminRolesPanel: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleRoleChange = (userId: number, newRole: UserRole) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    const user = users.find((u) => u.id === userId);
    setFeedback(`Assigned ${newRole.replace(/_/g, " ").toUpperCase()} role to ${user?.name}.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-900 text-xs font-bold mb-2 border border-purple-200">
            <Shield className="w-3.5 h-3.5 text-purple-700" />
            <span>Administrator Security Console</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[#0F2F1E] font-serif">
            User Roles & Access Control Assignment
          </h1>
          <p className="text-xs text-[#5C645C] mt-1">
            Configure role boundaries, promote personnel, and audit security permissions across all 5 tiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => {
              setFeedback("All role permission tables synchronized across the cluster.");
              setTimeout(() => setFeedback(null), 3000);
            }}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#CBD2C4] text-xs font-semibold text-[#0F2F1E] hover:bg-[#F6F7F2] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Permissions</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Role Matrix Specification Table */}
      <div className="bg-white rounded-3xl border border-[#E8F3E6] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8F3E6] bg-[#F6F7F2] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 font-mono">
            Official Access Control Matrix (Section 3)
          </span>
          <span className="text-xs text-[#5C645C]">Strict RBAC enforcement</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[11px] bg-slate-50/50">
                <th className="py-3 px-4">Role Tier</th>
                <th className="py-3 px-4">Own Records & Punches</th>
                <th className="py-3 px-4">HR Modules (CRUD)</th>
                <th className="py-3 px-4">Time Off Approvals</th>
                <th className="py-3 px-4">Payruns & Payslips</th>
                <th className="py-3 px-4">Salary Rules & Structures</th>
                <th className="py-3 px-4">User & Role Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Employee */}
              <tr className="hover:bg-slate-50/70">
                <td className="py-3.5 px-4 font-bold text-slate-900">Employee</td>
                <td className="py-3.5 px-4 text-emerald-700 font-semibold">Full Access (Self)</td>
                <td className="py-3.5 px-4 text-slate-400">None</td>
                <td className="py-3.5 px-4 text-slate-400">Request Only</td>
                <td className="py-3.5 px-4 text-slate-400">View Own Payslip</td>
                <td className="py-3.5 px-4 text-slate-400">None</td>
                <td className="py-3.5 px-4 text-slate-400">None</td>
              </tr>
              {/* HR Manager */}
              <tr className="hover:bg-slate-50/70">
                <td className="py-3.5 px-4 font-bold text-slate-900">HR Manager</td>
                <td className="py-3.5 px-4 text-emerald-700 font-semibold">Yes</td>
                <td className="py-3.5 px-4 text-emerald-700 font-semibold">Full CRUD</td>
                <td className="py-3.5 px-4 text-emerald-700 font-semibold">Approve / Refuse</td>
                <td className="py-3.5 px-4 text-red-600 font-medium">No Access</td>
                <td className="py-3.5 px-4 text-red-600 font-medium">No Access</td>
                <td className="py-3.5 px-4 text-slate-400">None</td>
              </tr>
              {/* HR Payroll User */}
              <tr className="hover:bg-slate-50/70">
                <td className="py-3.5 px-4 font-bold text-slate-900">HR Payroll User</td>
                <td className="py-3.5 px-4 text-emerald-700 font-semibold">Yes</td>
                <td className="py-3.5 px-4 text-emerald-700 font-semibold">Full CRUD</td>
                <td className="py-3.5 px-4 text-emerald-700 font-semibold">Approve / Refuse</td>
                <td className="py-3.5 px-4 text-cyan-800 font-semibold">Create, Read, Update</td>
                <td className="py-3.5 px-4 text-amber-700 font-semibold">Read-Only</td>
                <td className="py-3.5 px-4 text-slate-400">None</td>
              </tr>
              {/* HR Payroll Manager */}
              <tr className="hover:bg-slate-50/70">
                <td className="py-3.5 px-4 font-bold text-slate-900">HR Payroll Manager</td>
                <td className="py-3.5 px-4 text-emerald-700 font-semibold">Yes</td>
                <td className="py-3.5 px-4 text-emerald-700 font-semibold">Full CRUD</td>
                <td className="py-3.5 px-4 text-emerald-700 font-semibold">Approve / Refuse</td>
                <td className="py-3.5 px-4 text-teal-800 font-semibold">Full CRUD</td>
                <td className="py-3.5 px-4 text-teal-800 font-semibold">Full CRUD (Rules)</td>
                <td className="py-3.5 px-4 text-slate-400">None</td>
              </tr>
              {/* Admin */}
              <tr className="bg-purple-50/40 hover:bg-purple-50/60 font-semibold">
                <td className="py-3.5 px-4 text-purple-900 font-bold">Admin</td>
                <td className="py-3.5 px-4 text-purple-900">Full Access</td>
                <td className="py-3.5 px-4 text-purple-900">Full CRUD</td>
                <td className="py-3.5 px-4 text-purple-900">Full CRUD</td>
                <td className="py-3.5 px-4 text-purple-900">Full CRUD</td>
                <td className="py-3.5 px-4 text-purple-900">Full CRUD</td>
                <td className="py-3.5 px-4 text-purple-900 font-bold">Full Control</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* User Directory & Role Assignment Table */}
      <div className="bg-white rounded-3xl border border-[#E8F3E6] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E8F3E6] bg-[#F6F7F2] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2F1E]"
            />
          </div>

          <span className="text-xs text-slate-500">
            Showing {filteredUsers.length} of {users.length} active enterprise members
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[11px] bg-slate-50/50">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Current Assigned Role</th>
              <th className="py-3 px-4">Role Reassignment Action</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900">{user.name}</div>
                  <div className="text-[11px] font-mono text-slate-400">{user.email}</div>
                </td>
                <td className="py-3.5 px-4 text-slate-600">{user.department}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-900 border border-purple-200"
                        : user.role === "hr_payroll_manager"
                        ? "bg-teal-100 text-teal-800 border border-teal-200"
                        : user.role === "hr_payroll_user"
                        ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                        : user.role === "hr_manager"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {user.role.replace(/_/g, " ").toUpperCase()}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    className="px-2.5 py-1 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F2F1E]"
                  >
                    <option value="employee">Employee</option>
                    <option value="hr_manager">HR Manager</option>
                    <option value="hr_payroll_user">HR Payroll User</option>
                    <option value="hr_payroll_manager">HR Payroll Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
