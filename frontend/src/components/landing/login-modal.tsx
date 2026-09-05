"use client";

import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FFFFFF] border border-[#E8F3E6] rounded-xl p-6 text-[#1A1A1A]"
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
              PeoplePay360 Workspace Login
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
              Authenticating credentials...
            </p>
            <p className="text-xs text-[#5C645C]">
              Connecting to secure payroll workspace.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Corporate Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full px-3 py-2 rounded-lg bg-[#F6F7F2] border border-[#CBD2C4] text-[#1A1A1A] placeholder-[#9AA29A] focus:outline-none focus:border-[#0F2F1E]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#1A1A1A]">
                  Password
                </label>
                <a href="#" className="text-[11px] text-[#0F2F1E] hover:underline">
                  Reset password
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 rounded-lg bg-[#F6F7F2] border border-[#CBD2C4] text-[#1A1A1A] placeholder-[#9AA29A] focus:outline-none focus:border-[#0F2F1E]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#0F2F1E] text-[#F6F7F2] font-semibold text-xs hover:bg-[#1F4D32] transition-colors mt-2"
            >
              Sign In to Payroll Dashboard
            </button>

            <div className="pt-3 border-t border-[#E8F3E6] text-center">
              <span className="text-[11px] text-[#5C645C]">
                Role-based access enforced. Contact your administrator for access.
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
