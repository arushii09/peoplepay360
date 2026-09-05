"use client";

import { motion } from "framer-motion";

interface SafetyCheck {
  title: string;
  trigger: string;
  protection: string;
}

const CHECKS: SafetyCheck[] = [
  {
    title: "Missing Data",
    trigger: "Incomplete attendance timestamps, unapproved time-off, or unlogged exceptions",
    protection: "Blocks payrun calculation and flags the exact missing fields so administrators can resolve data gaps before processing.",
  },
  {
    title: "Missing Contract",
    trigger: "Expired employment terms or absence of an active contract for the payroll period",
    protection: "Halts downstream rule evaluation; prevents orphaned payments and ensures every rupee is anchored to an approved legal agreement.",
  },
  {
    title: "Duplicate Payrun",
    trigger: "Accidental re-calculation or overlapping pay period submissions for the same roster",
    protection: "Enforces relational database unique constraints on period boundaries, permanently preventing duplicate disbursements.",
  },
];

export function SafetySection() {
  return (
    <section id="safety" className="w-full py-16 bg-[#F6F7F2] border-b border-[#E8F3E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E6845]">
            Safety & Preflight Verification
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#0F2F1E] font-serif tracking-tight mt-1">
            Payroll that catches problems before you do.
          </h2>
          <p className="mt-2 text-sm text-[#5C645C]">
            Enterprise guardrails prevent erroneous finalizations, expired contract leaks, and double payments before money leaves the account.
          </p>
        </motion.div>

        {/* 3 Preflight Checks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CHECKS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.5,
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E8F3E6]">
                  <span className="text-base font-bold text-[#0F2F1E] font-serif">
                    {item.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F3E6] text-[#0F2F1E]">
                    Guarded
                  </span>
                </div>

                <div className="mt-3 text-xs text-[#1A1A1A]">
                  <strong>Scenario:</strong> {item.trigger}
                </div>

                <p className="mt-3 text-xs text-[#5C645C] leading-relaxed">
                  {item.protection}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E8F3E6] text-[11px] text-[#2E6845] font-semibold">
                Preflight Verification: Enforced
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
