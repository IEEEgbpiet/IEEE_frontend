
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
      className="group flex min-h-32 flex-col justify-between
        rounded-xl border border-[#263e68] bg-[#101b38]
        p-5 text-white transition-all duration-200
        hover:-translate-y-1 hover:border-blue-500
        hover:bg-[#14264a] hover:shadow-lg
        hover:shadow-blue-950/30
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-blue-500"
    >
      <div>
        <h2 className="text-base font-semibold tracking-wide
          transition-colors group-hover:text-blue-400">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-sm text-slate-400">
            {description}
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <ArrowUpRight
          size={20}
          className="text-blue-400 transition-transform
            group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </div>
    </Link>
  );
}