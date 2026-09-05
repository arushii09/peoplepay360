"use client";

import * as React from "react";
import { useState } from "react";
import { UserPlus, User, Lock, Mail, ShieldCheck } from "lucide-react";

interface SignUpProps {
  onSwitchToSignIn?: () => void;
}

const SignUp = ({ onSwitchToSignIn }: SignUpProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignUp = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("Please agree to terms & conditions.");
      return;
    }
    setError("");
    alert("Sign up successful! (Demo)");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent rounded-xl z-1 py-10">
      <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white rounded-3xl shadow-xl shadow-opacity-10 p-8 flex flex-col items-center border border-blue-100 text-black">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-5 shadow-lg shadow-opacity-5">
          <UserPlus className="w-7 h-7 text-black" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Create an account
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Join us today to bring your team, workflow, and operations together.
        </p>

        <div className="w-full flex flex-col gap-3 mb-2">
          {/* Full Name */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <User className="w-4 h-4" />
            </span>
            <input
              placeholder="Full Name"
              type="text"
              value={fullName}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Email address"
              type="email"
              value={email}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <input
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Terms checkbox */}
          <div className="flex items-center gap-2 mt-1">
            <input
              id="terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-200 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer select-none">
              I agree to the <span className="text-black font-medium hover:underline">Terms & Privacy Policy</span>
            </label>
          </div>

          {error && (
            <div className="text-xs text-red-500 text-left mt-1 font-medium">{error}</div>
          )}
        </div>

        <button
          onClick={handleSignUp}
          className="w-full bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-3 mt-2"
        >
          Create Account
        </button>

        {/* Switch to Sign In */}
        <div className="text-center mb-3">
          <span className="text-xs text-gray-500">Already have an account? </span>
          <button
            onClick={onSwitchToSignIn}
            className="text-xs font-semibold text-black hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </div>

        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
          <span className="mx-2 text-xs text-gray-400">Or sign up with</span>
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
        </div>

        <div className="flex gap-3 w-full justify-center mt-2">
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow">
            <img
              src="https://cdn.21st.dev/assets/mirror/38/38146bfd9eff6dbf0d74771f2e625c70d87d3770e0d080dbb6e50db1d5403f46.svg"
              alt="Google"
              className="w-6 h-6"
            />
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow">
            <img
              src="https://cdn.21st.dev/assets/mirror/49/49c99a2bb048f4c4941540ccf601621071669cdd1f51e52312a412f23bb2d5fa.svg"
              alt="Facebook"
              className="w-6 h-6"
            />
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow">
            <img
              src="https://cdn.21st.dev/assets/mirror/c2/c221b3f2143cf5d8d85a3b68da84dbae21b18db4164e63ca8c07c6ffdbb922c4.svg"
              alt="Apple"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export { SignUp };
export default SignUp;
