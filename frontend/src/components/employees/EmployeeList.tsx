"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  UserCheck,
  Building2,
  FileText,
  Clock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  LayoutGrid,
  List as ListIcon,
  XCircle,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { Employee, WorkingSchedule } from "@/types/hr";
import { AddEmployeeModal } from "./AddEmployeeModal";

interface EmployeeListProps {
  employees: Employee[];
  schedules: WorkingSchedule[];
  onSelectEmployee: (employee: Employee) => void;
  onAddEmployee: (newEmployee: Employee) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  schedules,
  onSelectEmployee,
  onAddEmployee
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Departments list for filter
  const departments = useMemo(() => {
    const set = new Set(employees.map(e => e.department));
    return ["ALL", ...Array.from(set)];
  }, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        emp.first_name.toLowerCase().includes(q) ||
        emp.last_name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.job_position.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q);

      const matchesDept = selectedDept === "ALL" || emp.department === selectedDept;
      const matchesStatus = selectedStatus === "ALL" || emp.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchQuery, selectedDept, selectedStatus]);

  // Key stats
  const totalCount = employees.length;
  const activeContractsCount = employees.filter(e => e.contracts && e.contracts.some(c => c.status === "ACTIVE")).length;
  const onLeaveCount = employees.filter(e => e.status === "ON_LEAVE").length;
  const compliantCount = employees.filter(e => e.bank_account_no && e.tax_id).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-[#0F2F1E] tracking-tight">
            Employee Directory & Contracts
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Maintain employee master data, active period contracts, and payroll prerequisites.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F2F1E] text-white text-xs font-semibold hover:bg-[#1F4D32] transition shadow-sm self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#9FD067]" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-medium">Total Staff</div>
          <div className="text-2xl font-bold font-display text-[#0F2F1E] mt-1">{totalCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <UserCheck className="w-3 h-3" />
            Active headcount
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-medium">Active Contracts</div>
          <div className="text-2xl font-bold font-display text-[#0F2F1E] mt-1">{activeContractsCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Period applicable
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-medium">On Leave</div>
          <div className="text-2xl font-bold font-display text-amber-900 mt-1">{onLeaveCount}</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Approved time off
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-medium">Payroll Compliant</div>
          <div className="text-2xl font-bold font-display text-[#0F2F1E] mt-1">
            {compliantCount}/{totalCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Bank & Tax IDs verified
          </div>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "table" ? "bg-white shadow-xs text-[#0F2F1E] font-semibold" : "text-slate-500 hover:text-slate-800"
                }`}
                title="Table View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid" ? "bg-white shadow-xs text-[#0F2F1E] font-semibold" : "text-slate-500 hover:text-slate-800"
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Department & Status Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 text-xs">
          <span className="text-slate-400 text-[11px] font-mono uppercase flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" /> Dept:
          </span>
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1 rounded-full text-xs transition cursor-pointer shrink-0 ${
                selectedDept === dept
                  ? "bg-[#0F2F1E] text-white font-semibold shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {dept}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />

          <span className="text-slate-400 text-[11px] font-mono uppercase shrink-0">Status:</span>
          {["ALL", "ACTIVE", "ON_LEAVE"].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-full text-xs transition cursor-pointer shrink-0 ${
                selectedStatus === st
                  ? "bg-[#0F2F1E] text-white font-semibold shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "ALL" ? "All Status" : st === "ACTIVE" ? "Active" : "On Leave"}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-mono uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Employee</th>
                  <th className="py-3.5 px-4 font-semibold">Department & Role</th>
                  <th className="py-3.5 px-4 font-semibold">Active Contract</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Payroll Preflight</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="max-w-xs mx-auto space-y-2">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                          <XCircle className="w-5 h-5" />
                        </div>
                        <div className="font-semibold text-slate-700">No employees match your search</div>
                        <p className="text-xs text-slate-400">Try adjusting your keyword or reset filters.</p>
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedDept("ALL");
                            setSelectedStatus("ALL");
                          }}
                          className="text-xs text-emerald-800 font-semibold hover:underline"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map(emp => {
                    const activeContract = emp.contracts?.find(c => c.status === "ACTIVE");
                    const isCompliant = Boolean(emp.bank_account_no && emp.tax_id);

                    return (
                      <tr
                        key={emp.id}
                        onClick={() => onSelectEmployee(emp)}
                        className="hover:bg-slate-50/80 transition cursor-pointer group"
                      >
                        {/* Employee Name & Email */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={emp.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                              alt={emp.first_name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-semibold text-slate-900 group-hover:text-emerald-900 transition flex items-center gap-1.5">
                                {emp.first_name} {emp.last_name}
                                {emp.id === 1 && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                                    HERO DEMO
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400">{emp.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Dept & Position */}
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{emp.job_position}</div>
                          <div className="text-[11px] text-slate-400">{emp.department}</div>
                        </td>

                        {/* Active Contract */}
                        <td className="py-3.5 px-4">
                          {activeContract ? (
                            <div>
                              <span className="font-mono font-semibold text-slate-900 text-xs">
                                ${activeContract.wage.toLocaleString()}/mo
                              </span>
                              <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                {emp.schedule_name || "Standard 40h"}
                              </div>
                            </div>
                          ) : (
                            <span className="text-amber-600 text-xs font-medium">No Active Contract</span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              emp.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                                : "bg-amber-50 text-amber-800 border border-amber-200/60"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                emp.status === "ACTIVE" ? "bg-emerald-600" : "bg-amber-600"
                              }`}
                            />
                            {emp.status === "ACTIVE" ? "Active" : "On Leave"}
                          </span>
                        </td>

                        {/* Preflight Badge */}
                        <td className="py-3.5 px-4">
                          {isCompliant ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Ready for Payrun
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              Missing Bank/Tax ID
                            </span>
                          )}
                        </td>

                        {/* Action Link */}
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F2F1E] group-hover:text-emerald-700">
                            Profile <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GRID CARDS VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map(emp => {
            const activeContract = emp.contracts?.find(c => c.status === "ACTIVE");
            const isCompliant = Boolean(emp.bank_account_no && emp.tax_id);

            return (
              <div
                key={emp.id}
                onClick={() => onSelectEmployee(emp)}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                        alt={emp.first_name}
                        className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-semibold text-slate-900 group-hover:text-emerald-900 transition flex items-center gap-1.5">
                          {emp.first_name} {emp.last_name}
                          {emp.id === 1 && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                              HERO
                            </span>
                          )}
                        </h4>
                        <div className="text-xs text-slate-500">{emp.job_position}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        emp.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                          : "bg-amber-50 text-amber-800 border border-amber-200/60"
                      }`}
                    >
                      {emp.status === "ACTIVE" ? "Active" : "On Leave"}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400">Department</span>
                      <div className="font-medium text-slate-800">{emp.department}</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400">Active Contract</span>
                      <div className="font-mono font-semibold text-slate-900">
                        {activeContract ? `$${activeContract.wage.toLocaleString()}/mo` : "None"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {isCompliant ? (
                    <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Compliant
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" /> Missing Bank/Tax
                    </span>
                  )}

                  <span className="font-semibold text-[#0F2F1E] group-hover:text-emerald-700 flex items-center gap-1">
                    View Profile <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEmployee={onAddEmployee}
        schedules={schedules}
      />
    </div>
  );
};
