"use client";

import { motion } from "framer-motion";

interface StepItem {
  step: string;
  title: string;
  subtitle: string;
  items: string[];
}

const STEPS: StepItem[] = [
  {
    step: "01",
    title: "Employee",
    subtitle: "Contract",
    items: ["Active Contract Resolution", "Base Wage Agreement", "Derived Hourly & Daily Rates"],
  },
  {
    step: "02",
    title: "HR Activity",
    subtitle: "Attendance & Time Off",
    items: ["Worked Hours & Shifts", "Overtime Exception Logs", "Approved Paid & Unpaid Leave"],
  },
  {
    step: "03",
    title: "Calculation",
    subtitle: "Salary Rules & Payroll",
    items: ["Sequenced Rule Execution", "Deterministic Formulas", "Preflight Validation Check"],
  },
  {
    step: "04",
    title: "Payslip",
    subtitle: "Explainable & Verified",
    items: ["100% Itemized Audit Trace", "Immutable Line Items", "Printable / PDF Ready"],
  },
];

export function PipelineFlow() {
  return (
    <section id="how-it-works" className="w-full py-16 bg-[#F6F7F2] border-b border-[#E8F3E6]">
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
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#0F2F1E] font-serif tracking-tight mt-1">
            From HR Activity to Accurate Payroll
          </h2>
          <p className="mt-2 text-sm text-[#5C645C]">
            One unbroken operational chain connecting employment terms and daily workforce events directly into verified payroll.
          </p>
        </motion.div>

        {/* 4 Connected Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item, idx) => (
            <motion.div
              key={item.step}
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
                  <span className="text-2xl font-bold font-serif text-[#0F2F1E]">
                    {item.step}
                  </span>
                  {idx < 3 && (
                    <span className="text-xs font-bold text-[#5C645C] uppercase tracking-wider">
                      Step {idx + 1} →
                    </span>
                  )}
                  {idx === 3 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F3E6] text-[#0F2F1E]">
                      Output
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-bold text-[#0F2F1E] font-serif">
                    {item.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#2E6845] mt-0.5">
                    {item.subtitle}
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-xs text-[#5C645C]">
                  {item.items.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-[#0F2F1E] font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
