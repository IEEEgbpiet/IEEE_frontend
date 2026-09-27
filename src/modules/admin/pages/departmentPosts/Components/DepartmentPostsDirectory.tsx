import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type DeptPost = {
  id: string;
  name: string;
  date: string;
};

export default function DepartmentPostsDirectory() {
  const { dept = "CSE" } = useParams<{ dept: string }>();
  const navigate = useNavigate();

  const initialPosts: DeptPost[] = [
    {
      id: `${dept.toUpperCase()}-01`,
      name: `${dept.toUpperCase()} Coding Workshop`,
      date: "14 Sep 2026",
    },
    {
      id: `${dept.toUpperCase()}-02`,
      name: `${dept.toUpperCase()} Technical Seminar`,
      date: "20 Aug 2026",
    },
    {
      id: `${dept.toUpperCase()}-03`,
      name: `${dept.toUpperCase()} Project Exhibition`,
      date: "05 Jul 2026",
    },
  ];

  const [posts, setPosts] = useState<DeptPost[]>(initialPosts);

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <section className="space-y-6 bg-black text-white">
      <div className="border-b border-white/10 pb-3">
        <h1 className="text-xl font-semibold text-white">
          Department posts Directory
        </h1>
      </div>

      {/* Table matching Page 13 Wireframe */}
      <div className="overflow-hidden rounded-xl border border-white/15 bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-900 text-slate-200">
                <th className="px-5 py-3.5 font-semibold">Event Name</th>
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 font-semibold">Id</th>
                <th className="px-5 py-3.5 text-center font-semibold">Edit</th>
                <th className="px-5 py-3.5 text-center font-semibold">Del</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-white/5 last:border-0 hover:bg-zinc-900/40"
                >
                  <td className="px-5 py-4 text-white font-medium">
                    {post.name}
                  </td>

                  <td className="px-5 py-4 text-slate-400 text-xs">
                    {post.date}
                  </td>

                  <td className="px-5 py-4 font-mono text-slate-300 text-xs">
                    {post.id}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/department-posts/${dept}/edit/${post.id}`)}
                      className="rounded-md border border-white/20 bg-zinc-800 px-3 py-1 text-xs font-medium text-white transition hover:bg-zinc-700"
                    >
                      Edit
                    </button>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="rounded-md border border-red-500/20 bg-red-950/20 px-3 py-1 text-xs font-medium text-red-300 transition hover:bg-red-900/40"
                    >
                      Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
