import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

type LinkCardProps = {
  title: string;
  to: string;
  description?: string;
};

export default function LinkCard({
  title,
  to,
  description,
}: LinkCardProps) {
  return (
    <Link
      to={to}
      className="group flex min-h-32 flex-col justify-between rounded-xl border border-white/15 bg-admin-card p-6 text-white transition-all duration-200 hover:border-blue-400/40 hover:bg-admin-card-hover"
    >
      <div>
        <h2 className="text-base font-semibold tracking-wide text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-xs text-slate-400">
            {description}
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <ArrowUpRight
          size={18}
          className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
        />
      </div>
    </Link>
  );
}