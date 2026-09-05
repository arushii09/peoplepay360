"use client";

import { motion } from "framer-motion";
import { WordsPullUp } from "@/components/ui/prisma-hero";

interface HeroProps {
  onOpenGetStarted: () => void;
}

export function Hero({ onOpenGetStarted }: HeroProps) {
  return (
    <section id="product" className="relative w-full pt-16 pb-20 border-b border-[#E8F3E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main headline and subtitle */}
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#0F2F1E] leading-[1.1] font-serif">
            <WordsPullUp text="Connected HR Activity. Every Number Explained." />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg sm:text-xl text-[#5C645C] max-w-2xl leading-relaxed font-normal"
          >
            PeoplePay360 connects employee data, attendance, time off and salary rules into one verified payroll workflow.
          </motion.p>

          {/* Action buttons matching wireframe: [ Get Started ] [ Explore Payroll ] */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              suppressHydrationWarning
              onClick={onOpenGetStarted}
              className="px-6 py-3 rounded-lg bg-[#0F2F1E] text-white text-sm font-medium hover:bg-[#1F4D32] transition-colors"
            >
              Get Started
            </button>
            <a
              href="#how-it-works"
              className="px-6 py-3 rounded-lg bg-[#E7E9E1] text-[#0F2F1E] text-sm font-medium hover:bg-[#CBD2C4] transition-colors border border-[#CBD2C4]"
            >
              Explore Payroll
            </a>
          </motion.div>
        </div>

        {/* [ REAL PRODUCT DASHBOARD ] */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 rounded-xl border border-[#E8F3E6] bg-[#FFFFFF] overflow-hidden"
        >
          {/* Dashboard Application Header */}
          <div className="px-6 py-4 bg-[#F6F7F2] border-b border-[#E8F3E6] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#2E6845]" />
              <div>
                <span className="text-xs font-bold text-[#0F2F1E] uppercase tracking-wider">
                  Live Operations Dashboard
                </span>
                <span className="text-xs text-[#5C645C] ml-2 font-mono">
                  September 2026 Payrun Cycle
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded text-xs font-medium bg-[#E8F3E6] text-[#0F2F1E] border border-[#CBD2C4]">
                Preflight Status: Validated
              </span>
              <span className="px-2.5 py-1 rounded text-xs font-semibold bg-[#0F2F1E] text-white">
                Deterministic Engine Active
              </span>
            </div>
          </div>

          {/* Metric KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#E8F3E6] border-b border-[#E8F3E6]">
            <div className="p-5">
              <div className="text-xs text-[#5C645C]">Gross Monthly Payroll</div>
              <div className="text-xl font-bold text-[#0F2F1E] mt-1 font-serif">₹4,850,000</div>
              <div className="text-[11px] text-[#2E6845] mt-0.5">84 Active Contracts</div>
            </div>
            <div className="p-5">
              <div className="text-xs text-[#5C645C]">Attendance Compliance</div>
              <div className="text-xl font-bold text-[#0F2F1E] mt-1 font-serif">98.4%</div>
              <div className="text-[11px] text-[#5C645C] mt-0.5">Automated Exception Feed</div>
            </div>
            <div className="p-5">
              <div className="text-xs text-[#5C645C]">Rule Sequencing Fidelity</div>
              <div className="text-xl font-bold text-[#0F2F1E] mt-1 font-serif">100% Traceable</div>
              <div className="text-[11px] text-[#2E6845] mt-0.5">Zero Hardcoded Overrides</div>
            </div>
            <div className="p-5">
              <div className="text-xs text-[#5C645C]">Unexplained Deductions</div>
              <div className="text-xl font-bold text-[#0F2F1E] mt-1 font-serif">₹0</div>
              <div className="text-[11px] text-[#2E6845] mt-0.5">Full Mathematical Audit</div>
            </div>
          </div>

          {/* Active Employee Payrun Ledger Snapshot */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5C645C]">
                Active Period Ledger Snapshot
              </span>
              <span className="text-xs text-[#5C645C]">
                Showing 3 of 84 verified employee statements
              </span>
            </div>

            <div className="border border-[#E8F3E6] rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F6F7F2] text-[#5C645C] border-b border-[#E8F3E6]">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Employee</th>
                    <th className="py-2.5 px-4 font-semibold">Department</th>
                    <th className="py-2.5 px-4 font-semibold">Active Contract</th>
                    <th className="py-2.5 px-4 font-semibold">HR Inputs</th>
                    <th className="py-2.5 px-4 font-semibold">Preflight Check</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Net Payable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8F3E6] text-[#1A1A1A]">
                  <tr className="hover:bg-[#F6F7F2]">
                    <td className="py-3 px-4 font-medium text-[#0F2F1E]">
                      Aarav Mehta <span className="text-[11px] text-[#5C645C]">(EMP-101)</span>
                    </td>
                    <td className="py-3 px-4 text-[#5C645C]">Platform Engineering</td>
                    <td className="py-3 px-4 font-mono">₹60,000/mo</td>
                    <td className="py-3 px-4">10h Overtime, 1d Unpaid</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F3E6] text-[#0F2F1E]">
                        Pass (0 errors)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#0F2F1E]">
                      ₹57,500
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F6F7F2]">
                    <td className="py-3 px-4 font-medium text-[#0F2F1E]">
                      Priya Sharma <span className="text-[11px] text-[#5C645C]">(EMP-102)</span>
                    </td>
                    <td className="py-3 px-4 text-[#5C645C]">Product Design</td>
                    <td className="py-3 px-4 font-mono">₹75,000/mo</td>
                    <td className="py-3 px-4">Standard 22 days, 0h OT</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F3E6] text-[#0F2F1E]">
                        Pass (0 errors)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#0F2F1E]">
                      ₹72,200
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F6F7F2]">
                    <td className="py-3 px-4 font-medium text-[#0F2F1E]">
                      Rohan Verma <span className="text-[11px] text-[#5C645C]">(EMP-103)</span>
                    </td>
                    <td className="py-3 px-4 text-[#5C645C]">Infrastructure</td>
                    <td className="py-3 px-4 font-mono">₹55,000/mo</td>
                    <td className="py-3 px-4">4h Overtime, 0 leaves</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F3E6] text-[#0F2F1E]">
                        Pass (0 errors)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#0F2F1E]">
                      ₹53,100
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
