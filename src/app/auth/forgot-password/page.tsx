'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Mail, ArrowLeft, Info, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Request failed');
      } else {
        setMessage(data.message);
        setResetToken(data.resetToken);
      }
    } catch (err: any) {
      setError(err.message || 'Server error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-cyber-dark select-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-3">
        <ShieldAlert className="text-brand-cyan mx-auto animate-pulse" size={40} />
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Forgot Password</h2>
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold block">
          Pinkman Protects Secure Audit Node
        </span>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-panel py-8 px-6 sm:px-10 rounded-3xl border border-white/5 shadow-2xl relative"
        >
          {message ? (
            <div className="space-y-6 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-brand-emerald/5 border border-brand-emerald/10 text-gray-300 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <CheckCircle2 size={14} className="text-brand-emerald" /> Reset Link Dispatched
                </div>
                <p className="leading-relaxed">{message}</p>
              </div>

              {resetToken && (
                <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-3">
                  <div className="font-bold text-white uppercase text-[10px]">Evaluation Quick Reset:</div>
                  <p className="text-gray-400 leading-normal">
                    Click below to open the reset page directly populated with your mock token:
                  </p>
                  <Link
                    href={`/auth/reset-password?email=${encodeURIComponent(email)}&token=${resetToken}`}
                    className="inline-flex items-center gap-1 text-brand-cyan hover:underline font-bold"
                  >
                    Go to Reset Form <ArrowLeft size={12} className="rotate-180" />
                  </Link>
                </div>
              )}

              <Link
                href="/auth/login"
                className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/10 font-semibold flex items-center justify-center gap-1.5 transition text-center"
              >
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs font-mono">
              {error && (
                <div className="p-3.5 rounded-2xl bg-brand-rose/5 border border-brand-rose/10 flex items-start gap-2.5 text-brand-rose">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-gray-400 leading-relaxed text-left">
                Enter your verified organization email address. If verified, we will generate a password reset token for your account.
              </p>

              <div className="space-y-1.5">
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

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-semibold flex items-center justify-center gap-1.5 hover:brightness-110 disabled:brightness-50 transition"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  ) : (
                    <>Request Reset Code</>
                  )}
                </button>

                <Link
                  href="/auth/login"
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/10 font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <ArrowLeft size={14} /> Cancel & Return
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
