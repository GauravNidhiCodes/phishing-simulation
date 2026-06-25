'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowLeft, Info, CheckCircle2, Check, X } from 'lucide-react';
import Link from 'next/link';
import PPLogo from '@/components/layout/PPLogo';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const qEmail = searchParams.get('email');
    const qToken = searchParams.get('token');
    if (qEmail) setEmail(qEmail);
    if (qToken) setToken(qToken);
  }, [searchParams]);

  // Strong password validations
  const isMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasDigit = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isMatch = newPassword && newPassword === confirmPassword;

  const isValidPassword = isMinLength && hasUpperCase && hasDigit && hasSpecial && isMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPassword) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Reset failed');
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Server error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="glass-panel py-8 px-6 sm:px-10 rounded-3xl border border-white/5 shadow-2xl relative"
    >
      {success ? (
        <div className="space-y-6 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-brand-emerald/5 border border-brand-emerald/10 text-gray-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <CheckCircle2 size={14} className="text-brand-emerald" /> Password Updated Successfully
            </div>
            <p className="leading-relaxed">
              Your security credentials have been updated in the Pinkman database. You can now login with your new credentials.
            </p>
          </div>

          <Link
            href="/auth/login"
            className="w-full py-3 rounded-xl bg-brand-blue text-white font-semibold flex items-center justify-center gap-1.5 transition text-center shadow-lg shadow-brand-blue/10 cursor-pointer"
          >
            Proceed to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
          {error && (
            <div className="p-3.5 rounded-2xl bg-brand-rose/5 border border-brand-rose/10 flex items-start gap-2.5 text-brand-rose">
              <Info size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-gray-500 uppercase font-bold flex items-center gap-1">
              <Mail size={12} /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@company.in"
              className="w-full p-3 rounded-xl glass-input placeholder-gray-600 focus:outline-none"
            />
          </div>

          {/* Reset Token */}
          <div className="space-y-1">
            <label className="text-gray-500 uppercase font-bold flex items-center gap-1">
              <Lock size={12} /> Reset Token
            </label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="e.g. RST-XXXXXX"
              className="w-full p-3 rounded-xl glass-input placeholder-gray-600 focus:outline-none"
            />
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label className="text-gray-500 uppercase font-bold flex items-center gap-1">
              <Lock size={12} /> New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 8 characters, Upper, Number, Symbol"
              className="w-full p-3 rounded-xl glass-input placeholder-gray-600 focus:outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-gray-500 uppercase font-bold flex items-center gap-1">
              <Lock size={12} /> Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full p-3 rounded-xl glass-input placeholder-gray-600 focus:outline-none"
            />
          </div>

          {/* Password Validation checklist */}
          <div className="p-3.5 rounded-2xl bg-white/2 border border-white/5 space-y-1.5 text-[10px] text-gray-500">
            <div className="font-bold text-white uppercase text-[8px] tracking-wider mb-1">Password Strength Checklist:</div>
            <div className="flex items-center gap-1">
              {isMinLength ? <Check size={11} className="text-brand-emerald" /> : <X size={11} className="text-brand-rose" />}
              <span>At least 8 characters</span>
            </div>
            <div className="flex items-center gap-1">
              {hasUpperCase ? <Check size={11} className="text-brand-emerald" /> : <X size={11} className="text-brand-rose" />}
              <span>At least one UPPERCASE letter</span>
            </div>
            <div className="flex items-center gap-1">
              {hasDigit ? <Check size={11} className="text-brand-emerald" /> : <X size={11} className="text-brand-rose" />}
              <span>At least one number (0-9)</span>
            </div>
            <div className="flex items-center gap-1">
              {hasSpecial ? <Check size={11} className="text-brand-emerald" /> : <X size={11} className="text-brand-rose" />}
              <span>At least one special character (!@#$)</span>
            </div>
            <div className="flex items-center gap-1">
              {isMatch ? <Check size={11} className="text-brand-emerald" /> : <X size={11} className="text-brand-rose" />}
              <span>Passwords match</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={loading || !isValidPassword}
              className="w-full py-3 rounded-xl bg-brand-blue text-white font-semibold flex items-center justify-center gap-1.5 hover:brightness-110 hover:shadow-[0_0_15px_rgba(229,9,20,0.3)] shadow-lg shadow-brand-blue/10 disabled:brightness-50 transition border border-white/5 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                <>Reset Account Password</>
              )}
            </button>

            <Link
              href="/auth/login"
              className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/10 font-semibold flex items-center justify-center gap-1.5 transition text-center"
            >
              Cancel & Return
            </Link>
          </div>
        </form>
      )}
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-cyber-dark select-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-3">
        <div className="flex justify-center mb-1">
          <PPLogo size={40} className="animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Reset Password</h2>
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold block">
          Pinkman Protects Secure Audit Node
        </span>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Suspense fallback={
          <div className="glass-panel py-8 px-6 rounded-3xl border border-white/5 text-center text-gray-500 text-xs font-mono">
            Hydrating parameters...
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
