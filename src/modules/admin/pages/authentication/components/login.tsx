import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function App() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('ieee@gbpiet.ac.in');
  const [password, setPassword] = useState('ieee@#123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-5 py-10">
      {/* LOGIN CARD */}
      <div className="w-full max-w-[440px] rounded-2xl border border-slate-200 bg-white px-7 py-9 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:px-10 sm:py-11">
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img
            src="/images/IeeeLogo.webp"
            alt="IEEE GBPIET"
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* TITLE */}
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-slate-900">IEEE GBPIET Portal</h1>
          <p className="mt-1 text-xs text-slate-500">Sign in with your registered admin credentials</p>
        </div>

        {/* FORM ERROR ALERT */}
        {error ? (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <p className="font-semibold">{error}</p>
              {error.toLowerCase().includes('unauthorized') && (
                <p className="mt-1 text-xs text-red-600">
                  This email is not registered as an IEEE Admin on the server. Please verify your admin email and password.
                </p>
              )}
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-800">
              Admin Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gbpiet.ac.in"
              autoComplete="email"
              required
              className="
                h-12
                w-full
                rounded-lg
                border
                border-slate-300
                bg-white
                px-4
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

          {/* PASSWORD */}
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-800">
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="
                  h-12
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-4
                  pr-12
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

              {/* PASSWORD VISIBILITY */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  p-1
                  text-slate-400
                  transition
                  hover:text-slate-700
                "
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.58 10.58a2 2 0 002.84 2.84"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.88 5.09A10.74 10.74 0 0112 4.75c5.5 0 9.5 7.25 9.5 7.25a17.4 17.4 0 01-3.1 4.2"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.61 6.61C3.76 8.46 2.5 12 2.5 12s3.5 7.25 9.5 7.25c1.44 0 2.75-.3 3.91-.79"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.5 12s3.5-7.25 9.5-7.25S21.5 12 21.5 12s-3.5 7.25-9.5 7.25S2.5 12 2.5 12Z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* SIGN IN BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              mt-2
              h-12
              w-full
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
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

