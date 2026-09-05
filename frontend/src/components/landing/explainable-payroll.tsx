"use client";

import { motion } from "framer-motion";

export function ExplainablePayroll() {
  return (
    <section id="explainable-payroll" className="w-full py-16 bg-[#F6F7F2] border-b border-[#E8F3E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#0F2F1E] text-white">
              Signature Feature
            </span>
            <span className="text-xs font-semibold text-[#0F2F1E] uppercase tracking-wider">
              Explainable Payroll
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#0F2F1E] font-serif tracking-tight mt-1">
            Every number has a reason.
          </h2>
          <p className="mt-2 text-sm text-[#5C645C]">
            Eliminate employee confusion and payroll disputes. Every line item is tied directly to an approved contract clause or attendance record.
          </p>
        </motion.div>

        {/* Side-by-side comparison: [ Payslip UI ] and [ Calculation Trace ] */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: [ Payslip UI ] */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E8F3E6]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C645C]">
                  Payslip UI
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F3E6] text-[#0F2F1E]">
                  September 2026
                </span>
              </div>

              <div className="my-6">
                <div className="text-xs font-semibold text-[#5C645C] uppercase tracking-wider">
                  Net Salary
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-[#0F2F1E] font-serif mt-1">
                  ₹57,500
                </div>
                <p className="text-xs text-[#2E6845] mt-1 font-medium">
                  Disbursable to Aarav Mehta • Account verified
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#E8F3E6] text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-[#5C645C]">Gross Earnings:</span>
                  <span className="font-semibold text-[#1A1A1A]">₹65,500</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#5C645C]">Total Deductions:</span>
                  <span className="font-semibold text-[#1A1A1A]">₹8,000</span>
                </div>
                <div className="flex justify-between py-1 font-medium">
                  <span className="text-[#5C645C]">Employee ID:</span>
                  <span className="font-mono text-[#0F2F1E]">EMP-101 (Platform Eng)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8F3E6] text-[11px] text-[#5C645C]">
              Status: Verified against attendance exception logs and salary rule sequence.
            </div>
          </motion.div>

          {/* Right Column: [ Calculation Trace ] */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E8F3E6]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C645C]">
                  Calculation Trace
                </span>
                <span className="text-[11px] text-[#2E6845] font-semibold">
                  100% Deterministic Execution
                </span>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                {/* Basic Salary */}
                <div className="p-3 rounded-lg bg-[#F6F7F2] border border-[#E8F3E6] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#0F2F1E]">Basic Salary</div>
                    <div className="text-[11px] text-[#5C645C]">
                      Rule #10: 50% of Contract Base (₹60,000/mo)
                    </div>
                  </div>
                  <div className="font-mono font-bold text-[#0F2F1E] text-sm">
                    +₹30,000
                  </div>
                </div>

                {/* + Allowance */}
                <div className="p-3 rounded-lg bg-[#F6F7F2] border border-[#E8F3E6] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#0F2F1E]">+ Allowance (HRA & Special)</div>
                    <div className="text-[11px] text-[#5C645C]">
                      Rule #20 & #30: House Rent & Special balancing allowance
                    </div>
                  </div>
                  <div className="font-mono font-bold text-[#0F2F1E] text-sm">
                    +₹18,000
                  </div>
                </div>

                {/* + Overtime */}
                <div className="p-3 rounded-lg bg-[#F6F7F2] border border-[#E8F3E6] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#0F2F1E]">+ Overtime</div>
                    <div className="text-[11px] text-[#5C645C]">
                      Rule #40: 10 approved OT hours × ₹250/hr contract rate
                    </div>
                  </div>
                  <div className="font-mono font-bold text-[#2E6845] text-sm">
                    +₹2,500
                  </div>
                </div>

                {/* - Leave */}
                <div className="p-3 rounded-lg bg-[#F6F7F2] border border-[#E8F3E6] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#0F2F1E]">- Leave Deduction</div>
                    <div className="text-[11px] text-[#5C645C]">
                      Rule #50: 1 unpaid leave day × ₹2,000/day contract rate
                    </div>
                  </div>
                  <div className="font-mono font-bold text-[#1A1A1A] text-sm">
                    -₹2,000
                  </div>
                </div>

                {/* - Deduction */}
                <div className="p-3 rounded-lg bg-[#F6F7F2] border border-[#E8F3E6] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#0F2F1E]">- Statutory Deduction</div>
                    <div className="text-[11px] text-[#5C645C]">
                      Rule #60 & #70: PF (12% of Basic = ₹3,600) + TDS/Tax (₹2,400)
                    </div>
                  </div>
                  <div className="font-mono font-bold text-[#1A1A1A] text-sm">
                    -₹6,000
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E8F3E6] flex items-center justify-between text-xs">
              <span className="text-[#5C645C]">Final Calculated Sum:</span>
              <span className="font-mono font-bold text-[#0F2F1E] text-sm">
                ₹30,000 + ₹18,000 + ₹2,500 - ₹2,000 - ₹6,000 = ₹57,500
              </span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
