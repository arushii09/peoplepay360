"use client";

import { useState } from "react";

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GetStartedModal({ isOpen, onClose }: GetStartedModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [employeesCount, setEmployeesCount] = useState("50-250");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FFFFFF] border border-[#E8F3E6] rounded-xl p-6 text-[#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E8F3E6]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#0F2F1E] flex items-center justify-center">
              <svg
                width="14"
                height="14"
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
            <h2 className="text-base font-bold text-[#0F2F1E]">
              Get Started with PeoplePay360
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#E7E9E1] text-[#1A1A1A] hover:bg-[#CBD2C4] text-xs font-semibold"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#E8F3E6] text-[#0F2F1E] flex items-center justify-center font-bold text-lg">
              ✓
            </div>
            <p className="text-sm font-semibold text-[#0F2F1E]">
              Workspace Request Received!
            </p>
            <p className="text-xs text-[#5C645C]">
              Our engineering solutions team will provision your environment within 2 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            <p className="text-xs text-[#5C645C]">
              Experience connected HR and explainable payroll. Enter your details to provision a dedicated organizational workspace.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Mehta"
                  className="w-full px-3 py-2 rounded-lg bg-[#F6F7F2] border border-[#CBD2C4] text-[#1A1A1A] placeholder-[#9AA29A] focus:outline-none focus:border-[#0F2F1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 rounded-lg bg-[#F6F7F2] border border-[#CBD2C4] text-[#1A1A1A] placeholder-[#9AA29A] focus:outline-none focus:border-[#0F2F1E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Tech Labs"
                  className="w-full px-3 py-2 rounded-lg bg-[#F6F7F2] border border-[#CBD2C4] text-[#1A1A1A] placeholder-[#9AA29A] focus:outline-none focus:border-[#0F2F1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Employee Headcount
                </label>
                <select
                  value={employeesCount}
                  onChange={(e) => setEmployeesCount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#F6F7F2] border border-[#CBD2C4] text-[#1A1A1A] focus:outline-none focus:border-[#0F2F1E]"
                >
                  <option value="10-50">10 to 50 employees</option>
                  <option value="50-250">50 to 250 employees</option>
                  <option value="250-1000">250 to 1,000 employees</option>
                  <option value="1000+">1,000+ enterprise</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#0F2F1E] text-[#F6F7F2] font-semibold text-xs hover:bg-[#1F4D32] transition-colors mt-2"
            >
              Confirm & Provision Workspace
            </button>

            <div className="pt-2 text-center text-[11px] text-[#5C645C]">
              No credit card required. Includes pre-configured demo salary rules and attendance schemas.
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
