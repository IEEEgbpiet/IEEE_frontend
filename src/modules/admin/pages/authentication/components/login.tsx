import { useState } from 'react';

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Add your authentication logic here
    console.log({ username, password });
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-5 py-10">
      {/* LOGIN CARD */}
      <div className="w-full max-w-[420px] rounded-2xl border border-black/10 bg-white px-7 py-9 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:px-10 sm:py-11">
        {/* LOGO */}
        <div className="flex justify-center mb-7">
          <img
            src="/images/IeeeLogo.webp"
            alt="IEEE GBPIET"
            className="h-24 w-auto object-contain"
          />
        </div>

        {/* TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black">IEEE GBPIET Portal</h1>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* USERNAME */}
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-black">
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              required
              className="
                h-12
                w-full
                rounded-lg
                border
                border-black/20
                bg-white
                px-4
                text-sm
                text-black
                outline-none
                placeholder:text-black/40
                transition
                focus:border-[#00629B]
                focus:ring-1
                focus:ring-[#00629B]
              "
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-black">
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
                className="
                  h-12
                  w-full
                  rounded-lg
                  border
                  border-black/20
                  bg-white
                  px-4
                  pr-12
                  text-sm
                  text-black
                  outline-none
                  placeholder:text-black/40
                  transition
                  focus:border-[#00629B]
                  focus:ring-1
                  focus:ring-[#00629B]
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
                  text-black
                  transition
                  hover:text-brand-blue-dark
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

          {/* SIGN IN */}
          <button
            type="submit"
            className="
              mt-2
              h-12
              w-full
              rounded-lg
              bg-[#00629b]
              text-sm
              font-semibold
              text-white
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
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
