import { useState, useRef, useEffect, useCallback } from 'react';
import {
  KeyRound,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  Mail,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/services/adminApi';

export default function ChangePassword() {
  const { user } = useAuth();
  const adminEmail = user?.email || 'ieee@gbpiet.ac.in';

  // Multi-step states: 'init' | 'otp' | 'password' | 'done'
  const [step, setStep] = useState<'init' | 'otp' | 'password' | 'done'>('init');

  // Step 1: OTP sending
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 2: OTP verification
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resetToken, setResetToken] = useState('');

  // Step 3: New Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Request OTP
  const handleRequestOtp = async () => {
    setIsSendingOtp(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await adminApi.generateResetOtp(adminEmail);
      setSuccessMsg(res.message || `Verification code sent to ${adminEmail}`);
      setResendCooldown(60);
      setStep('otp');
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Failed to send OTP to admin email. Please try again.'
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  // OTP inputs handling
  const handleDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...otpDigits];
      next[index] = '';
      setOtpDigits(next);
      return;
    }

    const next = [...otpDigits];
    next[index] = cleaned.slice(-1);
    setOtpDigits(next);

    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const next = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || '';
    }
    setOtpDigits(next);

    const targetIdx = Math.min(pasted.length, 5);
    otpInputRefs.current[targetIdx]?.focus();
  };

  // Verify OTP
  const handleVerifyOtp = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMsg('');

    try {
      const res = await adminApi.verifyResetOtp(adminEmail, fullOtp);
      if (!res.resetToken) {
        throw new Error('Verification completed but reset token was not received.');
      }
      setResetToken(res.resetToken);
      setSuccessMsg('OTP verified successfully! You can now define your new password.');
      setStep('password');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Invalid or expired OTP code. Please check your email or request a new code.'
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  }, [adminEmail, otpDigits]);

  // Auto-verify when 6 digits are typed
  useEffect(() => {
    const fullOtp = otpDigits.join('');
    if (fullOtp.length === 6 && step === 'otp' && !isVerifyingOtp && !resetToken) {
      handleVerifyOtp();
    }
  }, [otpDigits, step, isVerifyingOtp, resetToken, handleVerifyOtp]);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const passwordScore = getPasswordStrength(newPassword);

  // Submit Password Change
  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (!resetToken) {
      setErrorMsg('Security session expired. Please re-verify via OTP.');
      setStep('init');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await adminApi.resetPassword(newPassword, resetToken);
      setStep('done');
      setSuccessMsg('Admin password updated successfully.');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Failed to update password. Reset token may have expired.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetFlow = () => {
    setStep('init');
    setOtpDigits(['', '', '', '', '', '']);
    setResetToken('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="space-y-6 max-w-4xl text-white">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
          <KeyRound className="h-6 w-6 text-brand-blue-light" />
          Change Password & Security
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Update the master administrative credentials for the IEEE GBPIET Portal using secure two-factor OTP verification.
        </p>
      </div>

      {/* Account Info Pill */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-admin-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/15 text-brand-blue-light border border-brand-blue/30">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Target Admin Email</div>
            <div className="text-sm font-semibold font-mono text-white">{adminEmail}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          <span>OTP-Protected Endpoint</span>
        </div>
      </div>

      {/* Alert Notifications */}
      {errorMsg && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
          <div className="flex-1">
            <p className="font-semibold text-red-200">{errorMsg}</p>
          </div>
        </div>
      )}

      {successMsg && step !== 'done' && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
          <div className="flex-1 font-medium">{successMsg}</div>
        </div>
      )}

      {/* Main Flow Card */}
      <div className="rounded-2xl border border-white/10 bg-admin-card p-6 sm:p-8 shadow-xl">
        {/* STEP 1: INITIAL STATE (Send OTP) */}
        {step === 'init' && (
          <div className="space-y-6">
            <div className="max-w-xl">
              <h2 className="text-base font-semibold text-white">Initiate Password Change</h2>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                For administrative security, changing your password requires generating a 6-digit one-time password (OTP) sent to <strong className="text-white">{adminEmail}</strong>.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-admin-subtle p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
                <Shield className="h-4 w-4 text-brand-blue-light" />
                Security Verification Flow
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] text-white">1</span>
                  Click below to dispatch an authentication OTP to the admin inbox.
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] text-white">2</span>
                  Provide the 6-digit code to generate a temporary reset token.
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] text-white">3</span>
                  Set and confirm your new secure admin password.
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={isSendingOtp}
              className="
                inline-flex
                items-center
                justify-center
                gap-2.5
                rounded-lg
                bg-brand-blue
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-md
                transition-all
                hover:bg-brand-blue-cta
                active:scale-[0.99]
                focus:outline-none
                focus:ring-2
                focus:ring-brand-blue
                focus:ring-offset-2
                focus:ring-offset-admin-bg
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isSendingOtp ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Sending Verification OTP...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  Send Verification OTP to Email
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 'otp' && (
          <div className="space-y-6 max-w-lg">
            <div>
              <h2 className="text-base font-semibold text-white">Enter 6-Digit OTP</h2>
              <p className="mt-1 text-xs text-slate-400">
                A verification code was dispatched to <span className="text-white font-mono">{adminEmail}</span>. Please enter the 6 digits below.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex justify-between gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    className="
                      h-14
                      w-12
                      rounded-xl
                      border
                      border-white/20
                      bg-admin-subtle
                      text-center
                      font-mono
                      text-xl
                      font-bold
                      text-white
                      outline-none
                      transition-all
                      focus:border-brand-blue-light
                      focus:bg-admin-card-hover
                      focus:ring-2
                      focus:ring-brand-blue/30
                    "
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Didn't receive the email?</span>
                {resendCooldown > 0 ? (
                  <span className="text-slate-500 font-mono">Resend in {resendCooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={isSendingOtp}
                    className="font-medium text-brand-blue-light hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isVerifyingOtp || otpDigits.join('').length !== 6}
                  className="
                    flex-1
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-brand-blue
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    hover:bg-brand-blue-cta
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {isVerifyingOtp ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetFlow}
                  className="rounded-lg border border-white/10 px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 'password' && (
          <form onSubmit={handleSubmitNewPassword} className="space-y-5 max-w-lg">
            <div>
              <h2 className="text-base font-semibold text-white">Create New Password</h2>
              <p className="mt-1 text-xs text-slate-400">
                OTP confirmed. Enter your new password below (min 8 characters).
              </p>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter strong password"
                  required
                  className="
                    h-11
                    w-full
                    rounded-lg
                    border
                    border-white/15
                    bg-admin-subtle
                    pl-10
                    pr-10
                    text-sm
                    text-white
                    placeholder:text-slate-500
                    outline-none
                    transition
                    focus:border-brand-blue-light
                    focus:ring-2
                    focus:ring-brand-blue/30
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Strength Meter */}
            {newPassword && (
              <div className="space-y-1.5 rounded-lg border border-white/10 bg-admin-subtle p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Password Strength:</span>
                  <span
                    className={`font-semibold ${
                      passwordScore <= 2
                        ? 'text-red-400'
                        : passwordScore <= 3
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {passwordScore <= 2
                      ? 'Weak'
                      : passwordScore <= 3
                      ? 'Moderate'
                      : passwordScore === 4
                      ? 'Good'
                      : 'Strong'}
                  </span>
                </div>
                <div className="flex gap-1 h-1.5 w-full">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div
                      key={lvl}
                      className={`flex-1 rounded-full transition-all ${
                        passwordScore >= lvl
                          ? passwordScore <= 2
                            ? 'bg-red-500'
                            : passwordScore <= 3
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="
                    h-11
                    w-full
                    rounded-lg
                    border
                    border-white/15
                    bg-admin-subtle
                    pl-10
                    pr-10
                    text-sm
                    text-white
                    placeholder:text-slate-500
                    outline-none
                    transition
                    focus:border-brand-blue-light
                    focus:ring-2
                    focus:ring-brand-blue/30
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && (
                <p
                  className={`mt-1.5 text-xs flex items-center gap-1 ${
                    newPassword === confirmPassword ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {newPassword === confirmPassword ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Passwords match
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5" /> Passwords do not match
                    </>
                  )}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !newPassword || newPassword !== confirmPassword}
                className="
                  flex-1
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-brand-blue
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  hover:bg-brand-blue-cta
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  'Confirm & Update Password'
                )}
              </button>

              <button
                type="button"
                onClick={handleResetFlow}
                className="rounded-lg border border-white/10 px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'done' && (
          <div className="text-center py-6 space-y-4 max-w-md mx-auto">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h2 className="text-xl font-bold text-white">Password Updated Successfully!</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your IEEE Portal administrator password has been updated. Please remember this new password for your subsequent logins.
            </p>

            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleResetFlow}
                className="rounded-lg bg-brand-blue px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-blue-cta transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
