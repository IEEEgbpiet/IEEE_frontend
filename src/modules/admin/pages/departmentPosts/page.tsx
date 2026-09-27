import { Link } from "react-router-dom";

export default function DepartmentPostsHub() {
  const departments = ["CSE", "AIML", "EE", "ECE", "BT"];

  return (
    <div className="space-y-6 bg-black text-white">
      <div className="border-b border-white/10 pb-3">
        <h1 className="text-xl font-semibold text-white">
          Posts Panel for Department
        </h1>
      </div>

      {/* 5 Cards as specified in Page 10 Wireframe */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => (
          <Link
            key={dept}
            to={`/admin/department-posts/${dept}`}
            className="flex h-36 items-center justify-center rounded-xl border border-white/15 bg-zinc-950 p-6 text-center transition hover:border-white/40 hover:bg-zinc-900"
          >
            <span className="font-mono text-2xl font-bold tracking-wider text-white">
              {dept}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
