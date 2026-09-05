"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does PeoplePay360 connect HR activity directly to payroll?",
    answer:
      "Unlike traditional payroll setups that require manual CSV exports and batch uploads, PeoplePay360 resolves the active contract, queries approved time-off requests, and calculates attendance exception hours in real time. The salary rules engine consumes these live inputs as direct variables during payrun generation.",
  },
  {
    question: "How does the What-If Simulator prevent unauthorized changes to finalized payroll?",
    answer:
      "What-If evaluations operate strictly in a temporary calculation sandbox. The system creates an isolated simulation context in memory, applies hypothetical overtime or leave variations, and previews the resulting net pay delta. The finalized payrun ledger is never mutated unless an authorized Payroll Manager explicitly commits the change.",
  },
  {
    question: "Can organizations define custom salary structures and rules?",
    answer:
      "Yes. Salary structures support ordered, sequenced rules (sequence 10, 20, 30, etc.). Rules can be configured as fixed amounts, contract percentages, hourly overtime formulas, or daily leave deduction multiples. Rules execute in ascending sequence order so downstream taxes and deductions can reference previously computed allowances.",
  },
  {
    question: "What happens if an employee has incomplete attendance or no active contract?",
    answer:
      "Our preflight validation layer runs before payrun calculation. If an active employment contract is missing for the selected payroll period, or if attendance logs contain unresolved gaps, the system blocks finalization and highlights the exact missing fields so administrators can resolve issues proactively.",
  },
  {
    question: "Where are calculation formulas and audit trails stored?",
    answer:
      "Each generated payslip creates immutable payslip line items in the database. Every line item retains the source rule ID, sequence number, formula applied, and the operational input that triggered it, enabling 100% auditable traceability.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full py-16 bg-[#F6F7F2] border-b border-[#E8F3E6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E6845]">
            FAQ
          </span>
          <h2 className="text-3xl font-semibold text-[#0F2F1E] font-serif tracking-tight mt-1">
            Questions about PeoplePay360?
          </h2>
          <p className="mt-2 text-sm text-[#5C645C]">
            Detailed insights into our connected data models, simulation safety, and deterministic engine execution.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] overflow-hidden"
              >
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between text-sm font-semibold text-[#0F2F1E] hover:bg-[#F6F7F2] transition-colors"
                >
                  <span>{faq.question}</span>
                  <span className="w-6 h-6 flex items-center justify-center rounded-md bg-[#E7E9E1] text-[#0F2F1E] text-base font-bold ml-4 shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#5C645C] leading-relaxed border-t border-[#E8F3E6]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
