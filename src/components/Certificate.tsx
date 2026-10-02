
import { useState } from "react";

export default function CertificateForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    event: "",
    date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form Data:", formData);

  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-blue-400">
            IEEE GBPIET
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Certificate Registration
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
            Enter your details correctly to receive your participation
            certificate via email.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8"
        >
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Branch */}
            <div>
              <label
                htmlFor="branch"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Branch
              </label>

              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="" disabled>
                  Select your branch
                </option>
                <option value="CSE">Computer Science & Engineering</option>
                <option value="ECE">
                  Electronics & Communication Engineering
                </option>
                <option value="EE">Electrical Engineering</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="CE">Civil Engineering</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Event */}
            <div>
              <label
                htmlFor="event"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Event Participated In
              </label>

              <select
                id="event"
                name="event"
                value={formData.event}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="" disabled>
                  Select an event
                </option>
                <option value="Goojg">Goonj</option>
                <option value="Spandan">Spandan</option>
                <option value="Joosh">Joosh</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Event Date
              </label>

              <select
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="" disabled>
                  Select event date
                </option>

                {/* Replace these with actual event dates */}
                <option value="2026-09-20">20 September 2026</option>
                <option value="2026-09-21">21 September 2026</option>
                <option value="2026-09-22">22 September 2026</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.99]"
            >
              Submit & Get Certificate
            </button>
          </div>

          {/* Footer Note */}
          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            Please make sure your name and email address are correct.
            Your certificate will be sent to the provided email.
          </p>
        </form>
      </div>
    </div>
  );
}

