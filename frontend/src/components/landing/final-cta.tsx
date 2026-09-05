"use client";

import { motion } from "framer-motion";

interface FinalCtaProps {
  onOpenGetStarted: () => void;
}

export function FinalCta({ onOpenGetStarted }: FinalCtaProps) {
  return (
    <section className="w-full py-20 bg-[#F6F7F2] border-b border-[#E8F3E6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0F2F1E] font-serif tracking-tight">
            Ready to make payroll explainable?
          </h2>

          <p className="text-base sm:text-lg text-[#5C645C] max-w-xl mx-auto leading-relaxed">
            Connect contracts, attendance, and salary rules into one verified operational workflow with complete formula traceability.
          </p>

          <div className="pt-2">
            <button
              type="button"
              suppressHydrationWarning
              onClick={onOpenGetStarted}
              className="px-8 py-3.5 rounded-lg bg-[#0F2F1E] text-white text-sm sm:text-base font-medium hover:bg-[#1F4D32] transition-colors"
            >
              Get Started
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
