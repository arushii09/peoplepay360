"use client";

import * as React from "react";
import { useState } from "react";
import { LogIn, Lock, Mail, CheckCircle2 } from "lucide-react";

interface SignIn2Props {
  onSwitchToSignUp?: () => void;
}

const SignIn2 = ({ onSwitchToSignUp }: SignIn2Props) => {
  const [email, setEmail] = useState("alex@peoplepay.com");
  const [password, setPassword] = useState("••••••••");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (emailVal: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
  };

  const handleSignIn = () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent rounded-xl z-1 py-10">
      <div className="w-full max-w-sm bg-gradient-to-b from-emerald-50/40 to-white rounded-3xl shadow-xl shadow-opacity-10 p-8 flex flex-col items-center border border-emerald-100/80 text-slate-900">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0F2F1E] text-[#9FD067] mb-6 shadow-md">
          <LogIn className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2 text-center text-[#0F2F1E]">
          Sign in to PeoplePay360
        </h2>
        <p className="text-slate-500 text-xs mb-6 text-center">
          Access your organization&apos;s connected HR operations and payroll workspace.
        </p>

        {success && (
          <div className="w-full mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Authenticated successfully.</span>
          </div>
        )}

        <div className="w-full flex flex-col gap-3 mb-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Email address"
              type="email"
              value={email}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 bg-slate-50/60 text-slate-800 text-xs"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 bg-slate-50/60 text-slate-800 text-xs"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-full flex justify-between items-center">
            {error ? (
              <div className="text-xs text-red-600 text-left font-medium">{error}</div>
            ) : <div />}
            <button className="text-xs hover:underline font-medium text-slate-500">
              Forgot password?
            </button>
          </div>
        </div>

        <button
          onClick={handleSignIn}
          className="w-full bg-[#0F2F1E] text-white font-semibold py-2.5 rounded-xl shadow-xs hover:bg-[#1F4D32] cursor-pointer transition mb-3 mt-2 text-xs"
        >
          Sign In
        </button>

        <div className="text-center mb-3">
          <span className="text-xs text-slate-500">Don&apos;t have an account? </span>
          <button
            onClick={onSwitchToSignUp}
            className="text-xs font-semibold text-[#0F2F1E] hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </div>

        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-slate-200"></div>
          <span className="mx-2 text-[11px] font-mono text-slate-400">Or sign in with</span>
          <div className="flex-grow border-t border-dashed border-slate-200"></div>
        </div>

        <div className="flex gap-3 w-full justify-center mt-2">
          <button className="flex items-center justify-center w-12 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition grow cursor-pointer">
            <img
              src="https://cdn.21st.dev/assets/mirror/38/38146bfd9eff6dbf0d74771f2e625c70d87d3770e0d080dbb6e50db1d5403f46.svg"
              alt="Google"
              className="w-5 h-5"
            />
          </button>
          <button className="flex items-center justify-center w-12 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition grow cursor-pointer">
            <img
              src="https://cdn.21st.dev/assets/mirror/49/49c99a2bb048f4c4941540ccf601621071669cdd1f51e52312a412f23bb2d5fa.svg"
              alt="Facebook"
              className="w-5 h-5"
            />
          </button>
          <button className="flex items-center justify-center w-12 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition grow cursor-pointer">
            <img
              src="https://cdn.21st.dev/assets/mirror/c2/c221b3f2143cf5d8d85a3b68da84dbae21b18db4164e63ca8c07c6ffdbb922c4.svg"
              alt="Apple"
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export { SignIn2 };
export default SignIn2;
