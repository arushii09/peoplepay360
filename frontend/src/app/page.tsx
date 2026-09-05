"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { PipelineFlow } from "@/components/landing/pipeline-flow";
import { HrOperations } from "@/components/landing/hr-operations";
import { ExplainablePayroll } from "@/components/landing/explainable-payroll";
import { WhatIfSimulator } from "@/components/landing/what-if-simulator";
import { SafetySection } from "@/components/landing/safety-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { LegalModal } from "@/components/landing/legal-modal";
import { LoginModal } from "@/components/landing/login-modal";
import { GetStartedModal } from "@/components/landing/get-started-modal";

export default function Home() {
  const [legalModalType, setLegalModalType] = useState<"terms" | "privacy" | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);

  const handleOpenLegal = (type: "terms" | "privacy") => {
    setLegalModalType(type);
  };

  const handleCloseLegal = () => {
    setLegalModalType(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F2] text-[#1A1A1A]">
      {/* 1. NAVBAR */}
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} />

      <main className="flex-1">
        {/* 2. HERO with [REAL PRODUCT DASHBOARD] */}
        <Hero onOpenGetStarted={() => setIsGetStartedOpen(true)} />

        {/* 3. HOW IT WORKS: From HR Activity to Accurate Payroll (01 -> 02 -> 03 -> 04) */}
        <PipelineFlow />

        {/* 4. HR OPERATIONS: Everything HR needs. One connected workflow */}
        <HrOperations />

        {/* 5. EXPLAINABLE PAYROLL: Every number has a reason. [Payslip UI] + [Calculation Trace] */}
        <ExplainablePayroll />

        {/* 6. WHAT-IF SIMULATOR: Before payroll is final, ask "What if?" */}
        <WhatIfSimulator />

        {/* 7. SAFETY: Payroll that catches problems before you do */}
        <SafetySection />

        {/* 8. FAQ: Questions about PeoplePay360? */}
        <FAQSection />

        {/* 9. FINAL CTA: Ready to make payroll explainable? [Get Started] */}
        <FinalCta onOpenGetStarted={() => setIsGetStartedOpen(true)} />
      </main>

      {/* 10. FOOTER */}
      <Footer onOpenLegal={handleOpenLegal} />

      {/* Interactive Modals */}
      <LegalModal
        isOpen={legalModalType !== null}
        onClose={handleCloseLegal}
        type={legalModalType}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />
    </div>
  );
}
