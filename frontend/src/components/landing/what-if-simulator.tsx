"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function WhatIfSimulator() {
  const [isSimulated, setIsSimulated] = useState(false);

  return (
    <section id="what-if" className="w-full py-16 bg-[#F6F7F2] border-b border-[#E8F3E6]">
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
              What-If Sandbox
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#0F2F1E] font-serif tracking-tight mt-1">
            Before payroll is final, ask &quot;What if?&quot;
          </h2>
          <p className="mt-2 text-sm text-[#5C645C]">
            Model adjustments, overtime shifts, and leave allocations with instant before/after calculation deltas before committing payruns.
          </p>
        </motion.div>

        {/* Simulation Card matching wireframe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] p-8 text-center"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#E8F3E6] text-xs">
            <span className="font-bold uppercase tracking-wider text-[#5C645C]">
              Scenario Modeling: Aarav Mehta
            </span>
            <span
              className={`px-2.5 py-0.5 rounded font-semibold ${
                isSimulated
                  ? "bg-[#0F2F1E] text-white"
                  : "bg-[#E8F3E6] text-[#0F2F1E]"
              }`}
            >
              {isSimulated ? "Simulation Active" : "Committed Baseline"}
            </span>
          </div>

          <div className="py-8 space-y-4">
            {/* Overtime parameter */}
            <div className="text-xs font-semibold text-[#5C645C] uppercase tracking-wider">
              Overtime Hours Variation
            </div>
            <div className="text-2xl font-bold font-mono text-[#0F2F1E]">
              {isSimulated ? "10h → 20h" : "10h (Current Baseline)"}
            </div>

            {/* Net Salary transition */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-[#5C645C] uppercase tracking-wider">
                Predicted Net Pay
              </div>
              <div className="text-4xl sm:text-5xl font-bold font-serif text-[#0F2F1E] mt-1">
                {isSimulated ? "₹57,500 → ₹61,700" : "₹57,500"}
              </div>
            </div>

            {/* Delta Callout */}
            {isSimulated ? (
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#E8F3E6] border border-[#2E6845] text-base font-bold text-[#0F2F1E] font-mono">
                +₹4,200 Delta
              </div>
            ) : (
              <div className="text-xs text-[#5C645C]">
                Click below to preview hypothetical 10h overtime increase.
              </div>
            )}

            {isSimulated && (
              <p className="text-xs text-[#5C645C] max-w-md mx-auto">
                Formula Reason: 10 additional overtime hours × ₹420/hr overtime rate = +₹4,200. Finalized payrun remains uncorrupted.
              </p>
            )}
          </div>

          {/* Action button matching wireframe: [ Run Simulation ] */}
          <div className="pt-4 border-t border-[#E8F3E6] flex justify-center">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setIsSimulated(!isSimulated)}
              className="px-6 py-3 rounded-lg bg-[#0F2F1E] text-white text-sm font-medium hover:bg-[#1F4D32] transition-colors"
            >
              {isSimulated ? "Reset to Baseline" : "Run Simulation"}
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
