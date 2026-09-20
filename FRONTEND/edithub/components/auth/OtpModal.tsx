'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Mail, Shield, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export function OtpModal({
  isOpen,
  onClose,
  onSuccess,
  title = 'Verify your email',
  description = 'Enter your email to receive a one-time code',
}: OtpModalProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('email');
      setEmail('');
      setOtp(Array(6).fill(''));
      setError('');
      setCountdown(0);
    }
  }, [isOpen]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: true },
      });
      if (otpError) {
        setError(otpError.message);
        return;
      }
      toast.success('Code sent! Check your inbox.');
      setStep('otp');
      setCountdown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setError('Failed to send code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join('');
    if (token.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token,
        type: 'email',
      });
      if (verifyError) {
        setError('Invalid or expired code. Please try again.');
        setOtp(Array(6).fill(''));
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
        return;
      }
      toast.success('Verified! Enjoy your download.');
      onSuccess();
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError('');
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: true },
      });
      if (otpError) {
        setError(otpError.message);
        return;
      }
      toast.success('New code sent!');
      setOtp(Array(6).fill(''));
      setCountdown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setError('Failed to resend. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/\D/g, '').slice(-1);
      const next = [...otp];
      next[index] = digit;
      setOtp(next);
      if (digit && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (otp[index]) {
          const next = [...otp];
          next[index] = '';
          setOtp(next);
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleOtpPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      if (!pasted) return;
      const next = Array(6).fill('');
      pasted.split('').forEach((ch, i) => {
        next[i] = ch;
      });
      setOtp(next);
      const focusIdx = Math.min(pasted.length, 5);
      inputRefs.current[focusIdx]?.focus();
    },
    []
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-md glass-dark border border-surface-border rounded-2xl shadow-glass overflow-hidden animate-fade-down">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="p-8">
          {/* Icon + header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
              <Shield size={22} className="text-accent" />
            </div>
            <h2 className="font-display text-xl font-bold text-text-primary">{title}</h2>
            <p className="text-text-muted text-sm mt-1.5">{description}</p>
          </div>

          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label
                  htmlFor="otp-email"
                  className="block text-sm font-medium text-text-secondary mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <input
                    id="otp-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    autoFocus
                    className="w-full bg-surface border border-surface-border rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
                  />
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-surface-border accent-accent"
                />
                <span className="text-sm text-text-secondary">
                  Remember me on this device
                </span>
              </label>

              {error && (
                <p className="text-sm text-error bg-error/10 border border-error/20 rounded-xl px-3 py-2.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent text-background-DEFAULT font-bold text-base shadow-glow-accent hover:bg-accent-light active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Sending&hellip;
                  </>
                ) : (
                  <>
                    <ArrowRight size={18} />
                    Send Code
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <p className="text-center text-sm text-text-secondary">
                Code sent to{' '}
                <span className="text-accent font-medium">{email}</span>
              </p>

              {/* 6-digit OTP inputs */}
              <div className="flex items-center justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    style={{ height: '3.25rem' }}
                    className={cn(
                      'w-11 text-center text-xl font-bold rounded-xl border transition-all duration-150',
                      'bg-surface text-text-primary',
                      'focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30',
                      digit ? 'border-accent/50 bg-accent/5' : 'border-surface-border'
                    )}
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-error bg-error/10 border border-error/20 rounded-xl px-3 py-2.5 text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || otp.join('').length < 6}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent text-background-DEFAULT font-bold text-base shadow-glow-accent hover:bg-accent-light active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Verifying&hellip;
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Verify &amp; Download
                  </>
                )}
              </button>

              {/* Resend / back */}
              <div className="flex items-center justify-between text-sm pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setOtp(Array(6).fill(''));
                    setError('');
                  }}
                  className="text-text-muted hover:text-text-secondary transition-colors"
                >
                  &larr; Change email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || loading}
                  className={cn(
                    'inline-flex items-center gap-1.5 transition-colors',
                    countdown > 0 || loading
                      ? 'text-text-muted cursor-default'
                      : 'text-accent hover:text-accent-light'
                  )}
                >
                  <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
