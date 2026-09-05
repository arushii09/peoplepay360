"use client";

import { motion } from "framer-motion";

interface OperationModule {
  title: string;
  scope: string;
  description: string;
  keyOutputs: string;
}

const MODULES: OperationModule[] = [
  {
    title: "Employees",
    scope: "Core Identity",
    description: "Centralized employee profiles linking job designations, department hierarchies, and bank routing credentials.",
    keyOutputs: "Unified profile ID, tax residency status, joining date",
  },
  {
    title: "Contracts",
    scope: "Terms & Compensation",
    description: "Governs base wage structures, period validity schedules, and derived hourly/daily conversion rates.",
    keyOutputs: "Active contract resolver, period boundary lock",
  },
  {
    title: "Attendance",
    scope: "Time Records",
    description: "Ingests shift clock-ins, worked duration hours, and overtime logs without manual spreadsheet reconciliation.",
    keyOutputs: "Regular hours, overtime exception hours",
  },
  {
    title: "Time Off",
    scope: "Leave Governance",
    description: "Tracks approved paid time off, casual leaves, and unpaid absences with automated balance checks.",
    keyOutputs: "Approved leave days feed for salary deductions",
  },
  {
    title: "Salary Rules",
    scope: "Calculation Logic",
    description: "Deterministic rules sequenced in ascending order covering fixed allowances, percentage variables, and statutory deductions.",
    keyOutputs: "Ascending sequence execution, reproducible formula trace",
  },
  {
    title: "Payroll",
    scope: "Execution Engine",
    description: "End-to-end payrun generator enforcing preflight checks, pre-commit validation, and final disbursement locks.",
    keyOutputs: "Gross, deductions, and net payable ledger lines",
  },
];

export function HrOperations() {
  return (
    <section id="features" className="w-full py-16 bg-[#F6F7F2] border-b border-[#E8F3E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E6845]">
            HR Operations
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#0F2F1E] font-serif tracking-tight mt-1">
            Everything HR needs. One connected workflow.
          </h2>
          <p className="mt-2 text-sm text-[#5C645C]">
            Eliminate fragmented tools. Each module feeds directly into the next without CSV exports or manual intervention.
          </p>
        </motion.div>

        {/* 6 Connected Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((mod, idx) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.5,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E8F3E6]">
                  <span className="text-base font-bold text-[#0F2F1E] font-serif">
                    {mod.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F3E6] text-[#0F2F1E]">
                    {mod.scope}
                  </span>
                </div>

                <p className="text-xs text-[#5C645C] mt-3 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E8F3E6] text-[11px]">
                <span className="font-semibold text-[#0F2F1E]">Feeds into Payroll: </span>
                <span className="text-[#5C645C]">{mod.keyOutputs}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
