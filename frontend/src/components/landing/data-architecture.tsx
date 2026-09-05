"use client";

import { motion } from "framer-motion";

interface EntityRow {
  entity: string;
  scope: string;
  keys: string;
  invariants: string;
}

const ENTITIES: EntityRow[] = [
  {
    entity: "employees",
    scope: "Core HR",
    keys: "id, name, email, department, designation, status",
    invariants: "Must have an active employment status to enter payrun",
  },
  {
    entity: "contracts",
    scope: "Compensation",
    keys: "id, employee_id, start_date, end_date, salary, status",
    invariants: "Must overlap payrun period; exactly one active contract per period",
  },
  {
    entity: "attendance",
    scope: "Time & Attendance",
    keys: "id, employee_id, date, check_in, check_out, worked_hours",
    invariants: "Daily worked hours feed hourly overtime and attendance rates",
  },
  {
    entity: "leave_requests",
    scope: "Time Off",
    keys: "id, employee_id, leave_type_id, start_date, end_date, status",
    invariants: "Only status = 'APPROVED' requests apply to leave deduction rule",
  },
  {
    entity: "salary_rules",
    scope: "Payroll Engine",
    keys: "id, structure_id, name, type, value, sequence, category",
    invariants: "Evaluated strictly in sequence ASC order; formulas are deterministic",
  },
  {
    entity: "payruns",
    scope: "Payroll Lifecycle",
    keys: "id, period_start, period_end, status",
    invariants: "State machine: DRAFT → CALCULATED → VALIDATED → PAID",
  },
  {
    entity: "payslips & lines",
    scope: "Payrun Artifacts",
    keys: "id, payrun_id, employee_id, gross, deductions, net",
    invariants: "Net = Gross - Deductions; each line item records source rule and trace",
  },
];

interface GuardrailItem {
  scenario: string;
  expectedBehavior: string;
  preflightProtection: string;
}

const GUARDRAILS: GuardrailItem[] = [
  {
    scenario: "Missing / Incomplete HR Data",
    expectedBehavior: "Blocks payrun finalization with actionable warnings",
    preflightProtection: "Validates all employee timecards before calculate phase",
  },
  {
    scenario: "Expired / Missing Active Contract",
    expectedBehavior: "Surfaces missing contract alert without generating bad payslip",
    preflightProtection: "Preflight contract resolver verifies period overlap",
  },
  {
    scenario: "Duplicate Payrun Attempt",
    expectedBehavior: "Prevents secondary generation for identical period and employee scope",
    preflightProtection: "Database unique constraint on [payrun_id, employee_id]",
  },
  {
    scenario: "What-If Temporary Calculation",
    expectedBehavior: "Calculates in sandbox memory; never touches finalized ledger",
    preflightProtection: "Requires explicit user confirmation to commit simulated delta",
  },
];

export function DataArchitecture() {
  return (
    <section id="architecture" className="w-full py-16 bg-[#F6F7F2] border-b border-[#E8F3E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section 1: Relational Schema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="max-w-3xl mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#0F2F1E] text-white">
                PRD Section 5
              </span>
              <span className="text-xs font-semibold text-[#0F2F1E] uppercase tracking-wider">
                Relational Data Architecture
              </span>
            </div>
            <h2 className="text-3xl font-semibold text-[#0F2F1E] font-serif tracking-tight">
              Normalized Entities & Database Invariants
            </h2>
            <p className="mt-2 text-sm text-[#5C645C]">
              Postgres relational data model linking employment contracts, timecards, and sequenced rules into immutable payslip line items.
            </p>
          </div>

          <div className="border border-[#E8F3E6] rounded-xl overflow-hidden bg-[#FFFFFF]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F6F7F2] text-[#5C645C] border-b border-[#E8F3E6]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Entity</th>
                    <th className="py-3 px-4 font-semibold">Domain</th>
                    <th className="py-3 px-4 font-semibold">Primary Fields</th>
                    <th className="py-3 px-4 font-semibold">System Invariant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8F3E6] text-[#1A1A1A]">
                  {ENTITIES.map((row) => (
                    <tr key={row.entity} className="hover:bg-[#F6F7F2]">
                      <td className="py-3 px-4 font-mono font-bold text-[#0F2F1E]">
                        {row.entity}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#E8F3E6] text-[#0F2F1E] font-medium text-[11px]">
                          {row.scope}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#5C645C]">
                        {row.keys}
                      </td>
                      <td className="py-3 px-4 text-[#1A1A1A]">
                        {row.invariants}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Edge Cases & Preflight Guardrails */}
        <div id="guardrails">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#0F2F1E] text-white">
                PRD Section 8
              </span>
              <span className="text-xs font-semibold text-[#0F2F1E] uppercase tracking-wider">
                Reliability & Safety
              </span>
            </div>
            <h2 className="text-3xl font-semibold text-[#0F2F1E] font-serif tracking-tight">
              Critical Edge Cases & Preflight Guardrails
            </h2>
            <p className="mt-2 text-sm text-[#5C645C]">
              Enterprise payroll demands absolute integrity. The system intercepts invalid inputs and prevents corrupting payruns.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GUARDRAILS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="p-5 rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] space-y-2"
              >
                <div className="flex justify-between items-center pb-2 border-b border-[#E8F3E6]">
                  <span className="text-xs font-bold text-[#0F2F1E] uppercase tracking-wider">
                    Edge Case: {item.scenario}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F3E6] text-[#0F2F1E]">
                    Guarded
                  </span>
                </div>
                <div className="text-xs text-[#1A1A1A]">
                  <strong>System Action:</strong> {item.expectedBehavior}
                </div>
                <div className="text-xs text-[#5C645C]">
                  <strong>Demo Protection:</strong> {item.preflightProtection}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
