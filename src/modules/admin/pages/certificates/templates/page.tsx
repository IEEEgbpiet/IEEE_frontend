import { useState } from "react";

export default function ManualCertificateEntry() {
  const [formData, setFormData] = useState({
    name: "",
    event: "IEEE Tech Symposium",
    date: "",
    branch: "CSE",
    position: "Participant",
  });

  const [message, setMessage] = useState("");

  const eventsList = [
    "IEEE Tech Symposium",
    "AI Workshop",
    "Robotics BootCamp",
    "Web Development",
    "VLSI Workshop",
  ];

  const branchList = [
    "CSE",
    "AIML",
    "EE",
    "ECE",
    "BT",
    "ME",
    "CE",
  ];

  const positionsList = [
    "Participant",
    "Winner",
    "1st Runner Up",
    "2nd Runner Up",
    "Coordinator",
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setMessage(`Certificate generated for ${formData.name}!`);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <section className="space-y-6 bg-black text-white max-w-xl">
      <div className="border-b border-white/10 pb-3">
        <h1 className="text-xl font-semibold text-white">
          Enter Details
        </h1>
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-400">
          {message}
        </div>
      )}

      {/* Form matching Page 5 Wireframe */}
      <form onSubmit={handleGenerate} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs text-slate-300 mb-1">
            Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter Name"
            className="w-full rounded-lg border border-white/15 bg-zinc-950 px-3.5 py-2 text-sm text-white outline-none focus:border-white/40"
          />
        </div>

        {/* Event (DropDown) */}
        <div>
          <label className="block text-xs text-slate-300 mb-1">
            Event (DropDown)
          </label>
          <select
            value={formData.event}
            onChange={(e) => setFormData({ ...formData, event: e.target.value })}
            className="w-full rounded-lg border border-white/15 bg-zinc-950 px-3.5 py-2 text-sm text-white outline-none focus:border-white/40"
          >
            {eventsList.map((evt) => (
              <option key={evt} value={evt} className="bg-zinc-950 text-white">
                {evt}
              </option>
            ))}
          </select>
        </div>

        {/* Date (Calender) */}
        <div>
          <label className="block text-xs text-slate-300 mb-1">
            Date (Calender)
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full rounded-lg border border-white/15 bg-zinc-950 px-3.5 py-2 text-sm text-white outline-none focus:border-white/40"
          />
        </div>

        {/* Branch (DropDown) */}
        <div>
          <label className="block text-xs text-slate-300 mb-1">
            Branch (DropDown)
          </label>
          <select
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            className="w-full rounded-lg border border-white/15 bg-zinc-950 px-3.5 py-2 text-sm text-white outline-none focus:border-white/40"
          >
            {branchList.map((b) => (
              <option key={b} value={b} className="bg-zinc-950 text-white">
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Postion ( Optional , Dropdown ) */}
        <div>
          <label className="block text-xs text-slate-300 mb-1">
            Postion ( Optional , Dropdown )
          </label>
          <select
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full rounded-lg border border-white/15 bg-zinc-950 px-3.5 py-2 text-sm text-white outline-none focus:border-white/40"
          >
            {positionsList.map((p) => (
              <option key={p} value={p} className="bg-zinc-950 text-white">
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="rounded-lg border border-white/20 bg-zinc-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition"
          >
            Generate
          </button>
        </div>
      </form>
    </section>
  );
}
