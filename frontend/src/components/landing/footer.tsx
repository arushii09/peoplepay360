"use client";

import { useState } from "react";

interface FooterProps {
  onOpenLegal: (type: "terms" | "privacy") => void;
}

export function Footer({ onOpenLegal }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#0F2F1E] text-[#F6F7F2] pt-16 pb-12 border-t border-[#1F4D32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1F4D32]">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1F4D32] flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9FD067"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22v-9" />
                  <path d="M12 13a5 5 0 0 1 5-5c3 0 4-3 4-3s-3 1-5 4" />
                  <path d="M12 10a5 5 0 0 0-5-5C4 5 3 2 3 2s3 1 5 4" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-[#F6F7F2] font-serif">
                PeoplePay360
              </span>
            </div>

            <p className="text-xs text-[#9AA29A] leading-relaxed max-w-sm">
              Integrated HR & Payroll platform. Connecting employee records, contracts, attendance, time off, salary rules, and payruns into accurate, explainable calculations.
            </p>

            <div className="text-xs text-[#9AA29A]">
              Built strictly per Enterprise Payroll specifications.
            </div>
          </div>

          {/* Solutions Col */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#9FD067]">
              Platform Solutions
            </div>
            <ul className="space-y-2 text-xs text-[#9AA29A]">
              <li>
                <a href="#how-it-works" className="hover:text-[#F6F7F2] transition-colors">
                  Contract Resolver
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#F6F7F2] transition-colors">
                  Attendance & Leave Feed
                </a>
              </li>
              <li>
                <a href="#explainable-payroll" className="hover:text-[#F6F7F2] transition-colors">
                  Explainable Rule Engine
                </a>
              </li>
              <li>
                <a href="#what-if" className="hover:text-[#F6F7F2] transition-colors">
                  What-If Simulation Sandbox
                </a>
              </li>
              <li>
                <a href="#safety" className="hover:text-[#F6F7F2] transition-colors">
                  Preflight Safety & Guardrails
                </a>
              </li>
            </ul>
          </div>

          {/* Governance & Legal Col */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#9FD067]">
              Compliance & Legal
            </div>
            <ul className="space-y-2 text-xs text-[#9AA29A]">
              <li>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => onOpenLegal("terms")}
                  className="hover:text-[#F6F7F2] transition-colors text-left"
                >
                  Terms of Service (TOS)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => onOpenLegal("privacy")}
                  className="hover:text-[#F6F7F2] transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <a href="#safety" className="hover:text-[#F6F7F2] transition-colors">
                  Preflight Guardrails
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#F6F7F2] transition-colors">
                  HR Operations Directory
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Input Col */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#9FD067]">
              Stay Updated
            </div>
            <p className="text-xs text-[#9AA29A]">
              Receive payroll rule engine updates and release documentation.
            </p>

            {subscribed ? (
              <div className="p-2.5 rounded-lg bg-[#1F4D32] text-xs text-[#9FD067]">
                Thank you for subscribing to engineering updates.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                  type="email"
                  suppressHydrationWarning
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your enterprise email"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#1F4D32] border border-[#2E6845] text-xs text-[#F6F7F2] placeholder-[#9AA29A] focus:outline-none focus:border-[#9FD067]"
                />
                <button
                  type="submit"
                  suppressHydrationWarning
                  className="w-full py-2 px-3 rounded-lg bg-[#9FD067] text-[#0F2F1E] font-bold text-xs hover:bg-[#86b553] transition-colors"
                >
                  Subscribe to Updates
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9AA29A]">
          <div>
            © 2026 PeoplePay360 Inc. All operational calculations verified and deterministic.
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => onOpenLegal("terms")}
              className="hover:text-[#F6F7F2] underline transition-colors"
            >
              Terms of Service
            </button>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => onOpenLegal("privacy")}
              className="hover:text-[#F6F7F2] underline transition-colors"
            >
              Privacy Policy
            </button>
            <span>Enterprise Edition</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
