import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Shield,
  ShieldAlert,
} from 'lucide-react';
import { adminApi } from '@/services/adminApi';

type Step = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Steps state
  const [step, setStep] = useState<Step>('email');

  // Step 1: Email
  const [email, setEmail] = useState('ieee@gbpiet.ac.in');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Step 2: OTP (6 digits)
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccessMessage, setOtpSuccessMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resetToken, setResetToken] = useState('');

  // Step 3: New Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle Step 1: Generate & Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setEmailError('Please enter your administrator email address.');
      return;
    }

    setIsSendingOtp(true);
    setEmailError('');
    setOtpError('');

    try {
      const response = await adminApi.generateResetOtp(email.trim());
      setOtpSuccessMessage(response.message || 'Verification OTP sent to your registered email.');
      setResendCooldown(60);
      setStep('otp');
      // Auto-focus first OTP input on next tick
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      setEmailError(
        err instanceof Error
          ? err.message
          : 'Failed to send OTP. Please verify your email and try again.'
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpDigitChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    const digit = cleaned.slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);

    // Auto-advance to next input
    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation in OTP
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP Paste (pasting full 6 digits)
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const updated = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasted[i] || '';
    }
    setOtpDigits(updated);

    // Focus last filled index or next
    const targetIdx = Math.min(pasted.length, 5);
    otpInputRefs.current[targetIdx]?.focus();
  };

  // Handle Step 2: Verify OTP
  const handleVerifyOtp = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setOtpError('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    try {
      const response = await adminApi.verifyResetOtp(email.trim(), fullOtp);
      if (!response.resetToken) {
        throw new Error('Verification succeeded but reset token was not received.');
      }
      setResetToken(response.resetToken);
      setStep('password');
    } catch (err) {
      setOtpError(
        err instanceof Error
          ? err.message
          : 'Invalid or expired OTP. Please try again.'
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  }, [email, otpDigits]);

  // Auto-submit OTP when 6 digits are complete
  useEffect(() => {
    const fullOtp = otpDigits.join('');
    if (fullOtp.length === 6 && step === 'otp' && !isVerifyingOtp && !resetToken) {
      handleVerifyOtp();
    }
  }, [otpDigits, step, isVerifyingOtp, resetToken, handleVerifyOtp]);

  // Password Strength Calculation
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

  // Handle Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!resetToken) {
      setPasswordError('Reset session expired. Please restart the verification.');
      return;
    }

    setIsResettingPassword(true);
    setPasswordError('');

    try {
      await adminApi.resetPassword(newPassword, resetToken);
      setStep('success');
    } catch (err) {
      setPasswordError(
        err instanceof Error
          ? err.message
          : 'Failed to reset password. The reset token might have expired (valid for 10 minutes).'
      );
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[460px] rounded-2xl border border-slate-200 bg-white p-7 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <img
              src="/images/IeeeLogo.webp"
              alt="IEEE GBPIET"
              className="h-16 w-auto object-contain"
            />
          </Link>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        {step !== 'success' && (
          <div className="mb-6 flex items-center justify-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                step === 'email'
                  ? 'bg-[#00629b] text-white ring-4 ring-[#00629b]/15'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {step !== 'email' ? '✓' : '1'}
            </div>
            <div
              className={`h-1 w-10 rounded-full transition-all ${
                step === 'otp' || step === 'password' ? 'bg-[#00629b]' : 'bg-slate-200'
              }`}
            />
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                step === 'otp'
                  ? 'bg-[#00629b] text-white ring-4 ring-[#00629b]/15'
                  : step === 'password'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step === 'password' ? '✓' : '2'}
            </div>
            <div
              className={`h-1 w-10 rounded-full transition-all ${
                step === 'password' ? 'bg-[#00629b]' : 'bg-slate-200'
              }`}
            />
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                step === 'password'
                  ? 'bg-[#00629b] text-white ring-4 ring-[#00629b]/15'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              3
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 1: EMAIL IDENTIFICATION
        ============================================================ */}
        {step === 'email' && (
          <div>
            <div className="text-center mb-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#00629b]/10 text-[#00629b]">
                <KeyRound className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Forgot Password?</h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                Enter your registered IEEE administrator email to receive a 6-digit OTP verification code.
              </p>
            </div>

            {emailError && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                <div className="flex-1">
                  <p className="font-semibold">{emailError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-slate-800">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ieee@gbpiet.ac.in"
                    autoComplete="email"
                    required
                    className="
                      h-12
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      pl-11
                      pr-4
                      text-sm
                      text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      transition
                      focus:border-[#00629B]
                      focus:ring-2
                      focus:ring-[#00629B]/20
                    "
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Default registered administrator account: <span className="font-mono text-slate-600">ieee@gbpiet.ac.in</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isSendingOtp}
                className="
                  mt-2
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-[#00629b]
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-[#004F7D]
                  active:scale-[0.99]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#00629B]
                  focus:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >
                {isSendingOtp ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    Sending OTP...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-5 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#00629b] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign In
              </Link>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 2: OTP VERIFICATION (6 Digits)
        ============================================================ */}
        {step === 'otp' && (
          <div>
            <div className="text-center mb-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#00629b]/10 text-[#00629b]">
                <Shield className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Enter Verification Code</h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                We sent a 6-digit OTP code to:
              </p>
              <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-mono font-medium text-slate-800">
                <span>{email}</span>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-xs text-[#00629b] hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>

            {otpSuccessMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>{otpSuccessMessage}</span>
              </div>
            )}

            {otpError && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                <div className="flex-1">
                  <p className="font-semibold">{otpError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {/* 6-DIGIT INPUTS */}
              <div>
                <label className="mb-2 block text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  6-Digit OTP Code
                </label>
                <div className="flex justify-between gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="
                        h-13
                        w-12
                        rounded-xl
                        border-2
                        border-slate-200
                        bg-slate-50
                        text-center
                        font-mono
                        text-xl
                        font-bold
                        text-slate-900
                        outline-none
                        transition-all
                        focus:border-[#00629B]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#00629B]/15
                      "
                    />
                  ))}
                </div>
              </div>

              {/* VERIFY BUTTON */}
              <button
                type="submit"
                disabled={isVerifyingOtp || otpDigits.join('').length !== 6}
                className="
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-[#00629b]
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-[#004F7D]
                  active:scale-[0.99]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#00629B]
                  focus:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isVerifyingOtp ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    Verifying OTP...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </button>

              {/* RESEND OTP */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Didn't receive the code?</span>
                {resendCooldown > 0 ? (
                  <span className="font-medium text-slate-400">
                    Resend in <span className="font-mono text-slate-700">{resendCooldown}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={isSendingOtp}
                    className="font-semibold text-[#00629b] hover:underline transition-colors"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-5 text-center">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#00629b] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change Email Address
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 3: NEW PASSWORD CREATION
        ============================================================ */}
        {step === 'password' && (
          <div>
            <div className="text-center mb-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Create New Password</h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                OTP verified! Please set a new strong password for your administrator account.
              </p>
            </div>

            {passwordError && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                <div className="flex-1">
                  <p className="font-semibold">{passwordError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* NEW PASSWORD */}
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-1.5 block text-sm font-medium text-slate-800"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    required
                    className="
                      h-12
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      pl-11
                      pr-11
                      text-sm
                      text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      transition
                      focus:border-[#00629B]
                      focus:ring-2
                      focus:ring-[#00629B]/20
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* PASSWORD STRENGTH METER */}
              {newPassword && (
                <div className="space-y-1.5 rounded-lg bg-slate-50 p-3 border border-slate-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Strength:</span>
                    <span
                      className={`font-semibold ${
                        passwordScore <= 2
                          ? 'text-red-500'
                          : passwordScore <= 3
                          ? 'text-amber-500'
                          : 'text-emerald-600'
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
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 pt-1">
                    <span className={newPassword.length >= 8 ? 'text-emerald-600 font-medium' : ''}>
                      ✓ Min 8 characters
                    </span>
                    <span className={/[A-Z]/.test(newPassword) ? 'text-emerald-600 font-medium' : ''}>
                      ✓ Uppercase letter
                    </span>
                    <span className={/[0-9]/.test(newPassword) ? 'text-emerald-600 font-medium' : ''}>
                      ✓ Number
                    </span>
                    <span
                      className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-emerald-600 font-medium' : ''}
                    >
                      ✓ Special character
                    </span>
                  </div>
                </div>
              )}

              {/* CONFIRM PASSWORD */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1.5 block text-sm font-medium text-slate-800"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    required
                    className="
                      h-12
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      pl-11
                      pr-11
                      text-sm
                      text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      transition
                      focus:border-[#00629B]
                      focus:ring-2
                      focus:ring-[#00629B]/20
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword && (
                  <p
                    className={`mt-1.5 text-xs flex items-center gap-1 ${
                      newPassword === confirmPassword ? 'text-emerald-600 font-medium' : 'text-red-500'
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

              <button
                type="submit"
                disabled={isResettingPassword || !newPassword || newPassword !== confirmPassword}
                className="
                  mt-2
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-[#00629b]
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-[#004F7D]
                  active:scale-[0.99]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#00629B]
                  focus:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isResettingPassword ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    Updating Password...
                  </>
                ) : (
                  'Reset Password & Complete'
                )}
              </button>
            </form>
          </div>
        )}

        {/* ============================================================
            STEP 4: SUCCESS STATE
        ============================================================ */}
        {step === 'success' && (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">Password Reset Done!</h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Your administrator account password has been successfully updated. You can now log in using your new credentials.
            </p>

            <div className="mt-7 space-y-3">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-[#00629b]
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-[#004F7D]
                  active:scale-[0.99]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#00629B]
                  focus:ring-offset-2
                "
              >
                Proceed to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
